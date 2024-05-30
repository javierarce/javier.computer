class Presence extends HTMLElement {
  constructor () {
    super()
  }

    connectedCallback () {
        this.getPresence()
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
    if (presence.online) {
      const shadow = this.attachShadow({ mode: 'open' })
      this.classList.add('Presence')

      setTimeout(() => {
        this.classList.add('is-visible')
      }, 500)
    }
  }
}

customElements.define('presence-snitch', Presence)
