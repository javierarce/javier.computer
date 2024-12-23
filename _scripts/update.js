import { MovieRSSParser } from "./movies.js";
import { Subscribers } from "./subscribers.js";
import { Books } from "./books.js";

const username = "javier";
const scraper = new MovieRSSParser(username);
scraper.run();

const subscribers = new Subscribers(username);
subscribers.run();

const books = new Books();
books.run();
