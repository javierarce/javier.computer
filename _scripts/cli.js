#!/usr/bin/env node

// One entry point for everything this site needs day to day: creating posts,
// reportages and photo entries, refreshing the data files, and running Jekyll.
//
//   ./computer            open the menu
//   ./computer post       jump straight to an action
//   ./computer --help     list the actions

import fs from "node:fs";
import path from "node:path";
import { execFileSync, spawn } from "node:child_process";

import {
  Terminal,
  color,
  confirm,
  form,
  pause,
  runCommand,
  runInline,
  select,
  waitFor,
} from "./lib/tui.js";

import * as site from "./lib/site.js";
import * as server from "./lib/server.js";

/* ============================================
   Shared form fields
============================================ */

const required = (what) => (value) => (value ? null : `${what} is required.`);

const titleField = {
  name: "title",
  label: "Title",
  validate: required("A title"),
};

const dateField = (options = {}) => ({
  name: "date",
  label: "Date",
  default: "now",
  hint: "now · yesterday · 3 days ago · last friday · 2026-08-01 21:30",
  preview: (value) => {
    const date = site.parseDate(value);
    return date ? site.formatDate(date) : "";
  },
  validate: (value) =>
    site.parseDate(value) ? null : "I can't read that date.",
  transform: (value) => site.parseDate(value),
  display: (date) => site.formatDate(date),
  ...options,
});

const locationField = (options = {}) => ({
  name: "location",
  label: "Location",
  type: "combo",
  choices: () => site.locations(),
  default: () => site.lastLocation(),
  ...options,
});

const cameraField = (options = {}) => ({
  name: "camera",
  label: "Camera",
  type: "combo",
  choices: () => site.cameras(),
  hint: "separate two cameras with a comma",
  ...options,
});

const photosField = (options = {}) => ({
  name: "photos",
  label: "Photos",
  type: "list",
  hint: `paste or type filenames; add a ratio after one to override ${site.DEFAULT_RATIO}`,
  parse: (line) => site.parsePhotoLine(line, site.DEFAULT_RATIO),
  format: site.formatPhoto,
  validate: (photos) => (photos.length ? null : "Add at least one photo."),
  ...options,
});

const cameraValue = (input) => {
  const names = String(input || "")
    .split(",")
    .map((name) => name.trim())
    .filter(Boolean);

  if (!names.length) return null;
  return names.length === 1 ? site.scalar(names[0]) : names;
};

/* ============================================
   Writing content
============================================ */

// Writes the file, asking before clobbering anything, then offers the editor.
async function create({ file, content }) {
  let force = false;

  if (fs.existsSync(file)) {
    const relative = path.relative(site.ROOT, file);
    if (
      !(await confirm(`${relative} already exists. Overwrite it?`, {
        danger: true,
      }))
    ) {
      return null;
    }
    force = true;
  }

  const relative = site.writeContent(file, content, { force });
  await openInEditor(file, relative);

  return relative;
}

// Editors to fall back on, in order, when $VISUAL and $EDITOR are both unset.
// `code` needs -w or it returns before you have typed anything.
const FALLBACK_EDITORS = ["nvim", "vim", "code -w", "nano", "open -t"];

const onPath = (command) =>
  (process.env.PATH || "")
    .split(path.delimiter)
    .some((dir) => dir && fs.existsSync(path.join(dir, command)));

function resolveEditor() {
  const configured = process.env.VISUAL || process.env.EDITOR;
  if (configured) return configured;

  return FALLBACK_EDITORS.find((candidate) => onPath(candidate.split(" ")[0]));
}

// Hands the file to the editor and comes back to the menu when it exits.
async function edit(file) {
  const editor = resolveEditor();

  if (!editor) {
    return report([
      `${color.yellow}No editor found. Set $EDITOR and try again.${color.reset}`,
    ]);
  }

  const [command, ...args] = editor.split(/\s+/);
  await runCommand(command, [...args, file]);
}

