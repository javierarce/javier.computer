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
      const text = document.createElement('div')
      text.dataset.presence = 'Hello'
      const shadow = this.attachShadow({ mode: 'open' })
      shadow.appendChild(text)
      this.classList.add('Presence')
    }
  }
}

customElements.define('presence-snitch', Presence)
