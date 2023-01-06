class Snitch extends HTMLElement {
  constructor () {
    super()
  }

  connectedCallback() {
    this.fetchScrobbler()

    setInterval(() => {
      this.fetchScrobbler()
    }, 30 * 1000)
  }

  fetchScrobbler () {
    const username = this.getAttribute("data-username")
    const key = this.getAttribute("data-key")
    const URL  = `//ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${key}&limit=1&format=json`

    fetch(URL).then(response => response.json()).then((data) => {
      const track = data.recenttracks.track[0]

      if (track) {
        const isPlaying = track['@attr'] && track['@attr'].nowplaying ? true : false
        this.render(track.name, track.artist, track.url, isPlaying)
      }
    })
  }

  render (name, artist, URL, isPlaying) {
    if (!isPlaying) {
      if (this.shadow) {
        this.classList.remove('is-visible')
      }
      return
    }

    if (!this.shadow) {
      const text = document.createElement('a')
      text.href = URL
      text.textContent = `${name} by ${artist['#text']}`
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

      this.shadow = this.attachShadow({ mode: 'open' })
      this.shadow.appendChild(title)
      this.shadow.appendChild(close)
      this.shadow.appendChild(text)

        setTimeout(() => {
          this.classList.add('is-visible')
        }, 1500)
    } else {
      const text = this.shadow.querySelector('a')

      const oldURL = text.href
      text.textContent = `${name} by ${artist['#text']}`
      text.href = URL

      if (URL !== oldURL) {
        this.classList.remove('is-visible')
        setTimeout(() => {
          this.classList.add('is-visible')
        }, 500)
      }
    }
  }
}

customElements.define('music-snitch', Snitch)
