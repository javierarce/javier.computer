const MovieScraper = require('./movies.js')
const Subscribers = require('./subscribers.js')

const username = 'javier'
const scraper = new MovieScraper(username)
scraper.run()

const subscribers = new Subscribers(username)
subscribers.run()
