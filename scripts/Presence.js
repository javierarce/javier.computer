class Presence extends HTMLElement {
  constructor () {
    super()
  }

  connectedCallback () {
    this.getPresence()

    setInterval(() => {
      this.getPresence()
    }, 60 * 1000)
  }

  getPresence () {
    const ENDPOINT = `https://api.javier.computer/api/presence`

    fetch(ENDPOINT).then(response => response.json()).then((json) => {
      if (json.error) {
        return console.error(json)
      }

      this.render(JSON.parse(json))
    }).catch((error) => {
      console.error(error)
    })
  }

  render (presence) {
    if (!this.shadow) {
      this.shadow = this.attachShadow({ mode: 'open' })
    }

    this.toggle(presence)

  }

  toggle (presence) {
    if (presence.online) {
      this.classList.add('Presence')
      setTimeout(() => {
        this.classList.add('is-visible')
      }, 500)
    } else {
      this.classList.remove('is-visible')
    }
  }
}

customElements.define('presence-snitch', Presence)
