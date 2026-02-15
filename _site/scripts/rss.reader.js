class RSS extends HTMLElement {
  constructor () {
    super()
  }

  connectedCallback() {
    this.styles = document.createElement('style')
    this.styles.innerHTML = `
      rss-reader { display: block; margin: 0 0 0 0; }
      ::part(blog) { text-decoration: none; color: #fff; }
      ::part(date) { opacity: 0; visibility: hidden; transition: opacity 250ms ease-in-out; }
      ::part(blog):after { content: '↗'; display: inline-block; font-weight: 400; padding-left: 4px; opacity: 0.5; color: #fff; }
      rss-reader.is-loaded::part(date) { opacity: 0.5; visibility: visible; }
      `

    document.head.appendChild(this.styles)

    this.shadow = this.attachShadow({ mode: 'open' })

    const blogURL = this.getAttribute("data-url")
    const URL = `${blogURL}/${this.getAttribute("data-feed")}`

    this.title = this.getAttribute("data-title")

    const title = document.createElement('span')
    const blog = document.createElement('a')

    blog.textContent = this.title
    blog.classList.add('is-url')
    blog.href = blogURL
    blog.part = 'blog'

    title.appendChild(blog)
    this.shadow.appendChild(title)

    try {
      this.fetch(`//api.javier.computer/api/feed/${URL}`)
    } catch (e) {
      console.error(e)
    }
  }

  fetch (url) {
    fetch(url).then(response => response.json()).then((data) => {
      this.render(data)
    }).catch((error) => {
      return error
    })
  }

  render (data) {
    const lastEntry = data.entries[0]

    const entryDate = document.createElement('span')
    const ago = this.distance(Date.parse(lastEntry.published))
    entryDate.textContent = ago ? ` hace ${ago}` : ''
    entryDate.part = 'date'

    const titleElement = this.shadow.querySelector('span');
    titleElement.appendChild(entryDate)
    this.classList.add('is-loaded')
  }

  distance (timestamp) {
    const now = new Date().getTime()
    const howLongAgo = timestamp - now

    if (isNaN(howLongAgo)) {
      return
    }

    const getHumanTime = (timestamp) => {

      const time = Math.abs(timestamp)
      let humanTime, units

      if (time > (1000 * 60 * 60 * 24 * 365)) {
        humanTime = parseInt(time / (1000 * 60 * 60 * 24 * 365), 10)
        units = humanTime == 1 ? 'año' : 'años'
      } else if (time > (1000 * 60 * 60 * 24 * 30)) {
        humanTime = parseInt(time / (1000 * 60 * 60 * 24 * 30), 10)
        units = humanTime == 1 ? 'mes' : 'meses'
      } else if (time > (1000 * 60 * 60 * 24 * 7)) {
        humanTime = parseInt(time / (1000 * 60 * 60 * 24 * 7), 10)
        units = humanTime == 1 ? 'semana' : 'semanas'
      } else if (time > (1000 * 60 * 60 * 24)) {
        humanTime = parseInt(time / (1000 * 60 * 60 * 24), 10)
        units = humanTime == 1 ? 'día' : 'días'
      } else if (time > (1000 * 60 * 60)) {
        humanTime = parseInt(time / (1000 * 60 * 60), 10)
        units = humanTime == 1 ? 'hora' : 'horas'
      } else if (time > (1000 * 60)) {
        humanTime = parseInt(time / (1000 * 60), 10)
        units = humanTime == 1 ? 'minuto' : 'minutos'
      } else {
        humanTime = parseInt(time / (1000), 10)
        units = humanTime == 1 ? 'segundo' : 'segundos'
      }

      const timeUnits = humanTime + ' ' + units

      if (timestamp > 0) {
        return 'error'
      }

      return timeUnits
    }

    return getHumanTime(howLongAgo)
  }
}

customElements.define('rss-reader', RSS)
