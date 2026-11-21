#!/usr/bin/env node

// Takes the site out from behind Cloudflare's proxy and puts it back.
//
//   node _scripts/proxy.js            show which records are proxied
//   node _scripts/proxy.js off        switch to DNS only
//   node _scripts/proxy.js on         proxy again what `off` switched
//   node _scripts/proxy.js on --dry-run
//
// Spanish ISPs drop traffic to shared Cloudflare addresses during football
// matches, which takes the site down for anyone in Spain. With the proxy off
// the records point straight at the servers, which are not blocked.
//
// `off` only switches a name when every origin behind it presents a valid
// certificate for it: Cloudflare hides a bad one, a browser going direct does not.
// Each record it switches is marked in its Cloudflare comment, so `on` restores
// exactly those and leaves alone the records that were never proxied.

import tls from "node:tls";
import { pathToFileURL } from "node:url";

const ZONE = "javier.computer";
const API = "https://api.cloudflare.com/client/v4";
const MARK = "computer:proxy-off";
const PROXIABLE = ["A", "AAAA", "CNAME"];

const marked = (record) => (record.comment || "").includes(MARK);
const mark = (comment) => [comment, MARK].filter(Boolean).join(" ");
const unmark = (comment) => (comment || "").replace(MARK, "").trim();

const inZone = (name) => name === ZONE || name.endsWith(`.${ZONE}`);

// Where a name really leads: the addresses in its records, following CNAMEs
// through the zone. Asking DNS instead would answer with Cloudflare's edge for
// a target that is still proxied, and the edge always has a good certificate.
// Null when the chain cannot be followed.
function origins(name, records, seen = new Set()) {
  if (seen.has(name)) return null;
  seen.add(name);

  const own = records.filter((record) => record.name === name);
  if (!own.length) return inZone(name) ? null : [name];

  const hosts = [];
  for (const record of own) {
    const found =
      record.type === "CNAME"
        ? origins(record.content.toLowerCase(), records, seen)
        : [record.content];

    if (!found) return null;
    hosts.push(...found);
  }

  return hosts;
}

// Null when `name` gets a certificate a browser would accept from `host`,
// otherwise the reason it would not.
export function certificateProblem(host, name) {
  return new Promise((resolve) => {
    const socket = tls.connect(
      { host, port: 443, servername: name, timeout: 8000 },
      () => {
        socket.end();
        resolve(null);
      },
    );

    socket.on("timeout", () => socket.destroy(new Error("timed out")));
    socket.on("error", (error) => resolve(describe(error)));
  });
}

const describe = (error) => {
  if (error.code === "ERR_TLS_CERT_ALTNAME_INVALID")
    return "the certificate does not cover this name";
  if (error.code === "CERT_HAS_EXPIRED") return "the certificate has expired";
  if (error.code === "ECONNREFUSED") return "nothing answers on port 443";
  return error.message;
};

export class CloudflareProxy {
  constructor({
    token = process.env.CF_API_TOKEN || process.env.CLOUDFLARE_API_TOKEN,
    check = certificateProblem,
    dryRun = false,
    log = (line) => process.stdout.write(`${line}\n`),
  } = {}) {
    this.token = token;
    this.check = check;
    this.dryRun = dryRun;
    this.log = log;
  }

  async request(path, options = {}) {
    if (!this.token) {
      throw new Error(
        "Set CF_API_TOKEN (a Cloudflare API token with Zone → DNS → Edit and " +
          `Zone → Zone → Read on ${ZONE})`,
      );
    }

    const response = await fetch(`${API}${path}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json",
      },
    });
    const body = await response.json();

    if (!body.success) {
      const reasons = (body.errors || []).map((error) => error.message);
      throw new Error(
        `Cloudflare: ${reasons.join(", ") || `HTTP ${response.status}`}`,
      );
    }

    return body;
  }

  async records() {
    const zones = await this.request(`/zones?name=${ZONE}`);
    if (!zones.result.length) {
      throw new Error(`The token cannot see the ${ZONE} zone.`);
    }

    this.zone = zones.result[0].id;

    const records = [];
    for (let page = 1, pages = 1; page <= pages; page++) {
      const body = await this.request(
        `/zones/${this.zone}/dns_records?per_page=100&page=${page}`,
      );
      records.push(...body.result);
      pages = body.result_info.total_pages;
    }

    return records
      .filter((record) => PROXIABLE.includes(record.type))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  async update(record, changes) {
    if (this.dryRun) return;

    await this.request(`/zones/${this.zone}/dns_records/${record.id}`, {
      method: "PATCH",
      body: JSON.stringify(changes),
    });
  }

  async status() {
    const records = await this.records();
    const shown = records.filter((record) => record.proxied || marked(record));

    for (const record of shown) {
      this.log(`${record.proxied ? "proxied " : "DNS only"}  ${record.name}`);
    }

    if (!shown.length) this.log("Nothing here is proxied.");
  }

  // Why `name` cannot go direct, or null when every origin behind it is ready.
  async problem(name, records) {
    const hosts = origins(name, records);
    if (!hosts) return "cannot tell where its CNAME leads";

    const problems = await Promise.all(
      hosts.map((host) => this.check(host, name)),
    );
    const bad = problems.findIndex(Boolean);

    if (bad === -1) return null;
    return hosts.length > 1
      ? `${problems[bad]} at ${hosts[bad]}`
      : problems[bad];
  }

  // Decided a name at a time, not a record at a time: Cloudflare keeps proxying
  // every address of a name for as long as one of its records is proxied.
  async off() {
    const records = await this.records();
    const proxied = records.filter((record) => record.proxied);
    const names = [...new Set(proxied.map((record) => record.name))];
    const problems = await Promise.all(
      names.map((name) => this.problem(name, records)),
    );

    let switched = 0;

    for (const [i, name] of names.entries()) {
      if (problems[i]) {
        this.log(`skipped   ${name} — ${problems[i]}`);
        continue;
      }

      for (const record of proxied.filter((record) => record.name === name)) {
        await this.update(record, {
          proxied: false,
          comment: mark(record.comment),
        });
        switched++;
      }

      this.log(`DNS only  ${name}`);
    }

    this.summary(switched, "switched to DNS only");
  }

  async on() {
    const records = (await this.records()).filter(
      (record) => !record.proxied && marked(record),
    );

    for (const record of records) {
      await this.update(record, {
        proxied: true,
        comment: unmark(record.comment),
      });
      this.log(`proxied   ${record.name}`);
    }

    this.summary(records.length, "back behind Cloudflare");
  }

  summary(count, what) {
    const records = count === 1 ? "1 record" : `${count} records`;
    const note = this.dryRun
      ? " (dry run, nothing changed)"
      : count
        ? " — visitors follow within five minutes"
        : "";

    this.log(`\n${records} ${what}${note}`);
  }
}

async function main() {
  const args = process.argv.slice(2);
  const mode = args.find((arg) => !arg.startsWith("--")) || "status";
  const proxy = new CloudflareProxy({ dryRun: args.includes("--dry-run") });

  if (!["status", "on", "off"].includes(mode)) {
    throw new Error("usage: proxy.js [on|off] [--dry-run]");
  }

  await proxy[mode]();
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  });
}
