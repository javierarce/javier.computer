#!/usr/bin/env node

import fs from "fs";
import fg from "fast-glob";
import matter from "gray-matter";
import yaml from "js-yaml";

/* ============================================
   Colors
============================================ */

const color = {
  reset: "\x1b[0m",
  dim: "\x1b[2m",
  bold: "\x1b[1m",

  gray: "\x1b[38;5;245m",
  green: "\x1b[38;5;114m",
  blue: "\x1b[38;5;75m",
  yellow: "\x1b[38;5;221m",

  invert: "\x1b[7m",
};

/* ============================================
   Terminal helpers
============================================ */

class Terminal {
  static clear() {
    process.stdout.write("\x1b[2J\x1b[H");
  }

  static height() {
    return process.stdout.rows || 24;
  }

  static hideCursor() {
    process.stdout.write("\x1b[?25l");
  }

  static showCursor() {
    process.stdout.write("\x1b[?25h");
  }

  static reset() {
    Terminal.showCursor();
    process.stdin.setRawMode(false);
    process.stdin.pause();
  }
}

/* ============================================
   Book model
============================================ */

class Book {
  constructor({ file, title, pages, progress, status }) {
    this.file = file;
    this.title = title || "Untitled";
    this.pages = pages || 0;
    this.progress = progress || 0;
    this.status = status || "unread";
  }
}

/* ============================================
   Book library
============================================ */

class BookLibrary {
  constructor(path = "content/_books/*.md") {
    this.path = path;
    this.allBooks = [];
  }

  async loadAll() {
    const files = await fg(this.path);
    this.allBooks = [];

    for (const file of files) {
      const raw = fs.readFileSync(file, "utf8");
      const parsed = matter(raw);
      const data = parsed.data;

      if (data.layout === "book") {
        this.allBooks.push(
          new Book({
            file,
            title: data.title,
            pages: Number(data.pages),
            progress: Number(data.progress),
            status: data.status || "unread",
          }),
        );
      }
    }

    return this.allBooks;
  }

  getReading() {
    return this.allBooks.filter((b) => b.status === "reading");
  }
}

/* ============================================
   Book writer
============================================ */

class BookWriter {
  static today() {
    return new Date().toISOString().slice(0, 10);
  }

  static writeProgress(book, newProgress) {
    const raw = fs.readFileSync(book.file, "utf8");
    const parsed = matter(raw);

    parsed.data.progress = newProgress;

    if (newProgress >= 100) {
      parsed.data.status = "finished";
      parsed.data.read = BookWriter.today();
    }

    const newYaml = yaml.dump(parsed.data, { lineWidth: 1000 });
    const output = `---\n${newYaml}---\n` + parsed.content;

    fs.writeFileSync(book.file, output);
  }
}

/* ============================================
   UI
============================================ */

class TerminalUI {
  constructor(library) {
    this.library = library;
    this.view = "reading"; // reading | all
    this.books = library.getReading();
    this.index = 0;
    this.mode = "list";
    this.input = "";
    this.offset = 0;
    this.search = "";
    this.searchMode = false;
    this.filteredBooks = null;
  }

  getVisibleBooks() {
    const list = this.filteredBooks || this.books;
    const height = Terminal.height() - 5; // header + footer
    const maxOffset = Math.max(0, list.length - height);

    if (this.index < this.offset) {
      this.offset = this.index;
    } else if (this.index >= this.offset + height) {
      this.offset = this.index - height + 1;
    }

    this.offset = Math.min(this.offset, maxOffset);

    return list.slice(this.offset, this.offset + height);
  }

  progressBar(pct, width = 20) {
    const filled = Math.round((pct / 100) * width);
    const empty = width - filled;

    return (
      color.green +
      "█".repeat(filled) +
      color.gray +
      "░".repeat(empty) +
      color.reset
    );
  }

  parseProgress(input, pages) {
    input = input.trim();

    if (input.endsWith("%")) {
      const pct = Number(input.replace("%", ""));
      if (!isNaN(pct) && pct >= 0 && pct <= 100) return pct;
    }

    const page = Number(input);
    if (!isNaN(page) && page >= 0) {
      return Math.round((page / pages) * 100);
    }

    return null;
  }