async function openInEditor(file, relative) {
  const editor = resolveEditor();
  const created = `${site.randomEmoji()} Created ${color.bold}${relative}${color.reset}`;

  if (!editor) return report([created]);

  if (
    await confirm(`${site.randomEmoji()} Created ${relative} — edit it now?`)
  ) {
    return edit(file);
  }

  await report([created]);
}

// Prints outside the full-screen frame, so the message survives on screen.
async function report(lines) {
  Terminal.leave();
  Terminal.clear();
  process.stdout.write(`${lines.join("\n")}\n`);
  await pause();
}

/* ============================================
   Create actions
============================================ */

async function newPost({ drafts = false } = {}) {
  const values = await form(
    [
      titleField,
      dateField(),
      locationField({ hint: "leave empty to skip" }),
      { name: "tags", label: "Tags", hint: "comma separated, optional" },
    ],
    { title: drafts ? "New draft" : "New post" },
  );

  if (!values) return;

  const tags = values.tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  const content =
    site.frontMatter([
      ["layout", "post"],
      ["title", site.quoted(values.title)],
      ["date", site.quoted(site.formatDate(values.date))],
      ["location", site.scalar(values.location)],
      ["tags", tags],
    ]) + "\n";

  await create({
    file: site.postPath(values.date, site.slugify(values.title), { drafts }),
    content,
  });
}

async function newPhotoPost() {
  const values = await form(
    [
      titleField,
      photosField(),
      dateField(),
      locationField({ validate: required("A location") }),
      cameraField({
        default: (v) => site.detectCamera(names(v.photos)).join(", "),
      }),
      {
        name: "hide",
        label: "Hide from the home page",
        type: "confirm",
        default: false,
      },
    ],
    { title: "New photo post" },
  );

  if (!values) return;

  const content =
    site.frontMatter([
      ["layout", "photos/photo"],
      ["title", site.quoted(values.title)],
      ["date", site.quoted(site.formatDate(values.date))],
      ["category", "photo"],
      ["tag", "photo"],
      ["location", site.scalar(values.location)],
      ["camera", cameraValue(values.camera)],
      ["hide_title", true],
      ["hide", values.hide],
      [
        "filenames",
        values.photos.map((photo) => ({
          filename: photo.filename,
          ratio: photo.ratio,
        })),
      ],
    ]) + "\n";

  await create({
    file: site.postPath(values.date, site.slugify(values.title)),
    content,
  });
}

async function newReportage() {
  const values = await form(
    [
      photosField(),
      titleField,
      dateField({
        default: (v) => {
          const context = site.photoContext(first(v.photos));
          return context.date ? site.formatDay(context.date) : "now";
        },
      }),
      locationField({
        default: (v) =>
          site.photoContext(first(v.photos)).location || site.lastLocation(),
        validate: required("A location"),
      }),
      cameraField({
        default: (v) => site.detectCamera(names(v.photos)).join(", "),
      }),
      {
        name: "cover",
        label: "Cover",
        type: "combo",
        choices: (v) => names(v.photos),
        default: (v) => first(v.photos),
      },
    ],
    { title: "New reportage" },
  );

  if (!values) return;

  const content =
    site.frontMatter([
      ["layout", "reportage"],
      ["title", site.quoted(values.title)],
      ["hide_title", true],
      ["date", site.quoted(site.formatDate(values.date))],
      ["category", "reportage"],
      ["tag", "photo"],
      ["location", site.scalar(values.location)],
      ["camera", cameraValue(values.camera)],
      ["cover", site.scalar(values.cover)],
      ["ratio", site.DEFAULT_RATIO],
      [
        "filenames",
        values.photos.map((photo) => ({
          filename: photo.filename,
          ratio: photo.ratio,
        })),
      ],
    ]) +
    "\n" +
    site.renderPhotoBody(values.location, values.photos) +
    "\n";

  await create({
    file: site.postPath(values.date, site.slugify(values.title)),
    content,
  });
}

