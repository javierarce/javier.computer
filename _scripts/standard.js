import fs from "fs";
import path from "path";
import crypto from "crypto";
import { pathToFileURL } from "url";

// Publishes javier.computer to the AT Protocol as standard.site records
// (https://standard.site): one `site.standard.publication` for the site and one
// `site.standard.document` per long-form post, then writes the resulting at://
// URIs into _data/standard.json so the Jekyll build can emit the matching
// <link rel="site.standard.document"> tags.
//
// Run: BLUESKY_APP_PASSWORD=xxxx node _scripts/standard.js
// Flags: --dry-run, --all, --since=YYYY-MM-DD, --unpublish.

// --- Configuration ---

const SITE_URL = "https://javier.computer";
const SITE_NAME = "Javier's computer";
const SITE_DESCRIPTION = "My computer on the net";

const BLUESKY_HANDLE = "javier.bsky.social";
const DID = "did:plc:mpvjloymxomrv3kk2eavmxkx";

// Fixed record key for the single publication record, so its at:// URI is
// stable and can be referenced verbatim from .well-known/site.standard.publication.
const PUBLICATION_RKEY = "self";

const POSTS_DIR = path.join("content", "_posts");
const DATA_FILE = path.join("_data", "standard.json");
const WELL_KNOWN_FILE = path.join(".well-known", "site.standard.publication");

const PUBLICATION_COLLECTION = "site.standard.publication";
const DOCUMENT_COLLECTION = "site.standard.document";

// Only publish posts on or after this date (YYYY-MM-DD); null = publish all.
// Override per run with --since=YYYY-MM-DD, or --all to publish everything.
const PUBLISH_SINCE = "2026-05-31";

// Only these post layouts become site.standard.document records.
// Quotes and videos are intentionally left out.
const DOCUMENT_LAYOUTS = ["post", "reportage", "photos/photo"];

// The publication's at:// URI is deterministic (fixed rkey), so we can build
// document.site references and the .well-known file without a network round-trip.
const PUBLICATION_URI = `at://${DID}/${PUBLICATION_COLLECTION}/${PUBLICATION_RKEY}`;

// How the publication renders in standard.site readers. Mirrors the site's
// default theme: black background, white text, yellow accent (--link / #ffc107).
const rgb = (r, g, b) => ({ $type: "site.standard.theme.color#rgb", r, g, b });
const PUBLICATION_THEME = {
  $type: "site.standard.theme.basic",
  background: rgb(0, 0, 0), // --color-bg-site (#000000)
  foreground: rgb(255, 255, 255), // --color-txt-site (#ffffff)
  accent: rgb(255, 193, 7), // --link / --yellow (#ffc107)
  accentForeground: rgb(0, 0, 0), // text on the yellow accent button
};

// --- TID record keys ---
//
// The site.standard.document lexicon requires record keys to be TIDs: 13-char,
// base32-sortable, timestamp-derived identifiers. We derive each post's TID
// deterministically from its publishedAt (so keys sort by publish date and stay
// stable across re-runs) plus a url-derived "clock id", so two posts sharing a
// timestamp (dates here are day-granular) still get distinct keys.
const S32 = "234567abcdefghijklmnopqrstuvwxyz";

function encodeTid(value) {
  let n = value;
  let s = "";
  for (let i = 0; i < 13; i++) {
    s = S32[Number(n & 31n)] + s;
    n >>= 5n;
  }
  return s;
}

function tidFor(publishedAtIso, url) {
  const micros = BigInt(Date.parse(publishedAtIso)) * 1000n;
  const h = crypto.createHash("sha256").update(url).digest();
  const clockId = BigInt(((h[0] << 8) | h[1]) & 0x3ff); // 10-bit disambiguator
  return encodeTid((micros << 10n) | clockId);
}

// --- Tiny .env loader (avoids a dotenv dependency) ---

