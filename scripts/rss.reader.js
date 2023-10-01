class RSS extends HTMLElement {
  constructor () {
    super()
  }

  connectedCallback() {
    this.styles = document.createElement('style')
    this.styles.innerHTML = `
      rss-reader { display: block; margin: 0 0 1em 0; }
      ::part(blog), ::part(entry) { text-decoration: none; color: #ffc107; text-decoration: underline; }
      ::part(post) { opacity: 0; visibility: hidden; transition: opacity 250ms ease-in-out; }
      ::part(entry) { text-decoration: underline; }
      ::part(date) { font-size: 0.8em; }
      rss-reader.is-loaded::part(post) { opacity: 1; color: #ffff; visibility: visible; }
      `

    document.head.appendChild(this.styles)

    this.shadow = this.attachShadow({ mode: 'open' })

    const blogURL = this.getAttribute("data-url")
    const URL = `${blogURL}/${this.getAttribute("data-feed")}`

    this.title = this.getAttribute("data-title")
    this.author = this.getAttribute("data-author")

    const title = document.createElement('div')
    const blog = document.createElement('a')

    blog.textContent = this.title
    blog.classList.add('is-url')
    blog.href = blogURL
    blog.part = 'blog'

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
    entry.part = 'post'

    const entryLink = document.createElement('a')
    entryLink.textContent = lastEntry.title
    entryLink.href = lastEntry.link
    entryLink.part = 'entry'

    const entryDate = document.createElement('span')
    const ago = this.distance(Date.parse(lastEntry.published))
    entryDate.textContent = ago ? ` ${ago} ago` : ''
    entryDate.part = 'date'

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
