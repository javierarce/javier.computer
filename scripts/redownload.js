const fs = require('fs');
const fetch = require('node-fetch');
const https = require('https');

const JSON_FILE = '_data/movies3.json'; // Path to your JSON file
const TMDB_API_KEY = process.env.TMDB_API_KEY; // TMDB API key from the environment variable

if (!TMDB_API_KEY) {
  console.error('Error: TMDB_API_KEY is not set.');
  process.exit(1);
}

if (!fs.existsSync(JSON_FILE)) {
  console.error(`Error: JSON file ${JSON_FILE} does not exist.`);
  process.exit(1);
}

const moviesData = JSON.parse(fs.readFileSync(JSON_FILE));
const movies = moviesData.movies;

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

function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

async function downloadAllPosters() {
  for (const movie of movies) {
    try {
      const posterPath = await fetchPoster(movie.tmdbId);
      const posterUrl = `https://image.tmdb.org/t/p/original${posterPath}`;
      const posterFilePath = `./assets/${movie.tmdbId}.jpg`;

      console.log(`Downloading poster for ${movie.title} (TMDB ID: ${movie.tmdbId})`);
      await downloadImage(posterUrl, posterFilePath);
      console.log(`Poster downloaded successfully to ${posterFilePath}`);

      await delay(1000); // Wait for 1 second before the next request
    } catch (error) {
      console.error(`Error downloading poster for ${movie.title}:`, error);
    }
  }
}

downloadAllPosters();
