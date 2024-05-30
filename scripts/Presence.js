class Presence extends HTMLElement {
  constructor () {
    super()
  }

  connectedCallback () {
    this.getPresence()

    setInterval(() => {
      this.getPresence()
    }, 15 * 1000)
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
    const shadow = this.attachShadow({ mode: 'open' })

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