async function newQuote() {
  const values = await form(
    [
      titleField,
      { name: "author", label: "Author", validate: required("An author") },
      { name: "book", label: "Book", hint: "optional" },
      { name: "editorial", label: "Publisher", hint: "optional" },
      { name: "year", label: "Year", hint: "optional" },
      dateField(),
      { name: "tags", label: "Tags", hint: "comma separated, optional" },
    ],
    { title: "New quote" },
  );

  if (!values) return;

  const tags = values.tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  const content =
    site.frontMatter([
      ["layout", "quote"],
      ["title", site.quoted(values.title)],
      ["date", site.quoted(site.formatDate(values.date))],
      ["category", "quote"],
      ["author", site.scalar(values.author)],
      ["book", site.scalar(values.book)],
      ["editorial", site.scalar(values.editorial)],
      ["year", site.scalar(values.year)],
      ["tags", tags],
    ]) + "\n";

  await create({
    file: site.postPath(values.date, site.slugify(values.title)),
    content,
  });
}

async function newVideo() {
  const values = await form(
    [
      titleField,
      {
        name: "src",
        label: "Video URL",
        default: "https://img.javier.computer/videos/",
        validate: (value) =>
          /^https?:\/\/\S+\.\w+$/.test(value)
            ? null
            : "That doesn't look like a video URL.",
      },
      dateField(),
      locationField(),
    ],
    { title: "New video" },
  );

  if (!values) return;

  const content =
    site.frontMatter([
      ["layout", "video"],
      ["title", site.quoted(values.title)],
      ["date", site.quoted(site.formatDate(values.date))],
      ["category", "video"],
      ["location", site.scalar(values.location)],
      ["src", site.scalar(values.src)],
    ]) + "\n";

  await create({
    file: site.postPath(values.date, site.slugify(values.title)),
    content,
  });
}

const first = (photos) => (photos && photos[0] ? photos[0].filename : "");
const names = (photos) => (photos || []).map((photo) => photo.filename);

/* ============================================
   Tools
============================================ */

// Opens an existing post or draft — the companion to the create actions, for
// when you come back to something you wrote earlier.
async function editPost() {
  const entries = site.recentEntries();

  if (!entries.length) {
    return report([`${color.yellow}Nothing to edit yet.${color.reset}`]);
  }

  // The date says what the filename said, in ten characters instead of sixty,
  // so the titles start at the same column and the list can be read down.
  const file = await select({
    title: "Edit",
    note: "drafts first, then the newest posts",
    items: entries.map((entry) => ({
      prefix: site.entryDay(entry),
      label: entry.data.title || path.basename(entry.file, ".md"),
      hint: entry.draft ? "draft" : "",
      dim: entry.draft,
      keywords: path.basename(entry.file, ".md"),
      value: entry.file,
    })),
  });

  if (!file) return;

  await edit(file);
}

/* ============================================
   Publishing
============================================ */

// stderr is swallowed: a missing upstream is an expected answer here, not
// something that should scribble over the frame.
const git = (args) =>
  execFileSync("git", args, {
    cwd: site.ROOT,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"],
    // Trailing whitespace only: porcelain status lines start with a
    // significant space (" M file"), which a plain trim() would eat.
  }).replace(/\s+$/, "");

const gitOrNull = (args) => {
  try {
    return git(args);
  } catch {
    return null;
  }
};

// Colour the porcelain status codes so added / modified / deleted are readable
// at a glance in the confirmation screen.
function describeChange(line) {
  const code = line.slice(0, 2);
  const file = line.slice(3);
  const tint =
    code === "??" || code.includes("A")
      ? color.green
      : code.includes("D")
        ? color.red
        : color.yellow;

  return `  ${tint}${code}${color.reset} ${file}`;
}

// A commit message worth pressing Enter on: the title of the post being added,
// when the change is one new post.
function suggestMessage(changes) {
  const added = changes
    .filter((line) => line.startsWith("??") || line[0] === "A")
    .map((line) => line.slice(3))
    .filter((file) => file.startsWith("content/_posts/"));

  if (added.length !== 1) return "Update";

  const { data } = site.readFrontMatter(path.join(site.ROOT, added[0]));
  return data.title || "New post";
}

