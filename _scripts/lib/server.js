// The Jekyll dev server, running in the background so the menu stays usable.
//
// Jekyll is spawned detached (its own process group, so stopping it takes the
// whole tree down) with its output redirected to .computer/serve.log. The pid
// and how it was started live in .computer/serve.json, so a later `./computer`
// finds a server it did not start itself.

import fs from "node:fs";
import net from "node:net";
import path from "node:path";
import { spawn } from "node:child_process";

import { ROOT } from "./site.js";

// $PORT so two copies of this repo (a worktree, a second workspace) can each
// have their own server instead of fighting over 4001.
export const PORT = Number(process.env.PORT) || 4001;

export const url = (port = PORT) => `http://localhost:${port}`;

const STATE_DIR = path.join(ROOT, ".computer");
const STATE_FILE = path.join(STATE_DIR, "serve.json");
export const LOG_FILE = path.join(STATE_DIR, "serve.log");

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Signal 0 only asks "is this pid there?". EPERM means it is, but it belongs
// to somebody else — which can only happen if the pid has been recycled.
const alive = (pid) => {
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    return error.code === "EPERM";
  }
};

function forget() {
  try {
    fs.unlinkSync(STATE_FILE);
  } catch {
    // already gone
  }
}

// { running } or { running, pid, drafts, port, startedAt }. A stale state file
// (the server was killed from somewhere else) is cleaned up on the way out.
export function status() {
  let state;

  try {
    state = JSON.parse(fs.readFileSync(STATE_FILE, "utf8"));
  } catch {
    return { running: false };
  }

  if (!state.pid || !alive(state.pid)) {
    forget();
    return { running: false };
  }

  return { running: true, ...state };
}

export function start({ drafts = false } = {}) {
  fs.mkdirSync(STATE_DIR, { recursive: true });

  // Truncated on every start: the log is about this run, and it is the only
  // place the build errors go now that nothing is on screen.
  fs.writeFileSync(LOG_FILE, "");
  const out = fs.openSync(LOG_FILE, "a");

  const args = ["exec", "jekyll", "serve", "--trace", "--port", String(PORT)];
  if (drafts) args.splice(3, 0, "--drafts");

  const child = spawn("bundle", args, {
    cwd: ROOT,
    env: { ...process.env, JEKYLL_ENV: "development" },
    detached: true,
    stdio: ["ignore", out, out],
  });

  // A child that never starts (no bundle on the PATH) emits "error", and an
  // unhandled one would take the menu down with it. There is no terminal to
  // print it to any more, so it goes to the log with everything else.
  child.on("error", (error) => {
    try {
      fs.appendFileSync(LOG_FILE, `\n${error.message}\n`);
    } catch {
      // the log is a convenience, not a requirement
    }
    forget();
  });

  child.unref();
  fs.closeSync(out);

  const state = { pid: child.pid, drafts, port: PORT, startedAt: Date.now() };
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));

  return state;
}

// Negative pid: the whole process group, since `bundle exec` sits between us
// and the ruby process actually holding the port.
const signal = (pid, name) => {
  try {
    process.kill(-pid, name);
  } catch {
    try {
      process.kill(pid, name);
    } catch {
      // gone already
    }
  }
};

export async function stop() {
  const state = status();

  if (!state.running) {
    forget();
    return false;
  }

  signal(state.pid, "SIGTERM");

  for (let waited = 0; waited < 5000 && alive(state.pid); waited += 100) {
    await sleep(100);
  }

  if (alive(state.pid)) signal(state.pid, "SIGKILL");

  forget();
  return true;
}

// Whether something answers on the port — the only honest way to know the
// build finished, since Jekyll spends a while alive but not yet listening.
export const ready = (port = PORT) =>
  new Promise((resolve) => {
    const socket = net.connect({ port, host: "127.0.0.1" });

    const finish = (value) => {
      socket.destroy();
      resolve(value);
    };

    socket.setTimeout(1000);
    socket.once("connect", () => finish(true));
    socket.once("timeout", () => finish(false));
    socket.once("error", () => finish(false));
  });

export function log(lines = 40) {
  let raw;

  try {
    raw = fs.readFileSync(LOG_FILE, "utf8");
  } catch {
    return [];
  }

  const trimmed = raw.replace(/\s+$/, "");
  return trimmed ? trimmed.split("\n").slice(-lines) : [];
}

export function uptime(startedAt) {
  const seconds = Math.max(0, Math.round((Date.now() - startedAt) / 1000));
  if (seconds < 60) return `${seconds}s`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;

  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
}
