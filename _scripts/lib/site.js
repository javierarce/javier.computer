// Repo-aware helpers for the site CLI: slugs, dates, front matter and the
// existing vocabulary of the site (locations, cameras, ratios).

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = path.resolve(
  fileURLToPath(new URL("../..", import.meta.url)),
);

export const POSTS_DIR = path.join(ROOT, "content", "_posts");
export const DRAFTS_DIR = path.join(ROOT, "_drafts");
export const MAPS_DIR = path.join(ROOT, "content", "_maps");
export const LOCATIONS_DIR = path.join(ROOT, "content", "_locations");
export const PLACES_DIR = path.join(ROOT, "content", "_places");

export const DEFAULT_RATIO = "3/2";

// Filename patterns that identify the camera a photo came from.
const CAMERAS = [
  { pattern: /DSCF/i, name: "Fuji X-T5" },
  { pattern: /R00/i, name: "Ricoh GR IIIx" },
];

/* ============================================
   Strings
============================================ */

export function slugify(string) {
  const slug = String(string)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip the accents NFD just split off
    .replace(/ß/g, "ss")
    .replace(/ø|Ø/g, "o")
    .replace(/đ|ð/g, "d")
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

  return slug || "untitled";
}

const EMOJIS =
  "✅ 🥸 🥲 🥰 😌 🙄 🥺 🤭 👽 🤠 💋 💅 🐶 🌈 ✨ 🌱 🔥 🍞 💫 🎈 💥".split(" ");

export const randomEmoji = () =>
  EMOJIS[Math.floor(Math.random() * EMOJIS.length)];

/* ============================================
   Dates
============================================ */

const WEEKDAYS = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

const UNITS = {
  minute: 60 * 1000,
  hour: 60 * 60 * 1000,
  day: 24 * 60 * 60 * 1000,
  week: 7 * 24 * 60 * 60 * 1000,
};

// Understands the handful of expressions that are actually useful when
// backdating a post. Returns null when the input can't be read, so the form
// can complain instead of silently falling back to "now" (which is what the
// old Chronic-based scripts did).
export function parseDate(input, now = new Date()) {
  const text = String(input || "")
    .trim()
    .toLowerCase();

  if (!text || text === "now" || text === "today" || text === "hoy") return now;
  if (text === "yesterday" || text === "ayer") return shift(now, -UNITS.day);
  if (text === "tomorrow" || text === "mañana") return shift(now, UNITS.day);

  const iso = text.match(
    /^(\d{4})-(\d{2})-(\d{2})(?:[t ](\d{1,2}):(\d{2})(?::(\d{2}))?)?$/,
  );
  // A bare day means midnight, the way the dated photo essays on this site
  // are written; add a time when you want one.
  if (iso) {
    const [, y, m, d, hh, mm, ss] = iso;
    const date = new Date(
      Number(y),
      Number(m) - 1,
      Number(d),
      Number(hh || 0),
      Number(mm || 0),
      Number(ss || 0),
    );
    return Number.isNaN(date.getTime()) ? null : date;
  }

  const slashed = text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (slashed) {
    const [, d, m, y] = slashed;
    return new Date(Number(y), Number(m) - 1, Number(d));
  }

  const ago = text.match(/^(\d+)\s*(minute|hour|day|week)s?\s+ago$/);
  if (ago) return shift(now, -Number(ago[1]) * UNITS[ago[2]]);

  const ahead = text.match(/^in\s+(\d+)\s*(minute|hour|day|week)s?$/);
  if (ahead) return shift(now, Number(ahead[1]) * UNITS[ahead[2]]);

  const weekday = text.match(/^(last|next|this)\s+(\w+)$/);
  if (weekday) {
    const target = WEEKDAYS.indexOf(weekday[2]);
    if (target === -1) return null;

    const delta = target - now.getDay();
    if (weekday[1] === "last")
      return shift(now, (delta > 0 ? delta - 7 : delta || -7) * UNITS.day);
    if (weekday[1] === "next")
      return shift(now, (delta < 0 ? delta + 7 : delta || 7) * UNITS.day);
    return shift(now, delta * UNITS.day);
  }

  const at = text.match(/^(\d{1,2}):(\d{2})$/);
  if (at) {
    const date = new Date(now);
    date.setHours(Number(at[1]), Number(at[2]), 0, 0);
    return date;
  }

  return null;
}

const shift = (date, ms) => new Date(date.getTime() + ms);

const pad = (n) => String(n).padStart(2, "0");