// Commit everything and push. Pushing main is what deploys the site, so the
// exact file list and the target branch are shown before anything happens.
async function publish() {
  const changes = (gitOrNull(["status", "--porcelain=v1"]) || "")
    .split("\n")
    .filter(Boolean);

  if (!changes.length) {
    return report([
      `${color.green}Nothing to commit — everything is pushed.${color.reset}`,
    ]);
  }

  const branch = gitOrNull(["rev-parse", "--abbrev-ref", "HEAD"]) || "HEAD";
  const upstream = gitOrNull(["rev-parse", "--abbrev-ref", "@{u}"]);

  const shown = changes.slice(0, Terminal.height() - 10);
  const details = [
    ...shown.map(describeChange),
    ...(changes.length > shown.length
      ? [
          `  ${color.dim}…and ${changes.length - shown.length} more${color.reset}`,
        ]
      : []),
    "",
    `  ${color.dim}branch${color.reset} ${branch}` +
      (upstream
        ? ` → ${upstream}`
        : ` ${color.yellow}(no upstream yet)${color.reset}`),
  ];

  const ok = await confirm(
    `Commit and push ${changes.length} change${changes.length === 1 ? "" : "s"}?`,
    { details },
  );

  if (!ok) return;

  const values = await form(
    [
      {
        name: "message",
        label: "Commit message",
        default: suggestMessage(changes),
        validate: required("A message"),
      },
    ],
    { title: "Publish", note: branch },
  );

  if (!values) return;

  await runCommand("git", ["add", "-A"], { cwd: site.ROOT });

  const committed = await runCommand("git", ["commit", "-m", values.message], {
    cwd: site.ROOT,
    clear: false,
  });

  if (committed === 0) {
    const push = upstream ? ["push"] : ["push", "-u", "origin", "HEAD"];
    await runCommand("git", push, { cwd: site.ROOT, clear: false });
  }

  await pause();
}

/* ============================================
   Tools
============================================ */

// Rebuilds the `filenames:` front matter block from the {% photo %} tags in the
// body, which is how photo posts keep their metadata and their layout in sync.
async function syncFilenames() {
  const candidates = site
    .recentPosts(120)
    .filter((file) => fs.readFileSync(file, "utf8").includes("{% photo"));

  if (!candidates.length) {
    return report([
      `${color.yellow}No posts with {% photo %} tags found.${color.reset}`,
    ]);
  }

  const file = await select({
    title: "Sync filenames",
    note: "pick a post",
    items: candidates.map((candidate) => ({
      label: path.basename(candidate),
      value: candidate,
    })),
  });

  if (!file) return;

  const raw = fs.readFileSync(file, "utf8");
  const parts = raw.match(/^(---\r?\n)([\s\S]*?)(\r?\n---\r?\n)([\s\S]*)$/);

  if (!parts) {
    return report([
      `${color.red}No front matter in ${path.basename(file)}.${color.reset}`,
    ]);
  }

  const [, open, matter, close, body] = parts;
  const photos = site.photosInBody(body);

  const block =
    "filenames:\n" +
    photos
      .map((photo) => {
        const lines = [
          `  - filename: ${photo.filename}`,
          `    ratio: ${photo.ratio || site.DEFAULT_RATIO}`,
        ];
        if (photo.caption)
          lines.push(`    caption: ${site.quoted(photo.caption)}`);
        return lines.join("\n");
      })
      .join("\n");

  const existing = /^filenames:\n(?:[ \t]+.*(?:\n|$))*/m;
  const updated = existing.test(matter)
    ? matter.replace(existing, `${block}\n`)
    : `${matter}\n${block}`;

  fs.writeFileSync(file, open + updated.replace(/\n+$/, "") + close + body);
  site.invalidate();

  await report([
    `${site.randomEmoji()} ${photos.length} photo${photos.length === 1 ? "" : "s"} written to ` +
      `${color.bold}${path.relative(site.ROOT, file)}${color.reset}`,
  ]);
}

/* ============================================
   Data updates
============================================ */

// The data classes in _scripts/ export a class and nothing else, so they are
// imported and run in-process rather than spawned.
const dataTask = (label, load) => async () => {
  await runInline(label, async () => {
    let task;

    try {
      task = await load();
    } catch (error) {
      if (error.code === "ERR_MODULE_NOT_FOUND") {
        throw new Error(
          `${error.message}\nRun "npm install" in _scripts/ before updating data.`,
        );
      }
      throw error;
    }

    await task.run();
  });
  await pause();
};

