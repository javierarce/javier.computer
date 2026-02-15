require('dotenv').config()

const fs = require('fs')
const md5 = require('md5')
const path = require('path')
const Extractor = require('figma-extractor')

const IMAGE_PATH = 'img/drawings/'

const FIGMA_TOKEN = process.env.FIGMA_TOKEN
const FIGMA_FILE = process.env.FIGMA_FILE

const OPTIONS = {
  format: 'png',
  use_pages_as_folders: true,
  get_background_color: true,
  get_comments: true
}

const extractor = new Extractor(FIGMA_TOKEN, FIGMA_FILE, OPTIONS)

extractor.extract(IMAGE_PATH).then((files) => {
  const data = JSON.stringify({ md5: md5(files), path: IMAGE_PATH, files })
  console.log(data)
}).catch((e) => {
  console.error(e)
})
