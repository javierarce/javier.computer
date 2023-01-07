class RSS extends HTMLElement {
  constructor () {
    super()
  }

  connectedCallback() {
    this.styles = new CSSStyleSheet()
    this.styles.replaceSync(`
      :host { display: block; margin: 0 0 1em 0; }
      a { text-decoration: none; color: #fff }
      .is-url { font-weight: bold; } 
      .is-post { opacity: 0; visibility: hidden; transition: opacity 250ms ease-in-out; }
      .is-post a { text-decoration: underline; }
      .is-date { font-size: 0.8em; }
      :host(.is-loaded) .is-post { opacity: 0.4; visibility: visible; }
    `)

    this.shadow = this.attachShadow({ mode: 'open' })
    this.shadow.adoptedStyleSheets = [this.styles]

    const blogURL = this.getAttribute("data-url")
    const URL = `${blogURL}/${this.getAttribute("data-feed")}`

    this.title = this.getAttribute("data-title")
    this.author = this.getAttribute("data-author")

    const title = document.createElement('div')
    const blog = document.createElement('a')

    blog.textContent = this.title
    blog.classList.add('is-url')
    blog.href = blogURL

    const author = document.createElement('span')
    author.textContent = ` by ${this.author}`

    title.appendChild(blog)
    title.appendChild(author)
    this.shadow.appendChild(title)

    try {
      this.fetch(`//api.javier.computer/api/feed/${URL}`)
    } catch (e) {
      console.log('meeeh')
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

    const entry = document.createElement('div')
    entry.classList.add('is-post')

    const entryLink = document.createElement('a')
    entryLink.textContent = lastEntry.title
    entryLink.href = lastEntry.link

    const entryDate = document.createElement('span')
    const ago = this.distance(Date.parse(lastEntry.published))
    entryDate.textContent = ago ? ` ${ago} ago` : ''
    entryDate.classList.add('is-date')

    entry.appendChild(entryLink)
    entry.appendChild(entryDate)
    this.shadow.appendChild(entry)
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
        units = humanTime == 1 ? 'year' : 'years'
      } else if (time > (1000 * 60 * 60 * 24 * 30)) {
        humanTime = parseInt(time / (1000 * 60 * 60 * 24 * 30), 10)
        units = humanTime == 1 ? 'month' : 'months'
      } else if (time > (1000 * 60 * 60 * 24 * 7)) {
        humanTime = parseInt(time / (1000 * 60 * 60 * 24 * 7), 10)
        units = humanTime == 1 ? 'week' : 'weeks'
      } else if (time > (1000 * 60 * 60 * 24)) {
        humanTime = parseInt(time / (1000 * 60 * 60 * 24), 10)
        units = humanTime == 1 ? 'day' : 'days'
      } else if (time > (1000 * 60 * 60)) {
        humanTime = parseInt(time / (1000 * 60 * 60), 10)
        units = humanTime == 1 ? 'hour' : 'hours'
      } else if (time > (1000 * 60)) {
        humanTime = parseInt(time / (1000 * 60), 10)
        units = humanTime == 1 ? 'minute' : 'minutes'
      } else {
        humanTime = parseInt(time / (1000), 10)
        units = humanTime == 1 ? 'second' : 'seconds'
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
