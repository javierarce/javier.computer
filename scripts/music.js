class Snitch extends HTMLElement {
  constructor () {
    super()
  }

  connectedCallback() {
    const options = {
      username: 'javierarce',
      api_key: '78b4ae34c84de1d5fc6510338300bd78'
    }
    const URL  = `http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${options.username }&api_key=${options.api_key }&limit=1&format=json`

    fetch(URL).then(response => response.json()).then((data) => {
      const tracks = data.recenttracks.track
      const track = tracks[0]
      this.render(`${track.name} by ${track.artist['#text']}`, track.url)
    })
  }

  render (description, URL) {
    const text = document.createElement('a')
    text.href = URL
    text.textContent = description
    text.target = '_blank'
    text.part = 'a'

    const title = document.createElement('strong')
    title.textContent = 'Listening'
    title.part = 'title'

    const close = document.createElement('button')
    close.textContent = '×'
    close.part = 'close'
    close.onclick = () => {
      this.classList.remove('is-visible')
    }

    let shadow = this.attachShadow({ mode: 'open' })
    shadow.appendChild(title)
    shadow.appendChild(close)
    shadow.appendChild(text)

    this.classList.add('is-visible')
  }
}

customElements.define('music-snitch', Snitch)
