const loadLastSong = () => {
  const headers = { 'Content-Type': 'application/json' }
  const method = 'GET'
  const options = { method, headers }
  const URL = '//last.javierarce.com/api/song'

  fetch(URL).then(response => response.json())
    .then((json) => {
      if (json.error) {
        return console.log(json)
      }
      addSong(json)
    })
}

const insertAfter = (newNode, referenceNode) => {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling)
}

const addSong = (song) => {
  if (song && !song.name) {
    return
  }

  let $song = document.createElement('div')
  $song.classList.add('Song')
  $song.innerHTML = `I'm listening to <strong>${song.name}</strong> by ${song.artist}.`
  let $intro = document.querySelector('.js-intro')
  $intro.appendChild($song)
}

const onLoad = () => {
  loadLastSong()
  addSong({ name: 123, artist: 324324})
}


window.onload = onLoad
