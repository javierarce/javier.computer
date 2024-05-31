class Presence extends HTMLElement {
  constructor () {
    super()
  }

  connectedCallback () {
    this.getPresence()

    setInterval(() => {
      this.getPresence()
    }, 5000)
  }

  getPresence () {
    const ENDPOINT = `https://api.javier.computer/api/presence?t=${Date.now()}`

    fetch(ENDPOINT).then(response => response.json()).then((json) => {
      if (json.error) {
        return console.error(json)
      }

      this.render(json)
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

  setOnline (text) {
    this.classList.add('Presence')

    this.shadow.innerHTML = ''
    const $text = document.createElement('div')

    $text.textContent = text || "Estoy online :)" 
    $text.part = "text"
    this.shadow.appendChild($text)

    setTimeout(() => {
      this.classList.add('is-visible')
    }, 500)
  }

  toggle (presence) {
    if (presence.online) {
      this.setOnline(presence.text)
    } else {
      this.classList.remove('is-visible')
    }
  }
}

customElements.define('presence-snitch', Presence)
