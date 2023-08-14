const fs = require('fs')
const fetch = require('node-fetch')
const { parse } = require('node-html-parser')

const OUTPUT_FILE = '_data/movies.json'

if (process.argv.length < 3) {
  console.error('Error: Please provide a username.')
  process.exit(1)
}

const USERNAME = process.argv[2]
const URL = `https://letterboxd.com/${USERNAME}/films/diary/page/`

async function fetchPage(pageNumber) {
  const response = await fetch(URL + pageNumber)
  const text = await response.text()
  return parse(text)
}

async function getTotalPages(root) {
  const pagination = root.querySelector('.paginate-pages')
  if (!pagination) return 1

  const lastPageLink = pagination.querySelectorAll('li a').pop()
  return lastPageLink ? parseInt(lastPageLink.innerText.trim(), 10) : 1
}

async function scrapeMovies() {
  const root = await fetchPage(1)
  const totalPages = await getTotalPages(root)
  const movies = []

  for (let i = 1; i <= totalPages; i++) {
    const pageRoot = await fetchPage(i)
    const filmEntries = pageRoot.querySelectorAll('.diary-entry-row')

    filmEntries.forEach(entry => {
      const metadataElem = entry.querySelector('.edit-review-button')

      const watchedOn = metadataElem.getAttribute('data-viewing-date')
      const filmTitle = metadataElem.getAttribute('data-film-name')
      const rewatched = metadataElem.getAttribute('data-rewatch') === 'true'
      const year = metadataElem.getAttribute('data-film-year')
      const title = `${filmTitle} (${year})`
      const rating = parseInt(metadataElem.getAttribute('data-rating'), 10) / 2
      const fullStars = '★'.repeat(Math.floor(rating))
      const halfStar = (rating - Math.floor(rating) >= 0.5) ? '½' : ''

      const stars = fullStars + halfStar
      console.log(`${title} - ${stars} stars`)
      movies.push({ watched_on: watchedOn, title, rating, stars, rewatched })
    })
  }

  return movies
}

scrapeMovies().then(movies => {
  const updated_at = new Date().toISOString().split('T')[0] 
  const outputData = {
    updated_at,
    count: movies.length,
    movies
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(outputData, null, 2))

  console.log(`Total movies: ${movies.length}`)
}).catch(error => {
  console.error('Error scraping movies:', error)
})
