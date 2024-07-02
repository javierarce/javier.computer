const fs = require("fs");
const csv = require("csv-parser");

const stringToSlug = (str) => {
  str = str.trim().toLowerCase();
  const from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
  const to = "aaaaeeeeiiiioooouuuunc------";

  for (let i = 0, l = from.length; i < l; i++) {
    str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
  }

  str = str
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

  return str;
};

const ratingToStars = (rating) => {
  const numRating = parseInt(rating, 10);
  return "★".repeat(numRating) + "☆".repeat(5 - numRating);
};

const createFile = (title, books) => {
  let content = `---
title: "TITLE"
layout: book
author: AUTHOR
started: STARTED_DATE
read: READ_DATE
status: STATUS
rating: "RATING_STARS"
cover: 
pages: PAGES
---
`;

  books.forEach((book) => {
    const fileContent = content
      .replace("TITLE", book["title"])
      .replace("AUTHOR", book["author"])
      .replace("STARTED_DATE", book["date added"] || "")
      .replace("READ_DATE", book["date read"] || "")
      .replace("STATUS", book["date read"] ? "read" : "to-read")
      .replace("RATING_STARS", ratingToStars(book["my rating"]))
      .replace("PAGES", book["number of pages"]);

    let path = `content/_books/${stringToSlug(book["title"])}.md`;

    fs.writeFile(path, fileContent, (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log(`File written: ${path}`);
    });
  });
};

let books = [];

fs.createReadStream("_data/goodreads_library_export.csv")
  .pipe(csv())
  .on("data", (data) => {
    if (data["exclusive shelf"] === "read") {
      // Ensure we're checking the correct field
      books.push(data);
    }
  })
  .on("end", () => {
    createFile("Read Books", books); // Change title as needed
  });
