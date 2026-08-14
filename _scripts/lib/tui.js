// Small terminal UI toolkit shared by the site CLI (_scripts/cli.js).
//
// Everything here is promise-based so screens compose as plain `await` calls:
//
//   const action = await select({ title: "Menu", items });
//   const values = await form(fields, { title: "New post" });
//
// No dependencies: raw ANSI plus process.stdin in raw mode.

import { spawn } from "node:child_process";

/* ============================================
   Colors
============================================ */

export const color = {
  reset: "\x1b[0m",
  dim: "\x1b[2m",
  bold: "\x1b[1m",
  gray: "\x1b[38;5;245m",
  green: "\x1b[38;5;114m",
  blue: "\x1b[38;5;75m",
  yellow: "\x1b[38;5;221m",
  red: "\x1b[38;5;203m",
  invert: "\x1b[7m",
};

const ANSI_RE = /\x1b\[[0-9;]*m/g;

export const visibleWidth = (string) => string.replace(ANSI_RE, "").length;

export function truncate(string, max) {
  if (max <= 0) return "";
  if (visibleWidth(string) <= max) return string;

  let out = "";
  let shown = 0;
  let i = 0;

  while (i < string.length && shown < max - 1) {
    const escape = string.slice(i).match(/^\x1b\[[0-9;]*m/);
    if (escape) {
      out += escape[0];
      i += escape[0].length;
      continue;
    }
    out += string[i];
    i += 1;
    shown += 1;
  }

  return `${out}…${color.reset}`;
}

/* ============================================
   Terminal
============================================ */

export const Terminal = {
  // Some terminals report a nonsense size until the first resize event; a
  // height of 0 or 1 would collapse every frame to an empty screen.
  width: () => Math.max(20, process.stdout.columns || 80),
  height: () => Math.max(10, process.stdout.rows || 24),

  hideCursor() {
    process.stdout.write("\x1b[?25l");
  },

  showCursor() {
    process.stdout.write("\x1b[?25h");
  },

  clear() {
    process.stdout.write("\x1b[2J\x1b[3J\x1b[H");
  },

  // Raw mode lets us read single keypresses instead of whole lines.
  raw(enabled) {
    if (process.stdin.isTTY) process.stdin.setRawMode(enabled);
    if (enabled) {
      process.stdin.resume();
      process.stdin.setEncoding("utf8");
    } else {
      process.stdin.pause();
    }
  },

  enter() {
    Terminal.raw(true);
    Terminal.hideCursor();
    Terminal.clear();
  },

  leave() {
    Terminal.showCursor();
    Terminal.raw(false);
  },
};

// Repaints the whole frame in one write, starting from the home position and
// clearing each line as we go, so there is no flicker between renders.
export function paint(lines, cursor) {
  const width = Terminal.width();
  const height = Terminal.height();
  const visible = lines.slice(0, height);

  let frame =
    "\x1b[H" +
    visible.map((line) => `${truncate(line, width)}\x1b[K`).join("\n") +
    "\x1b[J";

  if (cursor) {
    frame += `\x1b[${cursor.row};${cursor.col}H\x1b[?25h`;
  } else {
    frame += "\x1b[?25l";
  }

  process.stdout.write(frame);
}

/* ============================================
   Keyboard
============================================ */

export const KEY = {
  up: "\u001b[A",
  down: "\u001b[B",
  right: "\u001b[C",
  left: "\u001b[D",
  enter: "\r",
  escape: "\u001b",
  backspace: "\u007f",
  tab: "\t",
  shiftTab: "\u001b[Z",
  ctrlC: "\u0003",
  ctrlD: "\u0004",
  ctrlU: "\u0015",
  ctrlW: "\u0017",
};

// A single read can carry a whole paste, so split the chunk into individual
// keys (keeping escape sequences such as arrows intact).
export function parseKeys(chunk) {
  const keys = [];
  let i = 0;

  while (i < chunk.length) {
    if (chunk[i] === KEY.escape) {
      const rest = chunk.slice(i);
      const sequence =
        rest.match(/^\u001b\[[0-9;]*[A-Za-z~]/) ||
        rest.match(/^\u001bO[A-Za-z]/);

      if (sequence) {
        keys.push(sequence[0]);
        i += sequence[0].length;
        continue;
      }
    }

    // Terminals disagree about Enter, and a pasted block arrives with "\n"
    // line breaks; treat both as the same key.
    keys.push(chunk[i] === "\n" ? KEY.enter : chunk[i]);
    i += 1;
  }

  return keys;
}

// Runs `handler` for every keypress until it calls `done()`. The returned
// promise carries a `cancel()` so something other than the keyboard (a timer,
// a background process finishing) can end the screen and detach the listeners.
function readKeys(handler) {
  let cancel = () => {};

  const promise = new Promise((resolve) => {
    let finished = false;

    const done = (value) => {
      if (finished) return;
      finished = true;
      process.stdin.off("data", onData);
      process.stdin.off("end", onEnd);
      process.stdout.off("resize", onResize);
      resolve(value);
    };

    const onData = (chunk) => {
      for (const key of parseKeys(chunk)) {
        if (finished) return;
        if (key === KEY.ctrlC) {
          Terminal.leave();
          Terminal.clear();
          process.exit(130);
        }
        handler(key, done);
      }
    };

    const onResize = () => handler(null, done);
    const onEnd = () => done(null); // input closed: unwind instead of hanging

    cancel = done;

    process.stdin.on("data", onData);
    process.stdin.on("end", onEnd);
    process.stdout.on("resize", onResize);
  });

  promise.cancel = (value) => cancel(value);

  return promise;
}

/* ============================================
   Shared chrome
============================================ */

// `status` is pinned to the right of the title — somewhere for a screen to say
// something that is true all the time (the dev server) rather than in a row.
function heading(title, note, status) {
  const left =
    `${color.bold}${color.blue}${title}${color.reset}` +
    (note ? ` ${color.dim}${note}${color.reset}` : "");

  if (!status) return [left, ""];

  const gap = Terminal.width() - visibleWidth(left) - visibleWidth(status);

  return [gap < 2 ? left : `${left}${" ".repeat(gap)}${status}`, ""];
}

// Builds a full-height frame: header, body, then hints pinned to the last row.
function frame(header, body, hints) {
  const height = Terminal.height();
  const width = Terminal.width();
  const lines = [...header, ...body];

  while (lines.length < height - 1) lines.push("");

  const [left = "", right = ""] = hints;
  const gap = Math.max(1, width - visibleWidth(left) - visibleWidth(right));
  lines.length = height - 1;
  lines.push(`${color.dim}${left}${" ".repeat(gap)}${right}${color.reset}`);

  return lines;
}

// A label, a hint or a status can be a function, so a screen can say what is
// true when it is drawn rather than when it was written.
export const value = (thing) => (typeof thing === "function" ? thing() : thing);

// Case-insensitive subsequence match, so "npo" finds "New post".
function fuzzy(needle, haystack) {
  if (!needle) return true;

  const target = String(haystack).toLowerCase();
  let i = 0;

  for (const char of needle.toLowerCase()) {
    i = target.indexOf(char, i);
    if (i === -1) return false;
    i += 1;
  }

  return true;
}

/* ============================================
   select()
============================================ */

// items: { label, prefix, hint, value, keywords, dim } | { header: "Section" }
// `prefix` is a dim, aligned column before the label (the dates in the post
// list); `dim` greys the label down (drafts). Resolves with the chosen item's
// `value`, or null when cancelled.
//
// Three options change the shape of the screen:
//
//   pages     [{ title, items }] instead of one list — a tab bar on top,
//             ←→ / ⇥ to move between them, `/` searching across all of them.
//             `onPage(index)` reports where the reader left off.
//   multiple  checkboxes: space picks, ⏎ resolves with an array of values
//             (the highlighted one when nothing is picked). `checked` presets.
//   globals   [{ key, hint, value }] — a key that resolves from anywhere in
//             the list, for the one or two things you always want at hand.
//
// `status` (a string or a function) is drawn at the top right on every render.
export function select({
  title,
  note,
  items,
  pages,
  hints = "",
  multiple = false,
  status,
  globals = [],
  page = 0,
  onPage,
}) {
  const tabs = pages && pages.length ? pages : [{ items: items || [] }];
  const tabbed = Boolean(pages && pages.length > 1);

  let current = Math.max(0, Math.min(page, tabs.length - 1));
  let filter = "";
  let filtering = false;
  let index = 0;
  let offset = 0;

  const chosen = new Set(
    multiple
      ? tabs
          .flatMap((tab) => tab.items)
          .filter((item) => !item.header && item.checked)
          .map((item) => item.value)
      : [],
  );

  // While filtering a tabbed list the search leaves its page: every item is a
  // candidate, and the page titles come along as the section headers.
  const searching = () => tabbed && Boolean(filter);

  const source = () =>
    searching()
      ? tabs.flatMap((tab) => [{ header: tab.title }, ...tab.items])
      : tabs[current].items;

  const matches = () =>
    source().filter(
      (item) =>
        !item.header &&
        fuzzy(
          filter,
          `${item.label} ${item.prefix || ""} ${item.hint || ""} ${item.keywords || ""}`,
        ),
    );

  // Section headers only show up when at least one of their items survives.
  const rows = (visible) => {
    const out = [];

    for (const item of source()) {
      if (item.header) {
        out.push({ header: item.header });
        continue;
      }
      if (!visible.includes(item)) continue;
      out.push({ item, index: visible.indexOf(item) });
    }

    return out.filter((row, i) => {
      if (!row.header) return true;
      const section = out.slice(i + 1);
      const end = section.findIndex((next) => next.header);
      return (end === -1 ? section : section.slice(0, end)).length > 0;
    });
  };

  // The tabs, with the current one underlined — dimmed altogether while a
  // search is running, since the list is no longer showing one page.
  const tabBar = () => {
    const spans = [];
    let width = 0;

    for (const [i, tab] of tabs.entries()) {
      const gap = i === 0 ? 2 : 3;
      const label = tab.title || `Page ${i + 1}`;
      spans.push({ label, start: width + gap, gap });
      width += gap + label.length;
    }

    const labels = spans
      .map(({ label, gap }, i) => {
        const tint =
          i === current && !searching()
            ? `${color.bold}${label}${color.reset}`
            : `${color.gray}${label}${color.reset}`;
        return `${" ".repeat(gap)}${tint}`;
      })
      .join("");

    const active = spans[current];
    const rule = searching()
      ? ""
      : `${" ".repeat(active.start)}${color.yellow}${"─".repeat(active.label.length)}${color.reset}`;

    return [labels, rule, ""];
  };

  const render = () => {
    const visible = matches();
    index = Math.max(0, Math.min(index, visible.length - 1));

    const [line] = heading(title, note, value(status));
    const header = tabbed ? [line, "", ...tabBar()] : [line, ""];
    const all = rows(visible);
    const footer = filtering || filter ? 2 : 0;
    const viewport = Math.max(
      1,
      Terminal.height() - header.length - 1 - footer,
    );

    // Keep the selected row inside the viewport.
    const cursorRow = all.findIndex((row) => row.index === index);
    if (cursorRow >= 0) {
      if (cursorRow < offset) offset = cursorRow;
      if (cursorRow >= offset + viewport) offset = cursorRow - viewport + 1;
    }
    offset = Math.max(0, Math.min(offset, Math.max(0, all.length - viewport)));

    const body = [];

    if (!visible.length) {
      body.push(`  ${color.gray}No matches${color.reset}`);
    }

    // Line the prefixes and the hints up in their own columns so the menu
    // reads as a table.
    const gutter = Math.max(
      0,
      ...visible.map((item) => visibleWidth(item.prefix || "")),
    );

    const column = Math.min(
      40,
      Math.max(
        0,
        ...visible
          .filter((item) => item.hint)
          .map((item) => visibleWidth(item.label)),
      ),
    );

    for (const row of all.slice(offset, offset + viewport)) {
      if (row.header) {
        body.push(`${color.dim}${row.header}${color.reset}`);
        continue;
      }

      const selected = row.index === index;
      const marker = selected ? `${color.yellow}❯${color.reset}` : " ";
      const text = row.item.label;
      const width = visibleWidth(text);

      const box = multiple
        ? chosen.has(row.item.value)
          ? `${color.green}●${color.reset} `
          : `${color.gray}○${color.reset} `
        : "";

      const own = row.item.prefix || "";
      const prefix = gutter
        ? `${color.dim}${own}${" ".repeat(gutter - visibleWidth(own))}${color.reset}  `
        : "";

      const shown = row.item.dim ? `${color.gray}${text}${color.reset}` : text;
      const label = selected ? `${color.bold}${shown}${color.reset}` : shown;

      const hint = row.item.hint
        ? `${" ".repeat(Math.max(1, column - width + 2))}${color.dim}${row.item.hint}${color.reset}`
        : "";

      body.push(`${marker} ${box}${prefix}${label}${hint}`);
    }

    if (footer) {
      body.push("");
      body.push(
        `${color.yellow}/${color.reset}${filter}${filtering ? "▏" : ""}`,
      );
    }

    const counter = visible.length ? `${index + 1}/${visible.length}` : "0/0";
    const left = [
      counter,
      multiple && chosen.size ? `${chosen.size} picked` : null,
      ...globals.map((entry) => entry.hint).filter(Boolean),
    ]
      .filter(Boolean)
      .join(" · ");

    paint(frame(header, body, [left, hints || defaultHints()]));
  };

  const defaultHints = () =>
    multiple
      ? "↑↓ move · space pick · a all · ⏎ run · esc back"
      : [
          "↑↓ move",
          tabbed ? "←→ pages" : null,
          "/ filter",
          "⏎ select",
          "esc quit",
        ]
          .filter(Boolean)
          .join(" · ");

  render();

  // Moving between pages drops the filter: a search spans every page, so
  // switching underneath one would change nothing you can see.
  const turn = (to) => {
    current = (to + tabs.length) % tabs.length;
    filter = "";
    index = 0;
    offset = 0;
    if (onPage) onPage(current);
  };

  const every = () => tabs.flatMap((tab) => tab.items).filter((i) => !i.header);

  // In the order they are listed, not the order they were ticked.
  const picked = () =>
    every()
      .map((item) => item.value)
      .filter((entry) => chosen.has(entry));

  return readKeys((key, done) => {
    const visible = matches();
    const jump = Math.max(1, Math.floor(Terminal.height() / 2));

    if (key === null) return render();

    if (filtering) {
      if (key === KEY.enter) {
        filtering = false;
      } else if (key === KEY.escape) {
        filtering = false;
        filter = "";
        index = 0;
      } else if (key === KEY.backspace) {
        filter = filter.slice(0, -1);
        index = 0;
      } else if (key === KEY.ctrlU) {
        filter = "";
        index = 0;
      } else if (key === KEY.up) {
        index = Math.max(0, index - 1);
      } else if (key === KEY.down) {
        index = Math.min(visible.length - 1, index + 1);
      } else if (key.length === 1 && key >= " ") {
        filter += key;
        index = 0;
      }
      return render();
    }

    // A global answers from anywhere in the list, whichever page is open.
    const global = globals.find((entry) => entry.key === key);
    if (global) return done(global.value);

    switch (key) {
      case "k":
      case KEY.up:
        index = Math.max(0, index - 1);
        break;
      case "j":
      case KEY.down:
        index = Math.min(visible.length - 1, index + 1);
        break;
      case KEY.ctrlU:
        index = Math.max(0, index - jump);
        break;
      case KEY.ctrlD:
        index = Math.min(visible.length - 1, index + jump);
        break;
      case "g":
        index = 0;
        break;
      case "G":
        index = visible.length - 1;
        break;
      case "h":
      case KEY.left:
        if (tabbed) turn(Math.max(0, current - 1));
        break;
      case "l":
      case KEY.right:
        if (tabbed) turn(Math.min(tabs.length - 1, current + 1));
        break;
      case KEY.tab:
        if (tabbed) turn(current + 1);
        break;
      case KEY.shiftTab:
        if (tabbed) turn(current - 1);
        break;
      case " ":
        if (multiple && visible[index]) {
          const entry = visible[index].value;
          if (chosen.has(entry)) chosen.delete(entry);
          else chosen.add(entry);
          index = Math.min(visible.length - 1, index + 1);
        }
        break;
      case "a":
        if (multiple) {
          const all = every();
          if (chosen.size === all.length) chosen.clear();
          else for (const item of all) chosen.add(item.value);
        }
        break;
      case "/":
        filtering = true;
        break;
      case KEY.enter:
        // Nothing ticked reads as "this one" rather than as "nothing".
        if (multiple) {
          if (chosen.size) return done(picked());
          return visible[index] ? done([visible[index].value]) : undefined;
        }
        if (visible[index]) return done(visible[index].value);
        break;
      case KEY.escape:
      case "q":
        if (filter) {
          filter = "";
          index = 0;
          break;
        }
        return done(null);
    }

    render();
  });
}

/* ============================================
   form()
============================================ */

// Field shapes:
//   { name, label, type: "text",    default, optional, hint, validate, preview }
//   { name, label, type: "combo",   choices, ... }   text input with suggestions
//   { name, label, type: "choice",  choices, ... }   pick one, no typing
//   { name, label, type: "list",    parse, format }  collect many entries
//   { name, label, type: "confirm", default: true }
// `when(values)` skips a field, `default` may be a function of the values.
//
// Resolves with a values object, or null when cancelled.
export function form(fields, { title, note } = {}) {
  const values = {};
  // What was actually typed, kept separately from `values` so a transformed
  // answer (a Date, a photo list) can still be edited when going back a step.
  const typed = {};
  const active = fields.filter((field) => !field.when || field.when(values));

  let step = 0;
  let input = "";
  // The text the suggestions are filtered on: the last thing typed, rather
  // than whatever the arrows have since written into the input. Picking a
  // suggestion used to narrow the list down to itself, cutting the walk short.
  let query = "";
  let entries = [];
  let choice = 0;
  let error = "";

  const field = () => active[step];

  const defaultFor = (spec) =>
    typeof spec.default === "function" ? spec.default(values) : spec.default;

  const suggestions = () => {
    const spec = field();
    if (!spec.choices) return [];
    const all =
      typeof spec.choices === "function" ? spec.choices(values) : spec.choices;
    if (spec.type === "choice") return all;
    return all.filter((option) => fuzzy(query, option)).slice(0, 6);
  };

  const enterStep = () => {
    const spec = field();
    error = "";
    choice = 0;
    entries = [];
    input = "";
    query = "";

    if (spec.type === "list") {
      entries = Array.isArray(values[spec.name]) ? [...values[spec.name]] : [];
      return;
    }
    if (spec.type === "confirm") return;

    if (spec.type === "choice") {
      // Come back to the answer that is already there, not to the first option.
      choice = Math.max(0, suggestions().indexOf(values[spec.name]));
      return;
    }

    const preset = typed[spec.name] ?? defaultFor(spec);
    input = preset === undefined || preset === null ? "" : String(preset);
    query = input;
  };

  // What the field would answer right now: what ⏎ commits, and what ↓ commits
  // on its way to the next step.
  const answer = (spec) => {
    if (spec.type === "confirm") {
      return values[spec.name] ?? defaultFor(spec) ?? true;
    }
    if (spec.type === "choice") return suggestions()[choice];
    if (spec.type === "list") return entries;
    return input.trim();
  };

  // Adds what is typed in a list field, so neither ⏎ nor ↓ ever drops it.
  const flush = (spec) => {
    if (!input.trim()) return;

    entries.push(
      ...(spec.parse ? spec.parse(input, entries, values) : [input.trim()]),
    );
    input = "";
  };

  // Going back keeps what is on screen, so a step away is not a retype: an
  // uncommitted input is stashed with the typed answers, and so are the entries
  // a list has collected. Confirm and choice already read from `values`.
  const back = () => {
    const spec = field();
    if (spec.type === "list") values[spec.name] = entries;
    else if (spec.type !== "confirm" && spec.type !== "choice") {
      typed[spec.name] = input;
    }

    step -= 1;
    enterStep();
    render();
  };

  // Recomputes the visible fields, since `when` can depend on earlier answers.
  const refresh = () => {
    active.length = 0;
    for (const spec of fields) {
      if (!spec.when || spec.when(values)) active.push(spec);
    }
  };

  const render = () => {
    const spec = field();
    const header = heading(title, note || `step ${step + 1}/${active.length}`);
    const body = [];

    if (error) {
      body.push(`${color.red}✗ ${error}${color.reset}`, "");
    }

    active.forEach((other, i) => {
      if (i < step) {
        const answer = values[other.name];
        const shown = other.display
          ? other.display(answer, typed[other.name])
          : Array.isArray(answer)
            ? answer.length
              ? answer
                  .map((entry) => (other.format ? other.format(entry) : entry))
                  .join(", ")
              : "—"
            : answer === "" || answer === undefined
              ? "—"
              : String(answer);
        body.push(
          `${color.green}✓${color.reset} ${color.dim}${other.label}:${color.reset} ${shown}`,
        );
      } else if (i > step) {
        body.push(`${color.dim}  ${other.label}${color.reset}`);
      }
    });

    body.splice(step + (error ? 2 : 0), 0, ...renderField(spec));

    paint(
      frame(header, body, ["", fieldHints(spec)]),
      cursorFor(spec, header.length + step + (error ? 2 : 0)),
    );
  };

  const renderField = (spec) => {
    const lines = [];
    const label = `${color.yellow}❯${color.reset} ${color.bold}${spec.label}:${color.reset}`;

    if (spec.type === "confirm") {
      const yes = values[spec.name] ?? defaultFor(spec) ?? true;
      lines.push(
        `${label} ${yes ? `${color.green}yes${color.reset} / no` : `yes / ${color.green}no${color.reset}`}`,
      );
    } else if (spec.type === "choice") {
      lines.push(label);
      suggestions().forEach((option, i) => {
        const on = i === choice;
        lines.push(
          on
            ? `    ${color.invert} ${option} ${color.reset}`
            : `      ${color.gray}${option}${color.reset}`,
        );
      });
    } else if (spec.type === "list") {
      lines.push(`${label} ${input}`);
      entries.forEach((entry, i) => {
        const shown = spec.format ? spec.format(entry) : entry;
        lines.push(
          `    ${color.dim}${String(i + 1).padStart(2)}.${color.reset} ${shown}`,
        );
      });
    } else {
      const preview = spec.preview ? spec.preview(input, values) : "";
      lines.push(
        `${label} ${input}${preview ? ` ${color.dim}→ ${preview}${color.reset}` : ""}`,
      );

      if (spec.type === "combo") {
        suggestions().forEach((option, i) => {
          const on = i === choice;
          lines.push(
            on
              ? `    ${color.invert} ${option} ${color.reset}`
              : `      ${color.gray}${option}${color.reset}`,
          );
        });
      }
    }

    if (spec.hint) lines.push(`    ${color.dim}${spec.hint}${color.reset}`);

    return lines;
  };

  const cursorFor = (spec, row) => {
    if (spec.type === "confirm" || spec.type === "choice") return null;
    const prefix = visibleWidth(`❯ ${spec.label}: `);
    return { row: row + 1, col: prefix + input.length + 1 };
  };

  // ↑↓ only says "move" where the arrows do nothing else: combo and choice
  // spend them on their suggestion list first, so there ⇧⇥ is the shortcut
  // worth naming.
  const fieldHints = (spec) => {
    if (spec.type === "list")
      return "⏎ add · ⌫ remove last · ⏎ (empty) done · ↑↓ move · ⇧⇥ back · esc cancel";
    if (spec.type === "confirm")
      return "←→ toggle · ⏎ confirm · ↑↓ move · ⇧⇥ back · esc cancel";
    if (spec.type === "choice")
      return "↑↓ pick · ⏎ confirm · ⇧⇥ back · esc cancel";
    if (spec.type === "combo")
      return "↑↓ suggestions · ⇥ complete · ⏎ next · ⇧⇥ back · esc cancel";
    return "⏎ next · ↑↓ move · ⇧⇥ back · esc cancel";
  };

  const commit = (value, done) => {
    const spec = field();

    if (spec.validate) {
      const message = spec.validate(value, values);
      if (message) {
        error = message;
        return render();
      }
    }

    typed[spec.name] = value;
    values[spec.name] = spec.transform ? spec.transform(value, values) : value;
    refresh();

    if (step + 1 >= active.length) return done(values);

    step += 1;
    enterStep();
    render();
  };

  enterStep();
  render();

  return readKeys((key, done) => {
    if (key === null) return render();

    const spec = field();
    const options = suggestions();

    if (key === KEY.escape) return done(null);

    if (key === KEY.shiftTab && step > 0) return back();

    // ↑↓ walk the form itself. Combo and choice spend them on their suggestion
    // list first and hand them back at its edges, where they had nowhere left
    // to go, so the arrows always lead somewhere. ↓ answers the field on the
    // way out, exactly as ⏎ would; on the last field it does nothing, since
    // submitting the form is what ⏎ is for.
    const picking =
      (spec.type === "combo" || spec.type === "choice") && options.length > 0;

    if (key === KEY.up && (!picking || choice === 0) && step > 0) return back();

    if (
      key === KEY.down &&
      (!picking || choice === options.length - 1) &&
      step + 1 < active.length
    ) {
      if (spec.type === "list") flush(spec);
      return commit(answer(spec), done);
    }

    if (spec.type === "confirm") {
      const current = answer(spec);
      if (key === KEY.enter) return commit(current, done);
      if (key === "y") return commit(true, done);
      if (key === "n") return commit(false, done);
      if (key === KEY.left || key === KEY.right || key === " ") {
        values[spec.name] = !current;
      }
      return render();
    }

    if (spec.type === "choice") {
      if (key === KEY.enter) return commit(options[choice], done);
      if (key === KEY.up) choice = Math.max(0, choice - 1);
      if (key === KEY.down) choice = Math.min(options.length - 1, choice + 1);
      return render();
    }

    if (spec.type === "list") {
      if (key === KEY.enter) {
        if (input.trim()) {
          flush(spec);
          return render();
        }
        values[spec.name] = entries;
        return commit(entries, done);
      }
      if (key === KEY.backspace) {
        if (input) input = input.slice(0, -1);
        else entries.pop();
        return render();
      }
      if (key === KEY.ctrlU) {
        input = "";
        return render();
      }
      if (key.length === 1 && key >= " ") input += key;
      return render();
    }

    // text / date / combo
    if (key === KEY.enter) return commit(input.trim(), done);

    if (key === KEY.tab && spec.type === "combo" && options.length) {
      input = options[choice] || options[0];
      choice = 0;
      return render();
    }

    if (spec.type === "combo" && (key === KEY.up || key === KEY.down)) {
      if (key === KEY.up) choice = Math.max(0, choice - 1);
      if (key === KEY.down) choice = Math.min(options.length - 1, choice + 1);
      if (options[choice]) input = options[choice];
      return render();
    }

    if (key === KEY.backspace) {
      input = input.slice(0, -1);
    } else if (key === KEY.ctrlU) {
      input = "";
    } else if (key === KEY.ctrlW) {
      input = input.replace(/\s*\S+\s*$/, "");
    } else if (key.length === 1 && key >= " ") {
      input += key;
      choice = 0;
    } else {
      return render(); // a key this field has no use for: nothing changed
    }

    // Editing is a new search, so the suggestions follow the input again.
    query = input;
    render();
  });
}

/* ============================================
   Small helpers
============================================ */

// `details` is shown between the question and the prompt — use it to put the
// exact thing being confirmed (a file list, a diff summary) on screen.
export function confirm(message, { danger = false, details = [] } = {}) {
  const render = () => {
    const body = [
      `${danger ? color.red : color.yellow}${message}${color.reset}`,
      "",
      ...details,
      ...(details.length ? [""] : []),
      `${color.dim}y / n${color.reset}`,
    ];
    paint(frame([], body, ["", "y confirm · n cancel"]));
  };

  render();

  return readKeys((key, done) => {
    if (key === null) return render();
    if (key === "y" || key === "Y") return done(true);
    if (key === "n" || key === "N" || key === KEY.escape || key === KEY.enter) {
      return done(false);
    }
  });
}

const SPINNER = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

// A spinner for work happening outside this process (the background Jekyll
// build). Resolves with whatever `check()` returns as soon as it is truthy,
// with "detached" if a key is pressed first, or with "timeout" if neither
// happens in time. Nothing is cancelled in any of those cases: this only
// stops watching.
export function waitFor(
  check,
  { title, note, message = "Working…", interval = 400, timeout = 180000 } = {},
) {
  let tick = 0;
  let settled = false;

  const render = () =>
    paint(
      frame(
        heading(title, note),
        [
          `  ${color.yellow}${SPINNER[tick % SPINNER.length]}${color.reset} ${message}`,
        ],
        ["", "press any key to leave it running"],
      ),
    );

  render();

  const keys = readKeys((key, done) => {
    if (key === null) return render();
    done("detached");
  });

  keys.then(() => {
    settled = true;
  });

  (async () => {
    const deadline = Date.now() + timeout;

    while (!settled) {
      const result = await check();
      if (settled) return;
      if (result) return keys.cancel(result);
      if (Date.now() >= deadline) return keys.cancel("timeout");

      await new Promise((resolve) => setTimeout(resolve, interval));
      if (settled) return;

      tick += 1;
      render();
    }
  })();

  return keys;
}

// Used after a command has printed to the real terminal; waits outside the
// frame so the output stays on screen.
export function pause(message = "Press any key to go back") {
  process.stdout.write(`\n${color.dim}${message}${color.reset}`);
  Terminal.raw(true);
  return readKeys((key, done) => {
    if (key !== null) done();
  });
}

// Hands the terminal over to a child process (jekyll, node scripts, the
// reading TUI) and takes it back when the child exits.
// `clear: false` keeps the previous command's output on screen, so a sequence
// of commands reads as one transcript.
export function runCommand(command, args, { cwd, env, clear = true } = {}) {
  Terminal.leave();
  if (clear) Terminal.clear();
  process.stdout.write(
    `${color.dim}$ ${command} ${args.join(" ")}${color.reset}\n\n`,
  );

  return new Promise((resolve) => {
    const child = spawn(command, args, {
      stdio: "inherit",
      cwd,
      env: { ...process.env, ...env },
    });

    // While the child owns the terminal, Ctrl-C belongs to it, not to us.
    const ignore = () => {};
    process.on("SIGINT", ignore);

    const finish = (code) => {
      process.off("SIGINT", ignore);
      resolve(code);
    };

    child.on("exit", (code) => finish(code ?? 0));
    child.on("error", (error) => {
      process.stdout.write(`${color.red}${error.message}${color.reset}\n`);
      finish(1);
    });
  });
}

// Same idea as runCommand but for code that runs in this process and prints
// with ora spinners (the _scripts/*.js data classes). `clear: false` keeps what
// the previous task printed, so a run of several reads as one transcript.
export async function runInline(label, task, { clear = true } = {}) {
  Terminal.leave();
  if (clear) Terminal.clear();
  else process.stdout.write("\n");
  process.stdout.write(`${color.dim}${label}${color.reset}\n\n`);

  try {
    await task();
  } catch (error) {
    process.stdout.write(`\n${color.red}${error.message}${color.reset}\n`);
    if (process.env.DEBUG)
      process.stdout.write(`${color.dim}${error.stack}${color.reset}\n`);
  }
}
