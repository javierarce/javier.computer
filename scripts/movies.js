const fs = require('fs')
const https = require('https')
const feed = require('rss-to-json')

const URL = 'https://letterboxd.com/javier/rss'

const getPathForMoviePermalink = (permalink) => {
  return `./images/movies/${permalink}.jpg`
}

const downloadImage = (URL, permalink) => {
  const request = https.get(URL, (response) => {

    console.log(`Downloading cover for ${permalink}`)

    const path = getPathForMoviePermalink(permalink)
    const file = fs.createWriteStream(path)

    response.pipe(file)
  })
}

const getPermalinkFromURL = (URL) => {
  console.log(URL)
  return /http.*\/.*?film\/(.*?)\//.exec(URL)[1]
}

const getSRCFromString = (string) => {
  return /<img.*?src=.(.*?)\?/.exec(string)[1]
}

const downloadMovie = (movie) => {
  const permalink = getPermalinkFromURL(movie.link)
  const src = getSRCFromString(movie.description)
  const path = getPathForMoviePermalink(permalink)

  fs.appendFile('movies.txt', permalink + '\n', (err) => {
    if (err) {
      throw err
    }
    // console.log(`Saved: ${permalink}`)
  })

  if (!fs.existsSync(path)) {
    downloadImage(src, permalink)
  }
}

const onLoadFeed = (error, rss) => {
  if (!error) {
    const feed = JSON.parse(JSON.stringify(rss, null, 3))
    feed.items.forEach(downloadMovie)
  } else {
    console.error(error)
  }
}

feed.load(URL, onLoadFeed)
