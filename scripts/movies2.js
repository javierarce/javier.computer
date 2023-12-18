const fs = require('fs');
const fetch = require('node-fetch');
const { parse } = require('node-html-parser');
const https = require('https');

const OUTPUT_FILE = '_data/movies3.json';
const TMDB_API_KEY = process.env.TMDB_API_KEY; // Get the API key from the environment variable

if (!TMDB_API_KEY) {
  console.error('Error: TMDB_API_KEY is not set.');
  process.exit(1);
}

if (process.argv.length < 3) {
  console.error('Error: Please provide a username.');
  process.exit(1);
}

const USERNAME = process.argv[2];
const URL = `https://letterboxd.com/${USERNAME}/films/diary/page/`;

function readLastMovie() {
  if (fs.existsSync(OUTPUT_FILE)) {
    const data = JSON.parse(fs.readFileSync(OUTPUT_FILE));
    if (data.movies && data.movies.length > 0) {
      return data.movies[0]; // Get the first movie, assuming it's the latest
    }
  }
  return null;
}

const lastMovie = readLastMovie();

async function fetchPage(pageNumber) {
  const response = await fetch(URL + pageNumber);
  const text = await response.text();
  return parse(text);
}

async function fetchFilmPage(permalink) {
  const response = await fetch(`https://letterboxd.com/film/${permalink}`);
  const text = await response.text();
  const root = parse(text);
  const bodyTag = root.querySelector('body');
  return bodyTag.getAttribute('data-tmdb-id');
}

async function fetchPoster(tmdbId) {
  const url = `https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${TMDB_API_KEY}&language=en-US`;
  const response = await fetch(url);
  const json = await response.json();
  return json.poster_path;
}

async function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(filepath);
      reject(err);
    });
  });
}

async function getTotalPages(root) {
  const pagination = root.querySelector('.paginate-pages');
  if (!pagination) return 1;

  const lastPageLink = pagination.querySelectorAll('li a').pop();
  return lastPageLink ? parseInt(lastPageLink.innerText.trim(), 10) : 1;
}

async function scrapeMovies() {
  const root = await fetchPage(1);
  const totalPages = await getTotalPages(root);
  const newMovies = [];
  let lastProcessed = false;

  for (let i = 1; i <= totalPages && !lastProcessed; i++) {
    const pageRoot = await fetchPage(i);
    const filmEntries = pageRoot.querySelectorAll('.diary-entry-row');

    for (const entry of filmEntries) {
      const metadataElem = entry.querySelector('.edit-review-button');
      const td = entry.querySelector('.film-actions');

      const permalink = td.getAttribute('data-film-slug');
      const tmdbId = await fetchFilmPage(permalink); // Fetch the TMDB id
      const posterPath = await fetchPoster(tmdbId); // Fetch the poster path
      const posterUrl = `https://image.tmdb.org/t/p/original${posterPath}`;
      const posterFilePath = `./assets/${tmdbId}.jpg`; // Path where you want to save the poster
      await downloadImage(posterUrl, posterFilePath); // Download the poster

      const watchedOn = metadataElem.getAttribute('data-viewing-date');
      const filmTitle = metadataElem.getAttribute('data-film-name');
      const rewatched = metadataElem.getAttribute('data-rewatch') === 'true';
      const year = metadataElem.getAttribute('data-film-year');
      const title = `${filmTitle} (${year})`;
      const rating = parseInt(metadataElem.getAttribute('data-rating'), 10) / 2;
      const fullStars = '★'.repeat(Math.floor(rating));
      const halfStar = (rating - Math.floor(rating) >= 0.5) ? '½' : '';
      const stars = fullStars + halfStar;

      console.log('Processing:', title, posterFilePath);

      if (lastMovie && watchedOn === lastMovie.watched_on && title === lastMovie.title) {
        lastProcessed = true;
        console.log('Last movie processed:', title);
        break;
      }

      newMovies.push({ watched_on: watchedOn, title, rating, stars, rewatched, permalink, tmdbId, posterFilePath });
    }
  }

  return newMovies;
}

scrapeMovies().then(newMovies => {
  const existingData = fs.existsSync(OUTPUT_FILE) ? JSON.parse(fs.readFileSync(OUTPUT_FILE)) : { movies: [] };
  const updated_at = new Date().toISOString().split('T')[0];
  const outputData = {
    updated_at,
    count: existingData.movies.length + newMovies.length,
    movies: [...newMovies, ...existingData.movies] // New movies are added to the top
  };

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(outputData, null, 2));

  console.log(`Total movies: ${outputData.count}`);
}).catch(error => {
  console.error('Error scraping movies:', error);
});
