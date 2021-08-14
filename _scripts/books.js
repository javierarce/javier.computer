const fs = require('fs')
const csv = require('csv-parser')

const TEMPLATE = `---
title: "TITLE"
layout: book
---
CONTENT
`

const string_to_slug = (str) => {
  str = str.replace(/^\s+|\s+$/g, ''); // trim
  str = str.toLowerCase()

  // remove accents, swap ñ for n, etc
  let from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;"
  let to   = "aaaaeeeeiiiioooouuuunc------"

  for (let i=0, l=from.length ; i<l ; i++) {
    str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i))
  }

  str = str.replace(/[^a-z0-9 -]/g, '') 
    .replace(/\s+/g, '-') 
    .replace(/-+/g, '-')

  return str
}

const createFile = (title, books) => {

  let content = '| Title | Added | Read |\n'
    content += '|:-------|:-----|:-----|\n'

  books.forEach((book) => {
    let stars = ''

    for (let i = 0, len = book['my rating']; i < len; i++) {
      stars += "☆"
    }

    let publisher = book['publisher'] ? book['publisher'].trim() : 'Unknown'

    content += `|**${book.title}**| ${book['date added']} | ${book['date read']}|\n`

  })

  let fileContent = TEMPLATE.replace('TITLE', title).replace('CONTENT', content)
  let path = `content/_books/${string_to_slug(title)}.md`

  fs.writeFile(path, fileContent, err => {
    if (err) {
      console.error(err)
      return
    }
  })
}

let toRead = []
let books = []

fs.createReadStream('_data/goodreads_library_export.csv')
  .pipe(csv())
  .on('data', (data) => {
    if (data['bookshelves'] === 'to-read') {
      toRead.push(data)
    } else {
      books.push(data)
    }
  })
  .on('end', () => {
    //createFile('Antilibrary', toRead)
    createFile('Read2', books)
  })
