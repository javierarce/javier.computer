const fs = require('fs')
const fetch = require('node-fetch')
const { parse } = require('node-html-parser')

const OUTPUT_FILE = '_data/subscribers.json'

const URL = 'https://api.javier.computer/api/subscribers'

async function getSubscribersCount() {
  const response = await fetch(URL)
  const count = await response.json()
  console.log(count)
  console.log(`Total subscribers: ${count}`)
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(count, null, 2))
}

getSubscribersCount()
