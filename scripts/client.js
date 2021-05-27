const loadLastSong = () => {
  const headers = { 'Content-Type': 'application/json' }
  const method = 'GET'
  const options = { method, headers }
  const URL = '//last.javierarce.com/api/song'

  fetch(URL).then(response => response.json())
    .then((json) => {
      if (json.error) {
        return console.error(json)
      }
      addSong(json)
    })
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

  setTimeout(() => {
    $song.classList.add('is-visible')
  })
}

const onLoad = () => {
  new Chameleon(['twitter', 'gmail', 'tumblr'])
  loadLastSong()
}


window.onload = onLoad