const movies = async () => {
  const { MovieRSSParser } = await import("./movies.js");
  return new MovieRSSParser("javier");
};

const books = async () => new (await import("./books.js")).Books();
const places = async () => new (await import("./places.js")).Places();
const subscribers = async () =>
  new (await import("./subscribers.js")).Subscribers();
const syndication = async () =>
  new (await import("./syndication.js")).Syndication();

/* ============================================
   Dev server
============================================ */

// Jekyll takes long enough to build this site that watching it happen is dead
// time, so the server runs detached and the menu stays usable while it builds.
async function startServer({ drafts = false } = {}) {
  const current = server.status();

  if (current.running) {
    if (Boolean(current.drafts) === drafts) return serverScreen();

    // Only "start it with drafts" gets this far — picking the running server
    // out of the menu shows it, it never offers to restart it as something
    // else behind your back.
    const now = current.drafts ? "with drafts" : "without drafts";
    const wanted = drafts ? "with drafts" : "without drafts";

    if (
      !(await confirm(
        `The dev server is running ${now}. Restart it ${wanted}?`,
      ))
    ) {
      return serverScreen();
    }

    await server.stop();
  } else if (await server.ready()) {
    // Somebody else owns the port — another workspace, or a `jekyll serve`
    // started by hand. Starting now would only fill the log with EADDRINUSE.
    return report([
      `${color.yellow}Something is already listening on ${server.url()}.${color.reset}`,
      `${color.dim}Another workspace, maybe — PORT=4002 ./computer serve picks a different one.${color.reset}`,
    ]);
  }

  server.start({ drafts });

  const outcome = await waitFor(
    async () => {
      if (!server.status().running) return "failed";
      return (await server.ready()) ? "ready" : false;
    },
    {
      title: drafts ? "Dev server (drafts)" : "Dev server",
      note: server.url(),
      message: "Building the site…",
    },
  );

  if (outcome === "failed") {
    return report([
      `${color.red}The dev server stopped while starting.${color.reset}`,
      "",
      ...server.log(Terminal.height() - 8),
    ]);
  }

  if (outcome === "ready") {
    return report([
      `${site.randomEmoji()} Dev server running at ${color.bold}${server.url()}${color.reset}` +
        (drafts ? ` ${color.dim}(with drafts)${color.reset}` : ""),
      `${color.dim}It keeps running in the background — "stop" when you are done.${color.reset}`,
    ]);
  }

  await report([
    `${color.dim}Still building in the background; it will answer at ${color.reset}${server.url()}${color.dim} when it is ready.${color.reset}`,
  ]);
}

// The screen behind a running server: what it is serving, what it printed
// while nobody was watching, and how to restart or stop it.
async function serverScreen() {
  while (true) {
    const state = server.status();

    if (!state.running) {
      return report([
        `${color.yellow}The dev server is not running.${color.reset}`,
      ]);
    }

    const here = server.url(state.port);
    const note = [
      here,
      state.drafts ? "drafts" : null,
      `up ${server.uptime(state.startedAt)}`,
      `pid ${state.pid}`,
    ]
      .filter(Boolean)
      .join(" · ");

    const choice = await select({
      title: "Dev server",
      note,
      items: [
        { label: "Open in the browser", hint: here, value: "open" },
        { label: "Show the log", hint: ".computer/serve.log", value: "log" },
        { label: "Restart", value: "restart" },
        // The only way back to the other mode: the menu hides "with drafts"
        // while a drafts server is up, and the entry for a running server
        // just brings you here.
        {
          label: state.drafts
            ? "Restart without drafts"
            : "Restart with drafts",
          value: "swap",
        },
        { label: "Stop", value: "stop" },
      ],
      hints: "↑↓ move · ⏎ select · esc back",
    });

    if (!choice) return;

    if (choice === "open") {
      openBrowser(here);
      continue;
    }

    if (choice === "log") {
      const lines = server.log(Terminal.height() - 6);
      await report(
        lines.length
          ? [`${color.dim}${server.LOG_FILE}${color.reset}`, "", ...lines]
          : [`${color.dim}The log is empty.${color.reset}`],
      );
      continue;
    }

    if (choice === "restart" || choice === "swap") {
      const drafts = Boolean(state.drafts);
      await server.stop();
      return startServer({ drafts: choice === "swap" ? !drafts : drafts });
    }

    if (choice === "stop") return stopServer();
  }
}

