class Snitch extends HTMLElement {
  constructor () {
    super()
  }

  connectedCallback() {
    this.styles = new CSSStyleSheet()
    this.styles.replaceSync(`
      :host { 
        padding: 0 0 0 0.4em; opacity: 0; visibility: hidden; transition: opacity 350ms ease-in-out;
      }
      :host(.is-visible) { opacity: 1; visibility: visible; }
      a { color: #fff; }
    `)

    this.fetchScrobbler()

    setInterval(() => {
      this.fetchScrobbler()
    }, 15 * 1000)
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

    const label = `I'm listening to "${name}" by ${artist['#text']}.`

    if (!this.shadow) {
      const text = document.createElement('span')
      text.textContent = label

      this.shadow = this.attachShadow({ mode: 'open' })
      this.shadow.adoptedStyleSheets = [this.styles]
      this.shadow.appendChild(text)

      setTimeout(() => {
        this.classList.add('is-visible')
      }, 500)
    } else {
      const text = this.shadow.querySelector('span')

      if (text.textContent !== label) {
        this.classList.remove('is-visible')
        text.textContent = label
        setTimeout(() => {
          this.classList.add('is-visible')
        }, 500)
      }
    }
  }
}

customElements.define('music-snitch', Snitch)
