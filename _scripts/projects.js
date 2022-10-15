const fs = require('fs')
const Arena = require("are.na")

const TEMPLATE = `---
title: "TITLE"
layout: wiki_post
link: URL
description: DESCRIPTION
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

const projects = [
{
  title: 'Avisos Madrid',
  url: 'https://github.com/javierarce/avisos-madrid',
  description: "Este repositorio (actualizado automáticamente cada 10 minutos) contiene avisos e incidencias reportadas por los ciudadanos al [servicio de avisos de Madrid](https://avisos.madrid.es/) relativas al mobiliario urbano, alumbrado, limpieza urbana y de residuos, zonas verdes, arbolado, aceras y calzadas, vehículos mal aparcados…",
}, {
  title: 'Figma Avatar',
  url: 'https://github.com/javierarce/figma-avatar',
  description: 'Update your Twitter avatar and banner from the comfort of Figma.'
}, {
  title: 'Binocular Shot',
  url: 'https://binocularshot.tumblr.com',
  description: 'A tribute to movies with innacurate binocular shots.'
}, {
  title: 'Go With The Flow' ,
  url: 'https://twitter.com/javier/status/1383022713179152385',
  description: 'A text threading plugin for Figma'
}, {
  title: 'Boletín Botánico' ,
  url: 'https://boletin-botanico.com',
  description: 'Mysterious little zine of whimsical periodicity, dubious content, dangerous editing, and suspicious ambition.' 
}, {
  title: 'BiciMap' ,
  url: 'https://bicimap.javierarce.com/',
  description: 'An alternative and open-source map of BiciMAD.'
}, {
  title: 'aire-madrid' ,
  url: 'https://github.com/javierarce/aire-madrid',
  description: 'Node package to get information about Madrid\'s air quality. It\'s probably bad (the air quality, I mean.)'
}, {
  title: 'Map with Me' ,
  url: 'https://map.javierarce.com',
  description: 'A tool for creating collaborative maps with your friends (and enemies.)'
}, {
  title: 'Enfont Terrible' ,
  url: 'https://enfont.javierarce.com',
  description: 'A terrible, terrible type foundry.'
}, {
  title: 'Kindle to Are.na' ,
  url: 'https://arena.javierarce.com/',
  description: 'Send your Kindle\'s highlights and notes to Are.na.'
}, {
  title: 'Drawings' ,
  url: 'https://drawings.javierarce.com',
  description: 'My (incredibly silly) illustration portfolio.'
}, {
  title: 'Favicon Chameleon' ,
  url: 'https://github.com/javierarce/favicon-chameleon',
  description: 'Makes your tab disappear when nobody is paying attention.'
}, {
  title: 'Paul Virilio Bot' ,
  url: 'https://twitter.com/viriliobot',
  description: 'A bot that tweets variations of a famous Paul Virilio quote.'
}, {
  title: 'OMG Movies!'  ,
  url: 'https://twitter.com/omg_movies',
  description: 'A bot that loves films but doesn\'t have a very good memory.'
}, {
  title: 'I Remember Bot' ,
  url: 'https://twitter.com/irememberbot',
  description: 'A tribute to Georges Perec\'s "Je me souviens" in the form of a bot.'
}, {
  title: 'Txtnau' ,
  url: 'https://twitter.com/txtnau',
  description: 'A bot that looks at art and tweets what it sees.'
}
]

projects.forEach((project) => {
  let content = TEMPLATE.replace('TITLE', project.title).replace('CONTENT', project.description).replace('DESCRIPTION', project.description).replace('URL', project.url)

  fs.writeFile(`../content/_projects/${string_to_slug(project.title)}.md`, content, err => {
    if (err) {
      console.error(err)
      return
    }
  })
})
