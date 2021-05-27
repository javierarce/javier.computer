let currentSong = {}

const loadLastSong = () => {
  const headers = { 'Content-Type': 'application/json' }
  const method = 'GET'
  const options = { method, headers }
  const URL = '//last.javierarce.com/api/song'

  fetch(URL).then(response => response.json()).then((json) => {
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

  let $song = document.body.querySelector('.js-song')

  if (!$song) {
    $song = document.createElement('div')
    $song.classList.add('Song')
    $song.classList.add('js-song')
    let $intro = document.querySelector('.js-intro')
    $intro.appendChild($song)
  } else if (currentSong && currentSong.name && currentSong.name !== song.name) {
    $song.classList.remove('is-visible')
  }

  $song.innerHTML = `I'm listening to <strong>${song.name}</strong> by ${song.artist}.`

  setTimeout(() => {
    $song.classList.add('is-visible')
  }, 500)

  currentSong = song
}

const onLoad = () => {
  new Chameleon(['twitter', 'gmail', 'tumblr'])
  loadLastSong()
  setInterval(loadLastSong, 30 * 1000)
}

window.onload = onLoad
