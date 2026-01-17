#!/usr/bin/env node

import fs from "fs";
import fg from "fast-glob";
import matter from "gray-matter";
import yaml from "js-yaml";
import path from "path";

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

const MAX_TITLE_WIDTH = 60;

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
  constructor({ file, title, author, pages, progress, status, started }) {
    this.file = file;
    this.title = title || "Untitled";
    this.author = author || "Unknown";
    this.pages = pages || 0;
    this.progress = progress || 0;
    this.status = status || "unread";
    this.started = started || "";
  }
}

/* ============================================
   Book library
============================================ */

class BookLibrary {
  constructor(pattern = "content/_books/*.md") {
    this.pattern = pattern;
    this.directory = "content/_books/";
    this.allBooks = [];
  }

  async loadAll() {
    if (!fs.existsSync(this.directory)) {
      fs.mkdirSync(this.directory, { recursive: true });
    }
    const files = await fg(this.pattern);
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
            author: data.author,
            pages: Number(data.pages),
            progress: Number(data.progress),
            status: data.status || "unread",
            started: data.started,
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

  static createNewBook(dir, details) {
    const filename =
      details.title.toLowerCase().replace(/[^a-z0-9]/g, "-") + ".md";
    const filePath = path.join(dir, filename);

    // Safety check: Prevent overwriting
    if (fs.existsSync(filePath)) {
      throw new Error(`A book file named "${filename}" already exists.`);
    }

    const data = {
      title: details.title,
      layout: "book",
      author: details.author,
      started: BookWriter.today(),
      read: null,
      status: "reading",
      pages: parseInt(details.pages) || 0,
      progress: 0,
    };

    const output = `---\n${yaml.dump(data, { lineWidth: 1000 })}---\n`;
    fs.writeFileSync(filePath, output);
    return new Book({ file: filePath, ...data });
  }
}

/* ============================================
   UI
============================================ */

class TerminalUI {
  constructor(library) {
    this.library = library;
    this.view = "reading";
    this.books = library.getReading();
    this.index = 0;
    this.offset = 0;

    // Modes: list | input | create | confirm-delete
    this.mode = "list";
    this.input = "";
    this.error = "";

    // Create flow state
    this.createStep = 0;
    this.newBookData = { title: "", author: "", pages: "" };

    // Search state
    this.search = "";
    this.searchMode = false;
    this.filteredBooks = null;
  }

  getVisibleBooks() {
    const list = this.filteredBooks || this.books;
    const height = Terminal.height() - 6;
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
    const filled = Math.round((Math.min(100, pct) / 100) * width);
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

    if (this.mode === "create") {
      this.renderCreateFlow();
      return;
    }

    const title = this.view === "reading" ? "Reading" : "Library";
    const hint = " (j/k move, Enter edit, n new, a all, Esc quit)";

    console.log(
      `${color.bold}${color.blue}${title}${color.reset}${color.dim}${hint}\n${color.reset}`,
    );

    const visible = this.getVisibleBooks();
    const list = this.filteredBooks || this.books;

    visible.forEach((b, i) => {
      const realIndex = this.offset + i;
      const selected = realIndex === this.index;
      const cursor = selected ? color.invert + "❯" + color.reset : " ";

      const maxTitleWidth = MAX_TITLE_WIDTH;
      const truncatedTitle =
        b.title.length > maxTitleWidth
          ? b.title.slice(0, maxTitleWidth - 1) + "…"
          : b.title;
      const bookTitle = truncatedTitle.padEnd(maxTitleWidth);

      const bar = this.progressBar(b.progress);
      const pct = color.dim + `${b.progress}%`.padStart(4) + color.reset;
      const status =
        this.view === "all"
          ? color.dim + " " + b.status.padEnd(8) + color.reset
          : "";

      const line = `${cursor} ${bookTitle} [${bar}] ${pct}${status}`;
      console.log(selected ? color.invert + line + color.reset : line);
    });

    console.log(
      `${color.dim}\n${this.index + 1}/${list.length}${this.filteredBooks ? `  filter: "${this.search}"` : ""}${color.reset}`,
    );

    if (this.mode === "input") {
      const label = this.searchMode
        ? "Search:"
        : "Enter page number or percentage";
      console.log(
        `\n${color.yellow}${label}${color.reset}${color.dim} (Esc to cancel)\n${color.reset}${color.bold}> ${color.reset}${this.input}`,
      );
    }

    if (this.mode === "confirm-delete") {
      const book = (this.filteredBooks || this.books)[this.index];
      console.log(
        `\n${color.invert}${color.yellow} DELETE BOOK? ${color.reset}`,
      );
      console.log(`${color.bold}${book.title}${color.reset}`);
      console.log(
        `${color.dim}This will physically delete the .md file.${color.reset}`,
      );
      console.log(
        `\nConfirm: [${color.green}y${color.reset}]es / [${color.yellow}n${color.reset}]o`,
      );
    }
  }

