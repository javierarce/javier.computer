import fs from "fs";
import path from "path";

const SITE_URL = "javier.computer";
const CONTENT_DIR = "content";

const MASTODON_INSTANCE = "mastodon.social";
const MASTODON_USERNAME = "javierarce";

const BLUESKY_HANDLE = "javier.bsky.social";

export class Syndication {
  constructor() {}

  async loadSpinner() {
    const ora = (await import("ora")).default;
    this.spinner = ora({ text: "Loading…", spinner: "dots" });
  }

  // --- Mastodon ---

  async fetchMastodonLinks() {
    const apiBase = `https://${MASTODON_INSTANCE}/api/v1`;
    const response = await fetch(
      `${apiBase}/accounts/lookup?acct=${MASTODON_USERNAME}`,
    );
    if (!response.ok) throw new Error(`Mastodon account lookup failed: ${response.status}`);
    const account = await response.json();

    const statuses = [];
    let maxId = null;

    while (true) {
      const params = new URLSearchParams({ limit: "40", exclude_reblogs: "true" });
      if (maxId) params.set("max_id", maxId);

      const res = await fetch(`${apiBase}/accounts/${account.id}/statuses?${params}`);
      if (!res.ok) throw new Error(`Mastodon statuses fetch failed: ${res.status}`);

      const batch = await res.json();
      if (batch.length === 0) break;

      statuses.push(...batch);
      maxId = batch[batch.length - 1].id;
      if (statuses.length >= 400) break;
    }

    return statuses.map((s) => ({
      syndicationUrl: s.url,
      content: s.content,
    }));
  }

  // --- Bluesky ---

  async fetchBlueskyLinks() {
    const apiBase = "https://public.api.bsky.app/xrpc";
    const entries = [];
    let cursor = null;

    while (true) {
      const params = new URLSearchParams({ actor: BLUESKY_HANDLE, limit: "100" });
      if (cursor) params.set("cursor", cursor);

      const res = await fetch(`${apiBase}/app.bsky.feed.getAuthorFeed?${params}`);
      if (!res.ok) throw new Error(`Bluesky feed fetch failed: ${res.status}`);

      const data = await res.json();
      if (!data.feed || data.feed.length === 0) break;

      for (const item of data.feed) {
        const post = item.post;
        // Build the bsky.app URL from the AT URI
        const rkey = post.uri.split("/").pop();
        const syndicationUrl = `https://bsky.app/profile/${post.author.handle}/post/${rkey}`;

        // Collect text and any link facets
        let content = post.record?.text || "";
        const facets = post.record?.facets || [];
        for (const facet of facets) {
          for (const feature of facet.features || []) {
            if (feature.uri) content += ` ${feature.uri}`;
          }
        }

        entries.push({ syndicationUrl, content });
      }

      cursor = data.cursor;
      if (!cursor || entries.length >= 400) break;
    }

    return entries;
  }

  // --- Shared ---

  extractSiteUrls(content) {
    const urls = [];
    const linkRegex = new RegExp(
      `https?://${SITE_URL.replace(".", "\\.")}(/[^"<\\s]*)`,
      "g",
    );

    let match;
    while ((match = linkRegex.exec(content)) !== null) {
      urls.push(match[1]);
    }

    return urls;
  }

  urlPathToFilePath(urlPath) {
    const clean = urlPath.replace(/\/$/, "");
    const parts = clean.split("/").filter(Boolean);

    // Post URL: /2026/03/24/slug → content/_posts/2026-03-24-slug.md
    if (parts.length === 4 && /^\d{4}$/.test(parts[0]) && /^\d{2}$/.test(parts[1]) && /^\d{2}$/.test(parts[2])) {
      const filename = `${parts[0]}-${parts[1]}-${parts[2]}-${parts[3]}.md`;
      return path.join(CONTENT_DIR, "_posts", filename);
    }

    // Collection URL: /photos/slug → content/_photos/slug.md
    if (parts.length >= 2) {
      const collectionMap = {
        photos: "_photos",
        drawings: "_drawings",
        movies: "_movies",
        books: "_books",
        places: "_places",
        projects: "_projects",
        map: "_maps",
        binoculars: "_binoculars",
        locations: "_locations",
      };

      const dir = collectionMap[parts[0]];
      if (dir) {
        const slug = parts.slice(1).join("/");
        return path.join(CONTENT_DIR, dir, `${slug}.md`);
      }
    }

    return null;
  }

  addSyndication(filePath, syndicationUrl) {
    if (!fs.existsSync(filePath)) return false;

    const content = fs.readFileSync(filePath, "utf-8");

    if (!content.startsWith("---")) return false;
    const endIndex = content.indexOf("---", 3);
    if (endIndex === -1) return false;

    const frontmatter = content.slice(0, endIndex);
    const rest = content.slice(endIndex);

    if (frontmatter.includes(syndicationUrl)) return false;

    let newFrontmatter;
    if (frontmatter.includes("syndication:")) {
      newFrontmatter = frontmatter.replace(
        /syndication:\n/,
        `syndication:\n  - ${syndicationUrl}\n`,
      );
    } else {
      newFrontmatter = frontmatter + `syndication:\n  - ${syndicationUrl}\n`;
    }

    fs.writeFileSync(filePath, newFrontmatter + rest);
    return true;
  }

  processEntries(entries) {
    let updated = 0;

    for (const { syndicationUrl, content } of entries) {
      const paths = this.extractSiteUrls(content);

      for (const urlPath of paths) {
        const filePath = this.urlPathToFilePath(urlPath);
        if (filePath && this.addSyndication(filePath, syndicationUrl)) {
          updated++;
          this.spinner.text = `Updated: ${filePath}`;
        }
      }
    }

    return updated;
  }

  run = async () => {
    await this.loadSpinner();
    let totalUpdated = 0;

    try {
      this.spinner.start("Fetching Mastodon syndication links");
      const mastodonEntries = await this.fetchMastodonLinks();
      this.spinner.text = `Processing ${mastodonEntries.length} Mastodon statuses`;
      totalUpdated += this.processEntries(mastodonEntries);

      this.spinner.text = "Fetching Bluesky syndication links";
      const blueskyEntries = await this.fetchBlueskyLinks();
      this.spinner.text = `Processing ${blueskyEntries.length} Bluesky posts`;
      totalUpdated += this.processEntries(blueskyEntries);

      this.spinner.succeed(
        totalUpdated > 0
          ? `Added syndication links to ${totalUpdated} post${totalUpdated === 1 ? "" : "s"}`
          : "Syndication links are up to date",
      );
    } catch (error) {
      this.spinner.fail(`Syndication error: ${error.message}`);
    }
  };
}