// "2026-08-09 21:14:03 +0200" — the format every layout in this site expects.
export function formatDate(date) {
  const offset = -date.getTimezoneOffset();
  const sign = offset >= 0 ? "+" : "-";
  const absolute = Math.abs(offset);

  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
    `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())} ` +
    `${sign}${pad(Math.floor(absolute / 60))}${pad(absolute % 60)}`
  );
}

export const formatDay = (date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

/* ============================================
   Front matter
============================================ */

// Renders an ordered list of [key, value] pairs. Values are emitted as-is
// unless they are arrays (block sequences) or flagged for quoting.
export function frontMatter(pairs) {
  const lines = ["---"];

  for (const [key, value] of pairs) {
    if (value === undefined || value === null || value === "") continue;

    if (Array.isArray(value)) {
      if (!value.length) continue;
      lines.push(`${key}:`);
      for (const entry of value) {
        // Numbers are written as numbers: a coordinate is the one sequence
        // here that must not come out quoted, and scalar() would quote every
        // negative one on account of the leading dash.
        if (typeof entry === "number") {
          lines.push(`  - ${entry}`);
          continue;
        }
        if (typeof entry === "string") {
          lines.push(`  - ${scalar(entry)}`);
          continue;
        }
        const [first, ...rest] = Object.entries(entry);
        lines.push(`  - ${first[0]}: ${scalar(first[1])}`);
        for (const [k, v] of rest) lines.push(`    ${k}: ${scalar(v)}`);
      }
      continue;
    }

    lines.push(`${key}: ${value}`);
  }

  lines.push("---");
  return lines.join("\n") + "\n";
}

// Always-quoted, for keys the site writes quoted by convention (title, date).
// Backslashes matter too: inside a double-quoted YAML scalar they escape.
export const quoted = (value) =>
  `"${String(value)
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\s*\n\s*/g, " ")}"`;

// Plain YAML scalars that would be a syntax error, or — worse — parse to
// something other than the text typed: "1984: A Novel" fails outright, while
// "#anon" silently becomes null and "a # b" silently becomes "a".
const UNSAFE_PLAIN = /^[-?:,[\]{}#&*!|>'"%@`]|^\s|\s$|:\s|:$|\s#|\n/;

// Quotes a value only when it needs it, so the usual `location: berlin` and
// `camera: Ricoh GR IIIx` keep the unquoted look the rest of the site has.
export const scalar = (value) => {
  if (value === undefined || value === null || value === "") return value;

  const text = String(value);
  return UNSAFE_PLAIN.test(text) ? quoted(text) : text;
};

export function readFrontMatter(file) {
  const raw = fs.readFileSync(file, "utf8");
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { data: {}, body: raw, raw };

  const data = {};
  for (const line of match[1].split("\n")) {
    const pair = line.match(/^([A-Za-z_][\w-]*):\s*(.*)$/);
    if (!pair) continue;
    data[pair[1]] = pair[2].trim().replace(/^["'](.*)["']$/, "$1");
  }

  return { data, body: match[2], raw };
}

/* ============================================
   Files
============================================ */

export function postPath(date, slug, { drafts = false } = {}) {
  const dir = drafts ? DRAFTS_DIR : POSTS_DIR;
  return path.join(dir, `${formatDay(date)}-${slug}.md`);
}

// Places are named after their pid, which is how posts refer to them.
export const placePath = (pid) => path.join(PLACES_DIR, `${pid}.md`);

export function writeContent(file, content, { force = false } = {}) {
  if (!force && fs.existsSync(file)) {
    throw new Error(`File already exists: ${path.relative(ROOT, file)}`);
  }

  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  invalidate();

  return path.relative(ROOT, file);
}

// The menu is long-lived: without this, a post created in one action is
// invisible to the next one (missing from "Edit a post", ignored by the
// location and camera suggestions) until the process restarts.
export function invalidate() {
  index = null;
  placeIndex = null;
}

/* ============================================
   Site vocabulary
============================================ */

const listMarkdown = (dir) =>
  fs.existsSync(dir)
    ? fs
        .readdirSync(dir)
        .filter((file) => file.endsWith(".md"))
        .map((file) => file.replace(/\.md$/, ""))
    : [];

// Recent posts, newest first (filenames are date-prefixed, so a sort is enough).
export function recentPosts(limit = 400) {
  if (!fs.existsSync(POSTS_DIR)) return [];

  return fs
    .readdirSync(POSTS_DIR)
    .filter((file) => file.endsWith(".md"))
    .sort()
    .reverse()
    .slice(0, limit)
    .map((file) => path.join(POSTS_DIR, file));
}

// Front matter of the most recent posts, read once per run: the forms ask for
// suggestions on every keystroke, so this must not hit the disk each time.
let index = null;

function postIndex() {
  if (!index) {
    index = recentPosts(200).map((file) => ({
      file,
      data: readFrontMatter(file).data,
    }));
  }
  return index;
}

// Drafts first, then the newest posts: what the editor picker offers.
export function recentEntries() {
  const drafts = fs.existsSync(DRAFTS_DIR)
    ? fs
        .readdirSync(DRAFTS_DIR)
        .filter((file) => file.endsWith(".md"))
        .sort()
        .reverse()
        .map((file) => {
          const full = path.join(DRAFTS_DIR, file);
          return { file: full, data: readFrontMatter(full).data, draft: true };
        })
    : [];

  return [
    ...drafts,
    ...postIndex().map((entry) => ({ ...entry, draft: false })),
  ];
}

// The day an entry belongs to, for the post list: the front matter date when
// there is one, otherwise the date prefix the filenames carry.
export function entryDay(entry) {
  const written = String(entry.data?.date || "").match(/^(\d{4}-\d{2}-\d{2})/);
  if (written) return written[1];

  const named = path.basename(entry.file).match(/^(\d{4}-\d{2}-\d{2})/);
  return named ? named[1] : "";
}

// Values already in use for a front matter key, most recently used first.
export function usedValues(key) {
  const seen = new Set();

  for (const { data } of postIndex()) {
    if (data[key]) seen.add(data[key]);
  }

  return [...seen];
}

// Everything that can legitimately go in `location:`: cities with a map,
// generated location pages, and whatever recent posts are already using.
export function locations() {
  const known = new Set([
    ...usedValues("location"),
    ...listMarkdown(MAPS_DIR),
    ...listMarkdown(LOCATIONS_DIR),
  ]);

  return [...known];
}

export const cameras = () => {
  const known = new Set([
    ...usedValues("camera"),
    ...CAMERAS.map((c) => c.name),
  ]);
  return [...known];
};

export const lastLocation = () => usedValues("location")[0] || "";

export function detectCamera(filenames) {
  const found = CAMERAS.filter(({ pattern }) =>
    filenames.some((name) => pattern.test(name)),
  ).map(({ name }) => name);

  return found;
}

/* ============================================
   Places
============================================ */

// Front matter of every place, read once per run — the same reason the post
// index is cached: the forms ask for suggestions on every keystroke.
let placeIndex = null;

function placeEntries() {
  if (!placeIndex) {
    placeIndex = fs.existsSync(PLACES_DIR)
      ? fs
          .readdirSync(PLACES_DIR)
          .filter((file) => file.endsWith(".md"))
          .map((file) => readFrontMatter(path.join(PLACES_DIR, file)).data)
      : [];
  }
  return placeIndex;
}

// Values already in use for a key of the place front matter, in file order.
export function placeValues(key) {
  const seen = new Set();

  for (const data of placeEntries()) {
    // Emoji are stored as YAML escapes in some files ("\U0001F37A"), which
    // would be offered back as literal backslashes; those are not suggestions.
    if (data[key] && !String(data[key]).startsWith("\\")) seen.add(data[key]);
  }

  return [...seen];
}

// Taken pids, so a new place can't quietly shadow an existing one: posts
// reference places by pid, and the map generator keys on it too.
export const placePids = () => new Set(placeValues("pid"));

// A place only shows up on a map, so the cities with one come first.
export const placeLocations = () => [
  ...new Set([...listMarkdown(MAPS_DIR), ...placeValues("location")]),
];

// Where you most likely are: the city of the last post, when that city has
// places at all, and otherwise the city of the place updated most recently.
export function lastPlaceLocation() {
  const known = placeLocations();
  const posted = lastLocation();
  if (known.includes(posted)) return posted;

  const recent = placeEntries()
    .filter((data) => data.location && data.updated_at)
    .sort((a, b) =>
      String(b.updated_at).localeCompare(String(a.updated_at)),
    )[0];

  return recent ? recent.location : "";
}

const COORDINATE = /-?\d+(?:\.\d+)?/.source;

// Accepts what you actually have in hand: a pasted pair of coordinates, or a
// Google/Apple Maps URL.
export function parseLatLng(input) {
  const text = String(input || "").trim();
  if (!text) return null;

  // A Google Maps URL carries the viewport centre after @ and the pin itself
  // in the !3d…!4d pair, so the pin wins whenever both are there.
  const pin = text.match(new RegExp(`!3d(${COORDINATE})!4d(${COORDINATE})`));
  const pair = text.match(
    new RegExp(`^(${COORDINATE})[,\\s]+(${COORDINATE})$`),
  );
  const viewport = text.match(
    new RegExp(`[@=](${COORDINATE}),(${COORDINATE})`),
  );

  const found = pin || pair || viewport;
  if (!found) return null;

  const lat = Number(found[1]);
  const lng = Number(found[2]);
  if (Math.abs(lat) > 90 || Math.abs(lng) > 180) return null;

  return { lat, lng };
}

/* ============================================
   Photos
============================================ */

const IMAGE_EXTENSION = /\.(jpe?g|png|webp|tiff?|heic|heif|dng|raf|arw)$/i;

// Accepts anything you can paste: bare names, full paths, names with an
// extension, and an optional `3/2`-style ratio after a filename.
export function parsePhotoLine(line, fallbackRatio = DEFAULT_RATIO) {
  const photos = [];

  for (const token of line.trim().split(/\s+/).filter(Boolean)) {
    if (/^\d+\/\d+$/.test(token)) {
      if (photos.length) photos[photos.length - 1].ratio = token;
      continue;
    }

    const filename = path.basename(token).replace(IMAGE_EXTENSION, "");
    if (filename) photos.push({ filename, ratio: fallbackRatio });
  }

  return photos;
}

export const formatPhoto = (photo) =>
  `${photo.filename} ${photo.ratio === DEFAULT_RATIO ? "" : photo.ratio}`.trim();

// Photo filenames in this repo look like 2026-07-16-Berlin-R0021086, so both
// the date and the city can usually be recovered from the first one.
export function photoContext(filename) {
  const date = filename.match(/^(\d{4})-(\d{2})-(\d{2})/);
  const place = filename.match(/^\d{4}-\d{2}-\d{2}-([^-]+)/);

  return {
    date: date
      ? new Date(Number(date[1]), Number(date[2]) - 1, Number(date[3]))
      : null,
    location: place ? place[1].toLowerCase() : null,
  };
}

// Groups a photo list into the {% stack %} / {% row %} blocks the reportage
// layout uses: portraits pair up in rows, everything else stacks.
export function photoBlocks(photos) {
  const blocks = [];
  let portraits = [];

  const flush = () => {
    while (portraits.length) {
      const pair = portraits.splice(0, 2);
      blocks.push({ type: pair.length === 2 ? "row" : "stack", photos: pair });
    }
  };

  for (const photo of photos) {
    const [w, h] = photo.ratio.split("/").map(Number);
    if (h > w) {
      portraits.push(photo);
      if (portraits.length === 2) flush();
      continue;
    }
    flush();
    blocks.push({ type: "stack", photos: [photo] });
  }

  flush();
  return blocks;
}

export function renderPhotoBody(location, photos) {
  return photoBlocks(photos)
    .map((block) => {
      const tags = block.photos
        .map(
          (photo) =>
            `    {% photo ${location} ${photo.filename} ${photo.ratio} %}`,
        )
        .join("\n");
      return `{% ${block.type} %}\n${tags}\n{% end${block.type} %}`;
    })
    .join("\n\n");
}

// Reads `{% photo location filename ratio %}` tags out of a post body, which
// is how the `filenames:` front matter block is kept in sync with the layout.
export function photosInBody(body) {
  const photos = [];
  const tag = /\{%-?\s*photo\s+([^%]+?)\s*-?%\}/g;

  let match;
  while ((match = tag.exec(body)) !== null) {
    let markup = match[1];
    const named = {};

    markup = markup.replace(
      /(\w+):"([^"]*)"|(\w+):'([^']*)'/g,
      (_, k1, v1, k2, v2) => {
        named[k1 || k2] = v1 !== undefined ? v1 : v2;
        return "";
      },
    );
    markup = markup.replace(/(\w+):(\S+)/g, (_, key, value) => {
      named[key] = value;
      return "";
    });

    const positional = markup.trim().split(/\s+/).filter(Boolean);
    const filename = named.filename || positional[1];
    if (!filename) continue;

    const ratio =
      named.ratio ||
      (/^\d+\/\d+$/.test(positional[2] || "") ? positional[2] : null);
    photos.push({ filename, ratio, caption: named.caption });
  }

  return photos;
}
