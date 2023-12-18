const fs = require('fs');
const fetch = require('node-fetch');
const https = require('https');

const TMDB_API_KEY = process.env.TMDB_API_KEY; // API key from the environment variable

if (!TMDB_API_KEY) {
  console.error('Error: TMDB_API_KEY is not set.');
  process.exit(1);
}

const tmdbId = process.argv[2]; // TMDB ID provided as a command-line argument

if (!tmdbId) {
  console.error('Error: Please provide a TMDB ID.');
  process.exit(1);
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

async function downloadMoviePoster(tmdbId) {
  try {
    const posterPath = await fetchPoster(tmdbId);
    const posterUrl = `https://image.tmdb.org/t/p/original${posterPath}`;
    const posterFilePath = `./assets/${tmdbId}.jpg`;

    console.log(`Downloading poster for TMDB ID ${tmdbId}`);
    await downloadImage(posterUrl, posterFilePath);
    console.log(`Poster downloaded successfully to ${posterFilePath}`);
  } catch (error) {
    console.error('Error downloading movie poster:', error);
  }
}

downloadMoviePoster(tmdbId);