  renderCreateFlow() {
    const steps = ["Book Title", "Author", "Total Pages"];
    console.log(
      `${color.bold}${color.yellow}Add New Book${color.reset} ${color.dim}(Step ${this.createStep + 1}/3)${color.reset}\n`,
    );

    // Display error message if exists
    if (this.error) {
      console.log(
        `\x1b[41m\x1b[37m ERROR \x1b[0m ${color.yellow}${this.error}${color.reset}\n`,
      );
    }

    steps.forEach((step, i) => {
      const val =
        i === 0
          ? this.newBookData.title
          : i === 1
            ? this.newBookData.author
            : this.newBookData.pages;
      if (i < this.createStep) {
        console.log(`${color.green}✓ ${step}:${color.reset} ${val}`);
      } else if (i === this.createStep) {
        console.log(
          `${color.bold}${color.blue}❯ ${step}:${color.reset} ${this.input}_`,
        );
      } else {
        console.log(`${color.dim}  ${step}: ...${color.reset}`);
      }
    });
    console.log(`\n${color.dim}Esc to cancel, Enter to continue${color.reset}`);
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

  // Simplifies switching modes and clearing the buffer
  setMode(m) {
    this.mode = m;
    this.input = "";
    this.error = "";
  }

  handleBackOrExit() {
    if (this.filteredBooks) {
      this.filteredBooks = null;
      this.search = "";
    } else if (this.view === "all") {
      this.view = "reading";
      this.books = this.library.getReading();
    } else {
      this.exit();
    }
  }

  handleKey(key) {
    // Global exit - always works
    if (key === "\u0003") return this.exit(); // Ctrl+C

    switch (this.mode) {
      case "list":
        this.handleListNavigation(key);
        break;
      case "input":
      case "create":
        this.handleTextInput(key);
        break;
      case "confirm-delete":
        this.handleDeleteConfirmation(key);
        break;
    }
    this.render();
  }

  handleListNavigation(key) {
    const list = this.filteredBooks || this.books;
    const pageSize = Math.floor((Terminal.height() - 6) / 2); // Jump by half the visible list

    switch (key) {
      case "k":
      case "\u001b[A":
        this.index = Math.max(0, this.index - 1);
        break;
      case "j":
      case "\u001b[B":
        this.index = Math.min(list.length - 1, this.index + 1);
        break;
      case "n":
        this.setMode("create");
        this.createStep = 0;
        break;
      case "\u0004": // Ctrl+D (Scroll Down)
        this.index = Math.min(list.length - 1, this.index + pageSize);
        break;
      case "\u0015": // Ctrl+U (Scroll Up)
        this.index = Math.max(0, this.index - pageSize);
        break;
      case "G":
        this.index = list.length - 1;
        break;
      case "g":
        this.index = 0;
        break;
      case "x":
        if (list.length > 0) this.mode = "confirm-delete";
        break;
      case "a":
        this.view = "all";
        this.books = this.library.allBooks;
        this.index = 0;
        break;
      case "r":
        this.view = "reading";
        this.books = this.library.getReading();
        this.index = 0;
        break;
      case "/":
        this.searchMode = true;
        this.setMode("input");
        break;
      case "\r":
        if (list.length > 0) this.setMode("input");
        break;
      case "q":
      case "\u001b":
        this.handleBackOrExit();
        break;
    }
  }

  handleDeleteConfirmation(key) {
    const list = this.filteredBooks || this.books;
    const book = list[this.index];

    if (key.toLowerCase() === "y") {
      if (fs.existsSync(book.file)) {
        fs.unlinkSync(book.file); // Physical delete
      }
      // Update local state
      this.library.allBooks = this.library.allBooks.filter(
        (b) => b.file !== book.file,
      );
      this.books =
        this.view === "reading"
          ? this.library.getReading()
          : this.library.allBooks;
      if (this.index >= this.books.length)
        this.index = Math.max(0, this.books.length - 1);
      this.mode = "list";
    } else if (key.toLowerCase() === "n" || key === "\u001b") {
      this.mode = "list";
    }
  }

  handleTextInput(key) {
    if (key === "\r") {
      this.mode === "create" ? this.handleCreateSubmit() : this.submitInput();
      return;
    }
    if (key === "\u001b") {
      this.error = "";
      this.searchMode = false;
      this.setMode("list");
      return;
    }
    if (key === "\u007f") {
      this.input = this.input.slice(0, -1);
      if (this.searchMode) this.applySearch();
      return;
    }
    if (key.length === 1 && key >= " ") {
      this.input += key;
      if (this.searchMode) this.applySearch();
    }
  }

  handleCreateSubmit() {
    this.error = ""; // Clear errors on new attempt

    if (this.createStep === 0) {
      // Validation: Title cannot be empty
      if (!this.input.trim()) {
        this.error = "Title cannot be empty.";
        return;
      }
      this.newBookData.title = this.input;
    }

    if (this.createStep === 1) this.newBookData.author = this.input;

    if (this.createStep === 2) {
      this.newBookData.pages = this.input;
      try {
        const newBook = BookWriter.createNewBook(
          this.library.directory,
          this.newBookData,
        );
        this.library.allBooks.push(newBook);
        this.view = "reading";
        this.books = this.library.getReading();
        this.mode = "list";
        this.createStep = 0;
        this.input = "";
      } catch (e) {
        // Display error if file exists
        this.error = e.message;
        this.createStep = 0; // Reset to title step to fix the name
        this.input = "";
      }
      return;
    }
    this.createStep++;
    this.input = "";
  }

  submitInput() {
    const list = this.filteredBooks || this.books;
    const book = list[this.index];
    const pct = this.parseProgress(this.input, book.pages);

    if (pct !== null) {
      BookWriter.writeProgress(book, pct);
      book.progress = pct;
      if (pct >= 100) {
        this.books = this.books.filter((b) => b.file !== book.file);
        if (this.index >= this.books.length)
          this.index = Math.max(0, this.books.length - 1);
      }
    }
    this.mode = "list";
    this.input = "";
  }

  applySearch() {
    const list = this.books;
    if (!this.search) {
      this.filteredBooks = null;
      return;
    }
    this.filteredBooks = list.filter((b) =>
      b.title.toLowerCase().includes(this.search),
    );
    this.index = 0;
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
    const ui = new TerminalUI(this.library);
    ui.start();
  }
}

new BooklogApp().run();