function loadEnv() {
  if (!fs.existsSync(".env")) return;
  for (const line of fs.readFileSync(".env", "utf-8").split("\n")) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    const key = m[1];
    const value = m[2].replace(/^["'](.*)["']$/, "$1");
    if (!(key in process.env)) process.env[key] = value;
  }
}

export class Standard {
  constructor() {
    this.pds = null;
    this.accessJwt = null;
    this.dryRun = false;
    this.since = null;
  }

  parseArgs() {
    const args = process.argv.slice(2);
    this.dryRun = args.includes("--dry-run");
    // Delete every record this site has published (all documents + the
    // publication). The reverse of a normal run.
    this.unpublish = args.includes("--unpublish");

    let sinceStr = PUBLISH_SINCE;
    const sinceArg = args.find((a) => a.startsWith("--since="));
    if (sinceArg) sinceStr = sinceArg.split("=")[1];
    if (args.includes("--all")) sinceStr = null;

    this.since = sinceStr ? new Date(sinceStr) : null;
    if (this.since && isNaN(this.since.getTime())) {
      throw new Error(`Invalid --since date: ${sinceStr}`);
    }
  }

  log(msg) {
    process.stdout.write(`${msg}\n`);
  }

  // --- Auth ---

  // The DID document (via the PLC directory) tells us which PDS actually hosts
  // the repository, so writes go to the right server rather than the entryway.
  async resolvePds() {
    const res = await fetch(`https://plc.directory/${DID}`);
    if (!res.ok) throw new Error(`PLC lookup failed: ${res.status}`);
    const doc = await res.json();
    const service = (doc.service || []).find(
      (s) => s.id === "#atproto_pds" || s.type === "AtprotoPersonalDataServer",
    );
    if (!service) throw new Error("Could not find atproto PDS in DID document");
    this.pds = service.serviceEndpoint.replace(/\/$/, "");
  }

  async createSession() {
    const password = process.env.BLUESKY_APP_PASSWORD;
    if (!password) {
      throw new Error(
        "Set BLUESKY_APP_PASSWORD (an app password from bsky.app → Settings → App Passwords)",
      );
    }

    const res = await fetch(`${this.pds}/xrpc/com.atproto.server.createSession`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier: BLUESKY_HANDLE, password }),
    });
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`createSession failed: ${res.status} ${body}`);
    }
    const session = await res.json();
    this.accessJwt = session.accessJwt;
    if (session.did !== DID) {
      throw new Error(`Session DID ${session.did} does not match expected ${DID}`);
    }
  }

  async putRecord(collection, rkey, record) {
    if (this.dryRun) return { dryRun: true };
    const res = await fetch(`${this.pds}/xrpc/com.atproto.repo.putRecord`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.accessJwt}`,
      },
      body: JSON.stringify({ repo: DID, collection, rkey, record }),
    });
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`putRecord ${collection}/${rkey} failed: ${res.status} ${body}`);
    }
    return res.json();
  }

  async deleteRecord(collection, rkey) {
    if (this.dryRun) return { dryRun: true };
    const res = await fetch(`${this.pds}/xrpc/com.atproto.repo.deleteRecord`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.accessJwt}`,
      },
      body: JSON.stringify({ repo: DID, collection, rkey }),
    });
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`deleteRecord ${collection}/${rkey} failed: ${res.status} ${body}`);
    }
    return res.json();
  }

  // --- Frontmatter parsing (lightweight, matching the repo's existing style) ---

  parsePost(filePath) {
    const raw = fs.readFileSync(filePath, "utf-8");
    if (!raw.startsWith("---")) return null;

    const end = raw.indexOf("\n---", 3);
    if (end === -1) return null;

    const frontmatter = raw.slice(3, end);
    const body = raw.slice(end + 4);

    const scalar = (key) => {
      const m = frontmatter.match(new RegExp(`^${key}:\\s*(.+)$`, "m"));
      if (!m) return null;
      return m[1].trim().replace(/^["'](.*)["']$/, "$1");
    };

    if (scalar("published") === "false") return null;

    const title = scalar("title");
    const date = scalar("date");
    if (!title || !date) return null;

    // tags: either a block of "  - value" lines or an inline "[a, b]" array.
    const tags = [];
    const tagsBlock = frontmatter.match(/^tags:\s*\n((?:\s*-\s*.+\n?)+)/m);
    if (tagsBlock) {
      for (const line of tagsBlock[1].split("\n")) {
        const t = line.match(/^\s*-\s*(.+?)\s*$/);
        if (t) tags.push(t[1].replace(/^["'](.*)["']$/, "$1"));
      }
    } else {
      const inline = scalar("tags");
      if (inline && inline.startsWith("[")) {
        for (const part of inline.replace(/^\[|\]$/g, "").split(",")) {
          const t = part.trim().replace(/^["'](.*)["']$/, "$1");
          if (t) tags.push(t);
        }
      }
    }

    return {
      layout: scalar("layout"),
      title,
      date,
      updated: scalar("updated"),
      description: scalar("description"),
      tags,
      body,
    };
  }

  // content/_posts/2025-12-23-techno-tuesday.md → /2025/12/23/techno-tuesday
  // No trailing slash: the site's permalink (/:year/:month/:day/:title) and
  // thus page.url have none, so this must match for the <link> tag to render.
  filenameToUrl(filename) {
    const m = filename.match(/^(\d{4})-(\d{2})-(\d{2})-(.+)\.md$/);
    if (!m) return null;
    const [, year, month, day, slug] = m;
    if (Number(month) > 12 || Number(day) > 31) return null;
    return `/${year}/${month}/${day}/${slug}`;
  }

  toIsoDate(dateStr) {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return null;
    return d.toISOString();
  }

  // Best-effort Markdown → plaintext for the textContent field.
  stripMarkdown(md) {
    return md
      .replace(/```[\s\S]*?```/g, " ") // fenced code
      .replace(/!\[[^\]]*\]\([^)]*\)/g, " ") // images
      .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // links → text
      .replace(/^[#>\s]*#+\s*/gm, "") // headings
      .replace(/^\s*[-*+]\s+/gm, "") // list markers
      .replace(/[*_`~]/g, "") // emphasis/code marks
      .replace(/<[^>]+>/g, " ") // inline html
      .replace(/\s+/g, " ")
      .trim();
  }

  loadData() {
    if (!fs.existsSync(DATA_FILE)) {
      return { publication: {}, documents: {} };
    }
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
  }

  saveData(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2) + "\n");
  }

  // --- Records ---

  async upsertPublication(data) {
    const record = {
      $type: PUBLICATION_COLLECTION,
      url: SITE_URL,
      name: SITE_NAME,
      description: SITE_DESCRIPTION,
      basicTheme: PUBLICATION_THEME,
      preferences: { showInDiscover: true },
    };

    await this.putRecord(PUBLICATION_COLLECTION, PUBLICATION_RKEY, record);

    if (!this.dryRun) {
      data.publication = { uri: PUBLICATION_URI, url: SITE_URL, name: SITE_NAME };
      fs.writeFileSync(WELL_KNOWN_FILE, PUBLICATION_URI + "\n");
    }
    return PUBLICATION_URI;
  }

  async upsertDocuments(data, publicationUri) {
    const files = fs
      .readdirSync(POSTS_DIR)
      .filter((f) => f.endsWith(".md"))
      .sort();

    let created = 0;
    let updated = 0;
    let skippedOld = 0;

    // Every published, well-formed post that currently exists. Used below to
    // prune records whose post was deleted, unpublished, or renamed. Built
    // independently of the --since cutoff so old-but-live posts are never pruned.
    const liveUrls = new Set();
    const liveRkeys = new Set();

    for (const file of files) {
      const url = this.filenameToUrl(file);
      if (!url) continue;

      const post = this.parsePost(path.join(POSTS_DIR, file));
      if (!post) continue;

      // Long-form layouts only; everything else is left out (and pruned if it
      // somehow already has a record).
      if (!DOCUMENT_LAYOUTS.includes(post.layout)) continue;

      const publishedAt = this.toIsoDate(post.date);
      if (!publishedAt) continue;

      liveUrls.add(url);

      // Deterministic TID record key (required by the lexicon), stable per post.
      const rkey = tidFor(publishedAt, url);
      const uri = `at://${DID}/${DOCUMENT_COLLECTION}/${rkey}`;
      liveRkeys.add(rkey);

      // Skip anything older than the cutoff so we only publish new posts.
      if (this.since && new Date(publishedAt) < this.since) {
        skippedOld++;
        continue;
      }

      const record = {
        $type: DOCUMENT_COLLECTION,
        site: publicationUri,
        title: post.title,
        path: url,
        publishedAt,
      };
      if (post.description) record.description = post.description;
      if (post.tags.length) record.tags = post.tags;
      const text = this.stripMarkdown(post.body);
      if (text) record.textContent = text;
      // An author-declared `updated:` date is part of the content and is hashed.
      const declaredUpdate = post.updated ? this.toIsoDate(post.updated) : null;
      if (declaredUpdate) record.updatedAt = declaredUpdate;

      // Hash the content-bearing record (before any auto updatedAt stamp) so an
      // edit changes the hash but a stamp-only field never causes spurious churn.
      const hash = crypto.createHash("sha256").update(JSON.stringify(record)).digest("hex");
      const existing = data.documents[url];
      // Republish when content changed OR the stored record key isn't this TID
      // (e.g. migrating off an earlier, non-TID key scheme).
      const contentChanged = !existing || existing.hash !== hash;
      const keyChanged = existing && existing.uri !== uri;
      if (!contentChanged && !keyChanged) continue;

      // A changed post with no explicit `updated:` gets stamped with edit time
      // (but a key-only migration leaves the content, and updatedAt, untouched).
      if (existing && contentChanged && !declaredUpdate) {
        record.updatedAt = new Date().toISOString();
      }

      // Write the new record; the old key (if any) is swept by the end-of-run
      // prune, which lists the PDS directly.
      await this.putRecord(DOCUMENT_COLLECTION, rkey, record);

      if (!this.dryRun) data.documents[url] = { uri, hash };
      if (existing) updated++;
      else created++;

      this.log(`  ${this.dryRun ? "would publish" : "published"}: ${url}`);
    }

    const removed = await this.pruneDocuments(data, liveUrls, liveRkeys);

    return { created, updated, skippedOld, removed };
  }

  // Delete document records that belong to THIS publication but no longer match a
  // live post: deleted/unpublished/renamed posts and leftovers from older key
  // schemes. On a real run this sweeps the PDS directly (so orphans are caught
  // even when _data/standard.json is stale, and the pre-TID keys get cleaned up);
  // on a dry run it can only report from the data file. Records pointing at other
  // publications are never touched.
  async pruneDocuments(data, liveUrls, liveRkeys) {
    let removed = 0;

    if (this.dryRun) {
      for (const url of Object.keys(data.documents)) {
        if (liveUrls.has(url)) continue;
        removed++;
        this.log(`  would remove: ${url}`);
      }
      return removed;
    }

    let cursor;
    do {
      const params = new URLSearchParams({
        repo: DID,
        collection: DOCUMENT_COLLECTION,
        limit: "100",
      });
      if (cursor) params.set("cursor", cursor);
      const res = await fetch(`${this.pds}/xrpc/com.atproto.repo.listRecords?${params}`);
      if (!res.ok) throw new Error(`listRecords failed: ${res.status} ${await res.text()}`);
      const page = await res.json();

      for (const rec of page.records || []) {
        if (rec.value?.site !== PUBLICATION_URI) continue; // another publication
        const rkey = rec.uri.split("/").pop();
        if (liveRkeys.has(rkey)) continue; // still live
        await this.deleteRecord(DOCUMENT_COLLECTION, rkey);
        removed++;
        this.log(`  removed: ${rkey}`);
      }
      cursor = page.records && page.records.length ? page.cursor : null;
    } while (cursor);

    // Drop any data-file entries whose record we just pruned.
    for (const url of Object.keys(data.documents)) {
      if (!liveUrls.has(url)) delete data.documents[url];
    }
    return removed;
  }

  // Delete every record this site has published: all tracked documents plus the
  // publication record. The full reverse of a normal run.
  async unpublishAll(data) {
    let removed = 0;
    for (const url of Object.keys(data.documents)) {
      const rkey = data.documents[url].uri.split("/").pop();
      await this.deleteRecord(DOCUMENT_COLLECTION, rkey);
      if (!this.dryRun) delete data.documents[url];
      removed++;
      this.log(`  ${this.dryRun ? "would delete" : "deleted"}: ${url}`);
    }
    await this.deleteRecord(PUBLICATION_COLLECTION, PUBLICATION_RKEY);
    this.log(`  ${this.dryRun ? "would delete" : "deleted"}: publication`);
    return removed;
  }

  run = async () => {
    loadEnv();
    this.parseArgs();

    try {
      const data = this.loadData();

      if (this.dryRun) {
        this.log("Dry run — building records (nothing will be written)");
      } else {
        this.log("Resolving PDS…");
        await this.resolvePds();
        this.log("Authenticating…");
        await this.createSession();
      }

      if (this.unpublish) {
        this.log(this.dryRun ? "Would unpublish all records:" : "Unpublishing all records…");
        const removed = await this.unpublishAll(data);
        if (!this.dryRun) this.saveData(data);
        const verb = this.dryRun ? "[dry run] would delete" : "Deleted";
        this.log(`${verb} ${removed} document(s) + the publication`);
        return;
      }

      if (!this.dryRun) this.log("Upserting publication record…");
      const publicationUri = await this.upsertPublication(data);

      const { created, updated, skippedOld, removed } = await this.upsertDocuments(
        data,
        publicationUri,
      );

      if (!this.dryRun) this.saveData(data);

      const prefix = this.dryRun ? "[dry run] would publish" : "Published";
      const sinceNote = this.since
        ? `, ${skippedOld} skipped before ${this.since.toISOString().slice(0, 10)}`
        : "";
      const removedNote = removed
        ? `, ${removed} ${this.dryRun ? "to remove" : "removed"}`
        : "";
      this.log(`${prefix} ${created} new, ${updated} updated${removedNote}${sinceNote}`);
    } catch (error) {
      this.log(`Standard.site error: ${error.message}`);
      process.exitCode = 1;
    }
  };
}

// Run directly: `node _scripts/standard.js`
if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  new Standard().run();
}
