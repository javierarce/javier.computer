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
    const URL  = 'https://api.javier.computer/api/song'

    fetch(URL).then(response => response.json()).then((data) => {
      if (data) {
        const { track, artist, album, playing } = data
        this.render(track, artist, album, playing)
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

  render (track, artist, album, playing) {
    if (!playing) {

      this.dispatchEvent(new CustomEvent("loaded"))

      if (this.shadow) {
        this.hide()
      }
      return
    }

    const label = ` I'm listening to "${track}" by ${artist}.`

    if (!this.shadow) {
      this.create(label)
    } else {
      this.update(label)
    }
  }
}

customElements.define('music-snitch', Snitch)