async function stopServer() {
  if (!server.status().running) {
    return report([
      `${color.yellow}The dev server is not running.${color.reset}`,
    ]);
  }

  await server.stop();
  await report([`${color.green}Dev server stopped.${color.reset}`]);
}

function openBrowser(url) {
  const command = process.platform === "darwin" ? "open" : "xdg-open";
  const child = spawn(command, [url], { stdio: "ignore", detached: true });

  // No xdg-open on this machine is not worth a word, let alone the uncaught
  // exception an unhandled "error" event would be: the URL is on screen.
  child.on("error", () => {});
  child.unref();
}

const serving = () => server.status().running;

/* ============================================
   Commands
============================================ */

const node = (args) => async () => {
  await runCommand(process.execPath, args, { cwd: site.ROOT });
  await pause();
};

const shell = (command, args, env) => async () => {
  await runCommand(command, args, { cwd: site.ROOT, env });
  await pause();
};

const ACTIONS = [
  { header: "Write" },
  {
    id: "post",
    label: "New post",
    hint: "content/_posts",
    run: () => newPost(),
  },
  {
    id: "draft",
    label: "New draft",
    hint: "_drafts",
    run: () => newPost({ drafts: true }),
  },
  {
    id: "photo",
    label: "New photo post",
    hint: "one or more photos",
    run: newPhotoPost,
  },
  {
    id: "reportage",
    label: "New reportage",
    hint: "photo essay with stacks and rows",
    run: newReportage,
  },
  { id: "quote", label: "New quote", run: newQuote },
  { id: "video", label: "New video", run: newVideo },
  {
    id: "edit",
    label: "Edit a post",
    hint: "open an existing post or draft",
    run: editPost,
  },
  {
    id: "publish",
    label: "Commit and push",
    hint: "pushing main deploys the site",
    run: publish,
  },
  {
    id: "reading",
    label: "Reading list",
    hint: "add books, track progress",
    run: node(["_scripts/reading.js"]),
  },

  { header: "Update data" },
  {
    id: "update",
    label: "Update everything",
    hint: "movies, subscribers, syndication",
    run: node(["_scripts/update.js"]),
  },
  {
    id: "movies",
    label: "Update movies",
    hint: "Letterboxd RSS",
    run: dataTask("Movies", movies),
  },
  {
    id: "books",
    label: "Update books",
    hint: "books.javier.computer",
    run: dataTask("Books", books),
  },
  {
    id: "places",
    label: "Update places",
    hint: "poi.javier.computer",
    run: dataTask("Places", places),
  },
  {
    id: "subscribers",
    label: "Update subscribers",
    run: dataTask("Subscribers", subscribers),
  },
  {
    id: "syndication",
    label: "Update syndication links",
    hint: "Mastodon and Bluesky backfeed",
    run: dataTask("Syndication", syndication),
  },
  {
    id: "standard",
    label: "Publish to standard.site",
    hint: "AT Protocol records",
    run: node(["_scripts/standard.js"]),
  },
  {
    id: "standard-dry",
    label: "Publish to standard.site (dry run)",
    run: node(["_scripts/standard.js", "--dry-run"]),
  },

  { header: "Tools" },
  {
    id: "filenames",
    label: "Sync photo filenames",
    hint: "rebuild filenames: from the body",
    run: syncFilenames,
  },
  {
    id: "serve",
    label: () => (serving() ? "Dev server" : "Start the dev server"),
    hint: () => {
      const state = server.status();
      return state.running
        ? `${color.green}●${color.reset} running at localhost:${state.port}` +
            (state.drafts ? ", with drafts" : "")
        : `localhost:${server.PORT}, in the background`;
    },
    run: () => (serving() ? serverScreen() : startServer()),
  },
  {
    id: "serve-drafts",
    label: "Start the dev server with drafts",
    hint: `localhost:${server.PORT}, in the background`,
    hidden: () => server.status().drafts === true,
    run: () => startServer({ drafts: true }),
  },
  {
    id: "stop",
    label: "Stop the dev server",
    hidden: () => !serving(),
    run: stopServer,
  },
  {
    id: "build",
    label: "Build the site",
    run: shell("bundle", ["exec", "jekyll", "build"]),
  },
  {
    id: "format",
    label: "Format",
    hint: "prettier",
    run: shell("npx", ["prettier", "--write", "."]),
  },
  {
    id: "lint",
    label: "Lint",
    hint: "eslint _scripts",
    run: shell("npx", ["eslint", "_scripts/"]),
  },
];

