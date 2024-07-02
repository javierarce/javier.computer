const fs = require("fs");
const fetch = require("node-fetch");
const { parse } = require("node-html-parser");

class MovieScraper {
  constructor(username) {
    if (!username) {
      console.error("Error: Please provide a username.");
      process.exit(1);
    }

    this.username = username;
    this.baseUrl = `https://letterboxd.com/${this.username}/films/diary/page/`;
    this.outputFile = "_data/movies.json";
  }

  async loadSpinner() {
    const ora = (await import("ora")).default;
    this.spinner = ora({ text: "Loading…", spinner: "dots" });
  }

  async fetchPage(pageNumber) {
    const response = await fetch(this.baseUrl + pageNumber);
    const text = await response.text();
    return parse(text);
  }

  async getTotalPages(root) {
    const pagination = root.querySelector(".paginate-pages");
    if (!pagination) return 1;

    const lastPageLink = pagination.querySelectorAll("li a").pop();
    return lastPageLink ? parseInt(lastPageLink.innerText.trim(), 10) : 1;
  }

  createMarkdownFile(movie) {
    const { title, year, rating, stars, rewatched, permalink, watched_on } =
      movie;
    const mdContent = `---
title: "${title}"
year: ${year}
rating: ${rating}
stars: "${stars}"
rewatched: ${rewatched}
permalink: "${permalink}"
watched_on: ${watched_on}
---`;

    const safePermalink = isNaN(permalink) ? permalink : `${permalink}-movie`;
    const fileName = `${safePermalink}.md`;

    const dir = "content/_movies/";

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(dir + fileName, mdContent);
  }

  async scrapeMovies() {
    const root = await this.fetchPage(1);
    const totalPages = await this.getTotalPages(root);
    const movies = [];

    for (let i = 1; i <= totalPages; i++) {
      const pageRoot = await this.fetchPage(i);
      const filmEntries = pageRoot.querySelectorAll(".diary-entry-row");

      filmEntries.forEach((entry) => {
        const metadataElem = entry.querySelector(".edit-review-button");
        const td = entry.querySelector(".film-actions");

        const permalink = td.getAttribute("data-film-slug");
        const watchedOn = metadataElem.getAttribute("data-viewing-date");
        const filmTitle = metadataElem.getAttribute("data-film-name");
        const rewatched = metadataElem.getAttribute("data-rewatch") === "true";
        const year = metadataElem.getAttribute("data-film-year");
        const title = `${filmTitle}`;
        const rating =
          parseInt(metadataElem.getAttribute("data-rating"), 10) / 2;
        const fullStars = "★".repeat(Math.floor(rating));
        const halfStar = rating - Math.floor(rating) >= 0.5 ? "½" : "";

        const stars = fullStars + halfStar;
        movies.push({
          watched_on: watchedOn,
          title,
          year,
          rating,
          stars,
          rewatched,
          permalink,
        });
      });
    }

    return movies;
  }

  async run() {
    await this.loadSpinner();
    this.spinner.start("Getting movies");

    try {
      const movies = await this.scrapeMovies();
      const updated_at = new Date().toISOString().split("T")[0];
      const outputData = {
        updated_at,
        count: movies.length,
        movies,
      };

      movies.forEach((movie) => this.createMarkdownFile(movie));
      fs.writeFileSync(this.outputFile, JSON.stringify(outputData, null, 2));
      this.spinner.succeed(`Total movies: ${movies.length}`);
    } catch (error) {
      this.spinner.fail("Error getting movies");
    }
  }
}

module.exports = MovieScraper;
