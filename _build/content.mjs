import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";

export function frontMatter(source, parse = parseYaml) {
  const match = source.match(
    /^---[ \t]*\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/,
  );
  return {
    data: match ? parse(match[1]) : {},
    content: match ? source.slice(match[0].length) : source,
  };
}

export function parseYaml(source) {
  const data =
    yaml.load(source, { json: true, schema: yaml.JSON_SCHEMA }) || {};
  if (data.layout === "none") data.layout = false;
  const tags = [data.tags || [], data.tag || []]
    .flat()
    .flatMap((value) =>
      typeof value === "string" ? value.split(/\s+/) : [value],
    );
  if (data.tag && tags.length) data.tags = [...new Set(tags)];
  if (data.date) {
    const date = new Date(
      /^\d{4}-\d{2}-\d{2}$/.test(String(data.date))
        ? `${data.date}T00:00:00`
        : data.date,
    );
    if (!Number.isNaN(+date)) data.date = date;
  }
  return data;
}

export function filesIn(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs
    .readdirSync(directory, { withFileTypes: true })
    .flatMap((entry) => {
      const file = path.join(directory, entry.name);
      return entry.isDirectory() ? filesIn(file) : [file];
    })
    .sort();
}

export function loadData(directory) {
  const result = {};
  for (const file of filesIn(directory)) {
    if (!/\.(json|ya?ml)$/.test(file)) continue;
    const keys = path
      .relative(directory, file)
      .replace(/\.(json|ya?ml)$/, "")
      .split(path.sep);
    let target = result;
    for (const key of keys.slice(0, -1)) target = target[key] ||= {};
    const text = fs.readFileSync(file, "utf8");
    target[keys.at(-1)] = file.endsWith(".json")
      ? JSON.parse(text)
      : yaml.load(text);
  }
  return result;
}

export function routeFor(inputPath, data) {
  const file = inputPath.replace(/^\.\//, "");
  let url = data.permalink;
  if (!url) {
    const post = file.match(
      /^(?:content\/_posts|_drafts)\/(?:.*\/)?(?:(\d{4})-(\d{2})-(\d{2})-)?(.+)\.[^.]+$/,
    );
    const collection = file.match(/^content\/_([^/]+)\/(.+)\.[^.]+$/);
    if (post) {
      const date =
        data.date ||
        (post[1]
          ? new Date(`${post[1]}-${post[2]}-${post[3]}T00:00:00`)
          : new Date());
      const parts = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Europe/Madrid",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).formatToParts(date);
      const part = (type) => parts.find((p) => p.type === type).value;
      url = `/${part("year")}/${part("month")}/${part("day")}/${data.slug || post[4].replace(/[^\p{L}\p{N}_.-]+/gu, "-")}`;
    } else if (collection) {
      url = `/${collection[1] === "maps" ? "map" : collection[1]}/${collection[2]}/`;
    } else if (file.endsWith(".md")) {
      url = "/" + file.slice(0, -3);
    } else {
      url =
        "/" +
        (file.endsWith(".html") && data.layout ? file.slice(0, -5) : file);
    }
  }
  url = "/" + String(url).replace(/^\/+/, "");
  const output = url.endsWith("/")
    ? `${url}index.html`
    : path.posix.extname(url)
      ? url
      : `${url}.html`;
  return { url: url.replace(/\/index\.html$/, "/"), output };
}

export function readDocuments({ drafts = false, now = new Date() } = {}) {
  return [...filesIn("content"), ...(drafts ? filesIn("_drafts") : [])]
    .filter((file) => /\.(md|html)$/.test(file))
    .map((file) => {
      const raw = fs.readFileSync(file, "utf8");
      const { data, content } = frontMatter(raw);
      if (
        /^(content\/_posts|_drafts)\//.test(file) &&
        typeof data.tags === "string"
      )
        data.tags = data.tags.split(/\s+/);
      const match = path.basename(file).match(/^(\d{4}-\d{2}-\d{2})-/);
      const date =
        data.date ||
        (match ? new Date(`${match[1]}T00:00:00`) : fs.statSync(file).mtime);
      return {
        ...data,
        date,
        file,
        content,
        raw,
        ...routeFor(file, { ...data, date }),
      };
    })
    .filter(
      (doc) =>
        doc.published !== false &&
        (!/(?:content\/_posts|_drafts)\//.test(doc.file) || doc.date <= now),
    );
}

// Keep the front-matter access used throughout the existing Liquid templates.
// Items remain Eleventy collection entries, including their lazy `content` getter.
export function exposeFrontMatter(item) {
  item.date = item.data.page.date;
  for (const [key, value] of Object.entries(item.data.page)) {
    if (!(key in item)) item[key] = value;
  }
  return item;
}

export function byNewest(a, b) {
  return (
    b.date - a.date ||
    (a.inputPath < b.inputPath ? 1 : a.inputPath > b.inputPath ? -1 : 0)
  );
}
