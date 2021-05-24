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

const addSong = (song) => {
  let $div = document.createElement('div')
  $div.classList.add('Song')
  $div.innerHTML = `<strong>${song.name}</strong> by ${song.artist}`
  let $inner = document.querySelector('.js-inner')
  $inner.prepend($div)

}
const onLoad = () => {
  loadLastSong()
}


window.onload = onLoad