  render() {
    Terminal.clear();

    const title = this.view === "reading" ? "Reading" : "Library";

    const hint =
      this.view === "reading"
        ? "  (j/k move, Enter edit, a = all books, Esc quit)"
        : "  (j/k move, Enter edit, r = reading, Esc quit)";

    // Header (printed ONCE)
    console.log(
      color.bold +
        color.blue +
        title +
        color.reset +
        color.dim +
        hint +
        "\n" +
        color.reset,
    );

    // Book rows
    const visible = this.getVisibleBooks();
    const list = this.filteredBooks || this.books;

    visible.forEach((b, i) => {
      const realIndex = this.offset + i;
      const selected = realIndex === this.index;

      const cursor = selected ? color.invert + "❯" + color.reset : " ";
      const bookTitle = b.title.padEnd(35);
      const bar = this.progressBar(b.progress);
      const pct = color.dim + `${b.progress}%` + color.reset;

      const status =
        this.view === "all" ? color.dim + b.status.padEnd(8) + color.reset : "";

      const line = `${cursor} ${bookTitle} [${bar}] ${pct} ${status}`;
      console.log(selected ? color.invert + line + color.reset : line);
    });

    console.log(
      color.dim +
        `\n${this.index + 1}/${list.length}` +
        (this.filteredBooks ? `  filter: "${this.search}"` : "") +
        color.reset,
    );

    // Input prompt
    if (this.mode === "input") {
      const label = this.searchMode
        ? "Search:"
        : "Enter page number or percentage";

      console.log(
        "\n" +
          color.yellow +
          label +
          color.reset +
          color.dim +
          " (Esc to cancel)\n" +
          color.reset +
          color.bold +
          "> " +
          color.reset +
          this.input,
      );
    }
  }

  start() {
    Terminal.hideCursor();
    Terminal.clear();
    this.render();

    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding("utf8");

    process.stdin.on("data", (key) => this.handleKey(key));

    process.on("exit", Terminal.reset);
    process.on("SIGINT", () => this.exit());
  }

  handleKey(key) {
    // Ctrl+C
    if (key === "\u0003") {
      this.exit();
      return;
    }

    // ESC
    if (key === "\u001b") {
      if (this.searchMode) {
        this.searchMode = false;
        this.search = "";
        this.filteredBooks = null;
        this.mode = "list";
        this.input = "";
        this.render();
        return;
      }
      if (this.mode === "input") {
        this.mode = "list";
        this.input = "";
        this.render();
        return;
      } else {
        this.exit();
        return;
      }
    }

    // Enter
    if (key === "\r") {
      if (this.searchMode) {
        this.searchMode = false;
        this.mode = "list";
        this.input = "";
        this.render();
        return;
      }
      if (this.mode === "list") {
        this.mode = "input";
        this.input = "";
        this.render();
        return;
      } else {
        this.submitInput();
        return;
      }
    }

    // Navigation
    if (key === "\u001b[A" || key === "k") {
      if (this.mode === "list") {
        this.index = Math.max(0, this.index - 1);
        this.render();
      }
      return;
    }

    if (key === "\u001b[B" || key === "j") {
      if (this.mode === "list") {
        this.index = Math.min(this.books.length - 1, this.index + 1);
        this.render();
      }
      return;
    }

    // Text input
    if (this.mode === "input") {
      if (key === "\u007f") {
        this.input = this.input.slice(0, -1);
      } else {
        this.input += key;
      }

      if (this.searchMode) {
        this.search = this.input.toLowerCase();
        this.applySearch();
      }

      this.render();
    }

    // Switch to all books
    if (key === "a" && this.mode === "list") {
      this.view = "all";
      this.books = this.library.allBooks;
      this.index = 0;
      this.render();
      return;
    }

    // Switch back to reading
    if (key === "r" && this.mode === "list") {
      this.view = "reading";
      this.books = this.library.getReading();
      this.index = 0;
      this.render();
      return;
    }

    // Start search
    if (key === "/" && this.mode === "list") {
      this.searchMode = true;
      this.mode = "input";
      this.input = "";
      this.render();
      return;
    }
  }

  submitInput() {
    const book = this.books[this.index];
    const pct = this.parseProgress(this.input, book.pages);

    if (pct !== null) {
      BookWriter.writeProgress(book, pct);
      book.progress = pct;

      if (pct >= 100) {
        this.books.splice(this.index, 1);
        if (this.index >= this.books.length) this.index--;
      }
    }

    this.mode = "list";
    this.input = "";
    this.render();
  }

  applySearch() {
    const list = this.books;

    if (!this.search) {
      this.filteredBooks = null;
      this.index = 0;
      this.offset = 0;
      return;
    }

    this.filteredBooks = list.filter((b) =>
      b.title.toLowerCase().includes(this.search),
    );

    this.index = 0;
    this.offset = 0;
  }

  exit() {
    Terminal.clear();
    Terminal.reset();
    process.exit(0);
  }
}

/* ============================================
   App
============================================ */

class BooklogApp {
  constructor() {
    this.library = new BookLibrary();
  }

  async run() {
    await this.library.loadAll();

    const reading = this.library.getReading();

    if (!reading.length) {
      console.log("No books currently marked as reading.");
      process.exit(0);
    }

    const ui = new TerminalUI(this.library);
    ui.start();
  }
}

/* ============================================
   Boot
============================================ */

new BooklogApp().run();
