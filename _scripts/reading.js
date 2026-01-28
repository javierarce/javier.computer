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
const STATUS_UNREAD = "unread";
const STATUS_READ = "read";
const STATUS_READING = "reading";

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
    this.displayProgress = progress || 0; // The value used for rendering
    this.status = status || STATUS_UNREAD;
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
            status: data.status || STATUS_UNREAD,
            started: data.started,
          }),
        );
      }
    }
    return this.allBooks;
  }

  getReading() {
    return this.allBooks.filter((b) => b.status === STATUS_READING);
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

    if (newProgress <= 0) {
      // If reset to 0, return to unread state
      parsed.data.status = STATUS_UNREAD; // Use the constant "unread"
      parsed.data.started = null;
      parsed.data.read = null;
    } else if (newProgress >= 100) {
      // If finished
      parsed.data.status = STATUS_READ;
      parsed.data.read = BookWriter.today();
    } else {
      // If anywhere between 1 and 99
      parsed.data.status = STATUS_READING;
      // Only set started date if it's not already there
      if (!parsed.data.started) {
        parsed.data.started = BookWriter.today();
      }
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
    const height = Math.max(1, Terminal.height() - 8);
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
      this.renderStatusBar();
      return;
    }

    const title = this.view === "reading" ? "Reading" : "Library";
    console.log(`${color.bold}${color.blue}${title}${color.reset}\n`);

    const visible = this.getVisibleBooks();
    if (visible.length === 0) {
      console.log(`\n   ${color.gray}No matches found...${color.reset}`);

      const emptyLines = Math.max(0, Terminal.height() - 8);
      for (let i = 0; i < emptyLines; i++) console.log("");
    } else {
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

        const bar = this.progressBar(b.displayProgress);
        const pct =
          color.dim +
          `${Math.round(b.displayProgress)}%`.padStart(4) +
          color.reset;
        const status =
          this.view === "all"
            ? color.dim + " " + b.status.padEnd(8) + color.reset
            : "";

        const line = `${cursor} ${bookTitle} [${bar}] ${pct}${status}`;
        console.log(selected ? color.invert + line + color.reset : line);
      });
    }

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

    this.renderStatusBar();
  }

  animateProgress(book, targetPct) {
    const duration = 500; // Animation length in ms
    const frameRate = 30; // Frames per second
    const totalFrames = (duration / 1000) * frameRate;
    const increment = (targetPct - book.displayProgress) / totalFrames;

    let frame = 0;
    const interval = setInterval(() => {
      frame++;
      book.displayProgress += increment;

      // Final frame cleanup
      if (frame >= totalFrames) {
        book.displayProgress = targetPct;
        clearInterval(interval);

        // If in reading view and book is finished/reset, refresh list after animation
        if (this.view === "reading" && (targetPct >= 100 || targetPct <= 0)) {
          this.books = this.library.getReading();
          this.index = Math.max(0, Math.min(this.index, this.books.length - 1));
        }
      }
      this.render();
    }, 1000 / frameRate);
  }
  renderStatusBar() {
    const height = Terminal.height();
    const width = process.stdout.columns || 80;

    // 1. Prepare the Left Side (Counter)
    const list = this.filteredBooks || this.books;
    const counter = `${this.index + 1}/${list.length}${this.filteredBooks ? ` (filter: "${this.search}")` : ""}`;

    // 2. Prepare the Right Side (Hints)
    const hints = "[j/k] move [e] edit [n] new [a] all [Esc] quit";

    // 3. Calculate Padding
    // We subtract the lengths of our strings from total width to find the gap
    const paddingSize = Math.max(0, width - counter.length - hints.length);
    const padding = " ".repeat(paddingSize);

    // 4. Construct the full line
    const bar = `${color.dim}${counter}${padding}${hints}${color.reset}`;

    // 5. Write to the very last line (row = height)
    process.stdout.write(`\x1b[${height};1H${bar}`);

    // 6. Handle Cursor Placement for Input Mode
    if (this.mode === "input") {
      const inputRow = height - 1; // Input field is usually one line above the status bar
      const cursorCol = 3 + this.input.length;
      process.stdout.write(`\x1b[${inputRow};${cursorCol}H`);
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
    if (this.searchMode || this.filteredBooks) {
      this.filteredBooks = null;
      this.search = "";
      this.input = "";
      this.searchMode = false;
    } else if (this.view === "all") {
      this.view = "reading";
      this.books = this.library.getReading();
    } else {
      this.exit();
    }
  }

  handleKey(key) {
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
    const hasBooks = list.length > 0; // Helper flag

    switch (key) {
      case "k":
      case "\u001b[A": // Up Arrow
        this.index = Math.max(0, this.index - 1);
        break;
      case "j":
      case "\u001b[B": // Down Arrow
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
      case "a":
        this.view = "all";
        this.books = this.library.allBooks;
        this.filteredBooks = null; // Clear existing search results
        this.search = "";
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
        this.applySearch();
        break;
      case "e":
      case "\r":
        if (hasBooks) this.setMode("input"); // Only allow edit if book exists
        break;
      case "x":
        if (hasBooks) this.mode = "confirm-delete";
        break;
      case "q":
      case "\u001b": // Escape
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
    // 1. Handle Enter
    if (key === "\r") {
      if (this.searchMode) {
        this.searchMode = false;
        this.mode = "list";
      } else {
        this.mode === "create" ? this.handleCreateSubmit() : this.submitInput();
      }
      return;
    }

    // 2. Handle Escape OR 'q' (but only when not searching or creating)
    // This ensures 'q' quits the edit screen immediately without being typed.
    const isEditingProgress = this.mode === "input" && !this.searchMode;
    if (key === "\u001b" || (key === "q" && isEditingProgress)) {
      this.error = "";
      this.searchMode = false;
      this.search = "";
      this.filteredBooks = null;
      this.setMode("list");
      return;
    }

    // 3. Handle Backspace
    if (key === "\u007f") {
      this.input = this.input.slice(0, -1);
      if (this.searchMode) {
        this.search = this.input.toLowerCase();
        this.applySearch();
      }
      return;
    }

    // 4. Handle Character Input
    if (key.length === 1 && key >= " ") {
      this.input += key;
      if (this.searchMode) {
        this.search = this.input.toLowerCase();
        this.applySearch();
      }
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
      // 1. Logic updates
      if (pct <= 0) {
        book.status = STATUS_UNREAD; // Changed from null for consistency
      } else if (pct >= 100) {
        book.status = STATUS_READ;
      } else {
        book.status = STATUS_READING;
      }

      // 2. Persist to file
      BookWriter.writeProgress(book, pct);
      book.progress = pct;

      // 3. IMMEDIATELY refresh the list if we are in reading view
      // This ensures if a book becomes 'read' or 'unread', it vanishes from the list
      if (this.view === "reading") {
        this.books = this.library.getReading();
        // Adjust index so it doesn't go out of bounds
        this.index = Math.max(0, Math.min(this.index, this.books.length - 1));
      }

      // 4. Trigger the animation
      this.animateProgress(book, pct);
    }

    this.mode = "list";
    this.input = "";
  }

  applySearch() {
    const list = this.library.allBooks;

    // If search is empty, show everything instead of null
    if (!this.search) {
      this.filteredBooks = [...list];
    } else {
      this.filteredBooks = list.filter(
        (b) =>
          b.title.toLowerCase().includes(this.search) ||
          b.author.toLowerCase().includes(this.search),
      );
    }

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
