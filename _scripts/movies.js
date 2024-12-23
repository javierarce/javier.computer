import fs from "fs";
import fetch from "node-fetch";
import { XMLParser } from "fast-xml-parser";

export class MovieRSSParser {
  constructor(username) {
    if (!username) {
      console.error("Error: Please provide a username.");
      process.exit(1);
    }

    this.username = username;
    this.feedUrl = `https://letterboxd.com/${this.username}/rss/`;
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

  async fetchFeed() {
    const response = await fetch(this.feedUrl);
    const text = await response.text();
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_",
    });
    return parser.parse(text);
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

  getRatingStars(rating) {
    const fullStars = "★".repeat(Math.floor(rating));
    const halfStar = rating % 1 >= 0.5 ? "½" : "";
    return fullStars + halfStar;
  }

  async parseMovies(existingData) {
    const feed = await this.fetchFeed();
    const movies = [];

    // Only process items that are movies (not lists)
    const movieEntries = feed.rss.channel.item.filter(
      (item) => item["letterboxd:filmTitle"] && item["letterboxd:filmYear"],
    );

    for (const entry of movieEntries) {
      const permalink = entry.link.split("/film/")[1].replace(/\/$/, "");

      // Check if movie already exists
      const doesMovieExist = existingData.movies.some(
        (movie) => movie.permalink === permalink,
      );

      if (!doesMovieExist) {
        const rating = entry["letterboxd:memberRating"]
          ? parseFloat(entry["letterboxd:memberRating"])
          : null;

        const movie = {
          watched_on: entry["letterboxd:watchedDate"],
          title: entry["letterboxd:filmTitle"],
          year: parseInt(entry["letterboxd:filmYear"]),
          rating,
          liked: entry["letterboxd:memberRating"] >= 4.0, // Consider 4+ stars as "liked"
          stars: rating ? this.getRatingStars(rating) : "",
          rewatched: entry["letterboxd:rewatch"] === "Yes",
          permalink,
        };

        movies.push(movie);
      }
    }

    return movies;
  }

  async run() {
    await this.loadSpinner();
    this.spinner.start("Getting new movies from RSS feed");
    try {
      const existingData = fs.existsSync(this.outputFile)
        ? JSON.parse(fs.readFileSync(this.outputFile, "utf8"))
        : { movies: [] };

      const newMovies = await this.parseMovies(existingData);

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
