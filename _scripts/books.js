import fs from "fs";
import fetch from "node-fetch";

export class BookScraper {
  constructor() {
    this.apiUrl = "https://books.javier.computer/api/books";
    this.outputFile = "_data/books.json";
    this.lastUpdateDate = this.getLastUpdateDate();
  }

  getLastUpdateDate() {
    if (fs.existsSync(this.outputFile)) {
      const data = JSON.parse(fs.readFileSync(this.outputFile, "utf8"));
      return new Date(data.updated_at);
    }
    return new Date(0); // Return earliest possible date if file doesn't exist
  }

  async loadSpinner() {
    const ora = (await import("ora")).default;
    this.spinner = ora({ text: "Loading…", spinner: "dots" });
  }

  async fetchBooks() {
    const response = await fetch(this.apiUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }

  getPrettyDate(date) {
    if (!date) return "";
    const d = new Date(date);
    return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}`;
  }

  createMarkdownFile(book) {
    const {
      title,
      subtitle,
      description,
      author,
      started_at,
      finished_at,
      status,
      rating,
      cover,
      pages,
      color,
      slug,
      link,
    } = book;

    const mdContent = `---
title: "${title}"
subtitle: "${subtitle || ""}"
description: "${description || ""}"
layout: book
author: ${author}
started: ${started_at ? this.getPrettyDate(started_at) : ""}
read: ${finished_at ? this.getPrettyDate(finished_at) : ""}
status: ${status}
rating: ${rating || 0}
color: ${color || ""}
cover: ${cover || ""}
pages: ${pages || ""}
link: ${link || ""}
---`;

    const fileName = `${slug}.md`;
    const dir = "content/_books/";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(dir + fileName, mdContent);
  }

  async run() {
    await this.loadSpinner();
    this.spinner.start("Getting books");

    try {
      const books = await this.fetchBooks();
      const currentDate = new Date();

      // Filter books that have been updated since last check
      const updatedBooks = books.filter((book) => {
        const bookUpdateDate = new Date(book.updated_at);
        return bookUpdateDate > this.lastUpdateDate;
      });

      if (updatedBooks.length > 0) {
        // Read existing data
        const existingData = fs.existsSync(this.outputFile)
          ? JSON.parse(fs.readFileSync(this.outputFile, "utf8"))
          : { books: [] };

        // Create a map of existing books by ID for easy lookup
        const existingBooksMap = new Map(
          existingData.books.map((book) => [book.id, book]),
        );

        // Update or add new books
        updatedBooks.forEach((book) => {
          if (existingBooksMap.has(book.id)) {
            // Update existing book
            const index = existingData.books.findIndex((b) => b.id === book.id);
            existingData.books[index] = book;
          } else {
            // Add new book
            existingData.books.push(book);
          }
          // Create or update markdown file
          this.createMarkdownFile(book);
        });

        // Update the JSON file
        const outputData = {
          updated_at: currentDate.toISOString().split("T")[0],
          count: existingData.books.length,
          books: existingData.books,
        };

        fs.writeFileSync(this.outputFile, JSON.stringify(outputData, null, 2));

        this.spinner.succeed(
          `Updated/Added books: ${updatedBooks.length}. Total books: ${existingData.books.length}`,
        );
      } else {
        this.spinner.succeed("No books to update.");
      }
    } catch (error) {
      this.spinner.fail(`Error getting books: ${error}`);
    }
  }
}

new BookScraper().run();
