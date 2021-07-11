const fs = require('fs')
const Arena = require("are.na")

const CHANNEL_NAME = 'vvork-l0rnfkcink8'

const TEMPLATE = `---
title: TITLE
layout: wiki_post
---
CONTENT
`

const createFile = (id, title, content) => {
  let path = `wiki/_work/${id}.md`

  if (fs.existsSync(path)) {
    let currentContent = fs.readFileSync(path, 'utf-8')

    if (title && currentContent !== content) {
      path = path.replace(`${title}.md`, `${title}_${new Date().toISOString()}.md`)
    }
  }

  fs.writeFile(path, content, err => {
    if (err) {
      console.error(err)
      return
    }
  })
}

const onChannel = (channel) => {
  channel.map((item) => {
    createFile(item.id, item.title, TEMPLATE.replace('TITLE', item.title).replace('CONTENT', item.content))
  })
}

const arena = new Arena()
arena
  .channel(CHANNEL_NAME)
  .contents({ page: 1, per: 300 })
  .then(onChannel)
  .catch((error) => {
    console.error(error)
  })
