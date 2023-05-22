class Snitch extends HTMLElement {
  constructor () {
    super()
  }

  connectedCallback() {
    this.fetchScrobbler()

    setInterval(() => {
      this.fetchScrobbler()
    }, 15 * 1000)
  }

  fetchScrobbler () {
    const username = this.getAttribute("data-username")
    const key = this.getAttribute("data-key")
    const r = Math.round(Math.random()*10000)
    const URL  = `//ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${key}&limit=1&format=json&r=${r}`

    fetch(URL).then(response => response.json()).then((data) => {
      const track = data.recenttracks.track[0]

      if (track) {
        const isPlaying = track['@attr'] && track['@attr'].nowplaying ? true : false
        this.render(track.name, track.artist, track.url, isPlaying)
      }
    })
  }

  show (callback) {
    setTimeout(() => {
      this.shadow.host.classList.add('is-visible')
      callback && callback()
    }, 500)
  }

  hide (callback) {
    this.shadow.host.classList.remove('is-visible')
    setTimeout(() => {
      callback && callback()
    }, 500)
  }

  create (label) {
    const text = document.createElement('span')
    text.textContent = label

    this.shadow = this.attachShadow({ mode: 'open' })
    this.shadow.appendChild(text)

    this.show(() => {
      this.dispatchEvent(new CustomEvent("loaded"))
    })
  }

  update (label) {
    const text = this.shadow.querySelector('span')


    if (text.textContent !== label) {
      this.hide(() => {
        text.textContent = label
        this.show()
      })
    }
  }

  render (name, artist, URL, isPlaying) {
    if (!isPlaying) {

      this.dispatchEvent(new CustomEvent("loaded"))

      if (this.shadow) {
        this.hide()
      }
      return
    }

    const label = ` I'm listening to "${name}" by ${artist['#text']}.`

    if (!this.shadow) {
      this.create(label)
    } else {
      this.update(label)
    }
  }
}

customElements.define('music-snitch', Snitch)
