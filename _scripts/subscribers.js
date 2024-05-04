const fs = require('fs')
const fetch = require('node-fetch')
const { parse } = require('node-html-parser')

const OUTPUT_FILE = '_data/subscribers.json'

const URL = 'https://api.javier.computer/api/subscribers'

class Subscribers {
  constructor() {
  }

  async loadSpinner() {
    const ora = (await import('ora')).default
    this.spinner = ora({ text: 'Loading…', spinner: 'dots' })
  }

  run = async () => {
    await this.loadSpinner()
    this.spinner.start('Getting subscribers')

    const response = await fetch(URL)
    const count = await response.json()
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(count, null, 2))
    this.spinner.succeed(`Total subscribers: ${count}`)
  }

}

module.exports = Subscribers