/* ============================================
   App
============================================ */

// A label or a hint can be a function, so that the menu can say whether the
// dev server is up at the moment it is drawn rather than when it was written.
const value = (thing) => (typeof thing === "function" ? thing() : thing);

function usage() {
  const lines = ["javier.computer — usage: computer [action]", ""];

  for (const action of ACTIONS) {
    if (action.header) {
      lines.push(`  ${action.header}`);
      continue;
    }
    lines.push(`    ${action.id.padEnd(16)} ${value(action.label)}`);
  }

  lines.push("", "  Run without arguments to pick from a menu.");
  process.stdout.write(`${lines.join("\n")}\n`);
}

// `computer --debug` when the menu misbehaves: the full-screen UI depends entirely on
// these four values being sane.
function diagnostics() {
  process.stdout.write(
    [
      `node        ${process.version}`,
      `TERM        ${process.env.TERM || "(unset)"}`,
      `stdin tty   ${Boolean(process.stdin.isTTY)}`,
      `stdout tty  ${Boolean(process.stdout.isTTY)}`,
      `size        ${process.stdout.columns}x${process.stdout.rows}`,
      `root        ${site.ROOT}`,
      "",
    ].join("\n"),
  );
}

async function main() {
  const [, , argument] = process.argv;

  if (argument === "--debug") return diagnostics();
  if (argument === "--help" || argument === "-h") return usage();

  // The menu needs a terminal on both ends: without a TTY on stdout the frames
  // go into a pipe and the screen just sits there empty.
  if (!process.stdin.isTTY || !process.stdout.isTTY) {
    process.stdout.write(
      "computer needs an interactive terminal (stdin and stdout must be a TTY).\n\n",
    );
    return usage();
  }

  process.chdir(site.ROOT);

  let pending = argument
    ? ACTIONS.find((action) => action.id === argument)
    : null;

  if (argument && !pending) {
    process.stdout.write(`Unknown action: ${argument}\n\n`);
    return usage();
  }

  try {
    while (true) {
      Terminal.enter();

      const action =
        pending ||
        (await select({
          title: "javier.computer",
          items: ACTIONS.filter(
            (entry) => !entry.hidden || !entry.hidden(),
          ).map((entry) =>
            entry.header
              ? entry
              : {
                  label: value(entry.label),
                  hint: value(entry.hint),
                  value: entry,
                },
          ),
        }));

      if (!action) break;

      await action.run();

      // A direct `computer <action>` invocation does one thing and leaves.
      if (pending) break;
    }
  } finally {
    Terminal.leave();
    Terminal.clear();

    // Quitting the menu leaves the server running, which is the point — but
    // it should not be a surprise a week later.
    const state = server.status();
    if (state.running) {
      process.stdout.write(
        `${color.dim}Dev server still running at${color.reset} ${server.url(state.port)}` +
          `${color.dim} — ./computer stop${color.reset}\n`,
      );
    }
  }
}

// Never leave the terminal in raw mode with a hidden cursor if something blows
// up, and make sure the error is readable instead of swallowed by the frame.
main().catch((error) => {
  Terminal.leave();
  Terminal.clear();
  process.stdout.write(
    `${color.red}${error.stack || error.message}${color.reset}\n`,
  );
  process.exitCode = 1;
});
