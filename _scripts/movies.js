import fs from "fs";
import fetch from "node-fetch";
import { parse } from "node-html-parser";

export class MovieScraper {
  constructor(username) {
    if (!username) {
      console.error("Error: Please provide a username.");
      process.exit(1);
    }

    this.username = username;
    this.baseUrl = `https://letterboxd.com/${this.username}/films/diary/page/`;
    this.outputFile = "_data/movies.json";
    this.lastUpdatedAt = this.getLastUpdatedAt();
  }

  getLastUpdatedAt() {
    if (fs.existsSync(this.outputFile)) {
      const data = JSON.parse(fs.readFileSync(this.outputFile, "utf8"));
      return new Date(data.updated_at);
    }
    return new Date(0);
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
    const {
      title,
      year,
      rating,
      stars,
      liked,
      rewatched,
      permalink,
      watched_on,
    } = movie;
    const mdContent = `---
title: "${title}"
year: ${year}
rating: ${rating}
stars: "${stars}"
liked: ${liked}
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

  extractDateFromLink(entry) {
    const dateTd = entry.querySelector("td.td-day.diary-day a");

    if (!dateTd) {
      console.log("HTML structure for debugging:", entry.toString());
      return null;
    }

    const href = dateTd.getAttribute("href");
    const matches = href.match(/\/(\d{4})\/(\d{2})\/(\d{2})\/?$/);

    if (matches) {
      const [_, year, month, day] = matches;
      return `${year}-${month}-${day}`;
    }

    console.log("Could not parse date from href:", href);
    return null;
  }

  async scrapeMovies(existingData) {
    const root = await this.fetchPage(1);
    const totalPages = await this.getTotalPages(root);
    const movies = [];
    let shouldContinue = true;

    for (let i = 1; i <= totalPages && shouldContinue; i++) {
      const pageRoot = await this.fetchPage(i);
      const filmEntries = pageRoot.querySelectorAll(".diary-entry-row");

      for (const entry of filmEntries) {
        const metadataElem = entry.querySelector(".edit-review-button");
        const td = entry.querySelector(".film-actions");
        const watchedOn = this.extractDateFromLink(entry);

        if (!watchedOn) {
          console.warn("Could not extract date for entry, skipping...");
          continue;
        }

        const permalink = td.getAttribute("data-film-slug");

        const doesMovieExist = existingData.movies.some(
          (movie) => movie.permalink === permalink,
        );

        const filmTitle = metadataElem.getAttribute("data-film-name");
        const rewatched = metadataElem.getAttribute("data-rewatch") === "true";
        const year = metadataElem.getAttribute("data-film-year");
        const title = `${filmTitle}`;
        const rating =
          parseInt(metadataElem.getAttribute("data-rating"), 10) / 2;
        const fullStars = "★".repeat(Math.floor(rating));
        const halfStar = rating - Math.floor(rating) >= 0.5 ? "½" : "";
        const liked = metadataElem.getAttribute("data-liked");

        const stars = fullStars + halfStar;

        if (!doesMovieExist) {
          movies.push({
            watched_on: watchedOn,
            title,
            year,
            rating,
            liked,
            stars,
            rewatched,
            permalink,
          });
        }
      }
      if (!shouldContinue) break;
    }

    return movies;
  }

  async run() {
    await this.loadSpinner();
    this.spinner.start("Getting new movies");
    try {
      const existingData = fs.existsSync(this.outputFile)
        ? JSON.parse(fs.readFileSync(this.outputFile, "utf8"))
        : { movies: [] };

      const newMovies = await this.scrapeMovies(existingData);

      if (newMovies.length > 0) {
        const updatedMovies = [...newMovies, ...existingData.movies];
        const updated_at = new Date().toISOString().split("T")[0];
        const outputData = {
          updated_at,
          count: updatedMovies.length,
          movies: updatedMovies,
        };

        newMovies.forEach((movie) => this.createMarkdownFile(movie));
        fs.writeFileSync(this.outputFile, JSON.stringify(outputData, null, 2));
        this.spinner.succeed(
          `New movies added: ${newMovies.length}. Total movies: ${updatedMovies.length}`,
        );
      } else {
        this.spinner.succeed("No new movies to add.");
      }
    } catch (error) {
      this.spinner.fail(`Error getting movies: ${error}`);
    }
  }
}
