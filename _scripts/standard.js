import fs from "fs";
import path from "path";
import crypto from "crypto";
import { pathToFileURL } from "url";
import "dotenv/config";

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

    let sinceStr = PUBLISH_SINCE;
    const sinceArg = args.find((a) => a.startsWith("--since="));
    if (sinceArg) sinceStr = sinceArg.split("=")[1];
    if (args.includes("--all")) sinceStr = null;

    this.since = sinceStr ? new Date(sinceStr) : null;
    if (this.since && isNaN(this.since.getTime())) {
      throw new Error(`Invalid --since date: ${sinceStr}`);
    }
  }

  async loadSpinner() {
    const ora = (await import("ora")).default;
    this.spinner = ora({ text: "Loading…", spinner: "dots" });
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

  // content/_posts/2025-12-23-techno-tuesday.md → /2025/12/23/techno-tuesday/
  filenameToUrl(filename) {
    const m = filename.match(/^(\d{4})-(\d{2})-(\d{2})-(.+)\.md$/);
    if (!m) return null;
    const [, year, month, day, slug] = m;
    if (Number(month) > 12 || Number(day) > 31) return null;
    return `/${year}/${month}/${day}/${slug}/`;
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
      if (existing && existing.hash === hash) continue;

      // A changed post with no explicit `updated:` gets stamped with edit time.
      if (existing && !declaredUpdate) record.updatedAt = new Date().toISOString();

      const rkey = file.replace(/\.md$/, "");
      await this.putRecord(DOCUMENT_COLLECTION, rkey, record);

      if (!this.dryRun) {
        const uri = `at://${DID}/${DOCUMENT_COLLECTION}/${rkey}`;
        data.documents[url] = { uri, hash };
      }
      if (existing) updated++;
      else created++;

      this.spinner.text = `${this.dryRun ? "Would publish" : "Published"}: ${url}`;
    }

    const removed = await this.pruneDocuments(data, liveUrls);

    return { created, updated, skippedOld, removed };
  }

  // Delete document records whose post no longer exists as a published page.
  async pruneDocuments(data, liveUrls) {
    let removed = 0;

    for (const url of Object.keys(data.documents)) {
      if (liveUrls.has(url)) continue;

      const rkey = data.documents[url].uri.split("/").pop();
      await this.deleteRecord(DOCUMENT_COLLECTION, rkey);

      if (!this.dryRun) delete data.documents[url];
      removed++;

      this.spinner.text = `${this.dryRun ? "Would remove" : "Removed"}: ${url}`;
    }

    return removed;
  }

  run = async () => {
    await this.loadSpinner();
    this.parseArgs();

    try {
      const data = this.loadData();

      if (this.dryRun) {
        this.spinner.start("Dry run — building records (nothing will be written)");
      } else {
        this.spinner.start("Resolving PDS");
        await this.resolvePds();
        this.spinner.text = "Authenticating";
        await this.createSession();
        this.spinner.text = "Upserting publication record";
      }

      const publicationUri = await this.upsertPublication(data);

      if (!this.dryRun) this.spinner.text = "Publishing document records";
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
      this.spinner.succeed(`${prefix} ${created} new, ${updated} updated${removedNote}${sinceNote}`);
    } catch (error) {
      this.spinner.fail(`Standard.site error: ${error.message}`);
      process.exitCode = 1;
    }
  };
}

// Run directly: `node _scripts/standard.js`
if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  new Standard().run();
}
