class RSS extends HTMLElement {
  constructor () {
    super()
  }

  connectedCallback() {
    this.fetch()
  }

  fetch () {
    const URL = `//api.javier.computer/api/feed/${this.getAttribute("data-feed")}`

    fetch(URL).then(response => response.json()).then((data) => {
      this.render(data)
      console.log(data)
    })
  }

  render (data) {
    console.log(data)
  }
}

customElements.define('rss-reader', RSS)
