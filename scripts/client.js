const loadLastSong = () => {
  const headers = { 'Content-Type': 'application/json' }
  const method = 'GET'
  const options = { method, headers }
  const URL = '//last.javierarce.com/api/song'

  fetch(URL).then((response) => {
    console.log(response)
    response.cors((json) => {
      console.log(json)
    })
  })
}
const onLoad = () => {
  loadLastSong()
}


window.onload = onLoad
