const URL = `https://stream.javier.computer/photos.json?v=${Math.random() * 1000}`

console.log(URL)

fetch(URL).then(response => response.json()).then((data) => {
  console.log(data)

  let $content = document.querySelector('.js-stream')

  data.reverse().forEach((filename) => {
    const $figure = document.createElement('figure')
    $figure.classList.add('Figure')

    const $picture = document.createElement('picture')
    const $img = document.createElement('img')
    $img.classList.add('Photo', 'lazy')
    $img.dataset.src = `https://img.javier.computer/stream/${filename}`

    $picture.appendChild($img)
    $figure.appendChild($picture)
    $content.appendChild($figure)
  })

  if (lazyLoadInstance) {
    lazyLoadInstance.loadAll()
  }
})
