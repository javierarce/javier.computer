const https = require('https')
const fs = require('fs');
let feed = require('rss-to-json')

let URL = 'https://letterboxd.com/javier/rss'

const saveJSON = (data) => {
  fs.writeFileSync('./data/movies.json', JSON.stringify(data))
}

const downloadImage = (URL, name) => {
  const request = https.get(URL, (response) => {
    let file = fs.createWriteStream(`./images/movies/${name}.jpg`)
    response.pipe(file)
  })
}

const getPermalinkFromURL = (URL) => {
  return /http.*\/(.*?)\//.exec(URL)[1]
}

const getSRCFromString = (string) => {
  return /<img.*?src=.(.*?)\?/.exec(string)[1]
}

feed.load(URL, (error, rss) => {
  let data = JSON.parse(JSON.stringify(rss, null, 3))
  let movies = data.items

  let result = []

  movies.forEach((movie) => {
    let title = movie.title
    let permalink = getPermalinkFromURL(movie.link)
    let src = getSRCFromString(movie.description)

    downloadImage(src, permalink)

    result.push({ title, permalink })
  })

  saveJSON(result)
})
