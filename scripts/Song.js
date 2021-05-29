const SONG_URL = '//last.javierarce.com/api/song'
const TEMPLATE = "I'm listening to <strong>NAME</strong> by ARTIST."

class Song {
  constructor (parentClassName) {
    this.currentSong = {}
    this.$parent = document.body.querySelector(parentClassName)
    this.get()
  }

  show () {
    this.$element.classList.add('is-visible')
  }

  hide () {
    this.$element.classList.remove('is-visible')
  }

  get () {
    const headers = { 'Content-Type': 'application/json' }
    const method = 'GET'
    const options = { method, headers }

    fetch(SONG_URL).then(response => response.json()).then((json) => {
      if (json.error) {
        return console.error(json)
      }

      this.song = json && json.name ? json : undefined
      this.render()
    })
  }

  createElement () {
    let $element = document.createElement('div')
    $element.classList.add('Song')
    $element.classList.add('js-song')

    return $element
  }

  render () {
    this.$element = document.body.querySelector('.js-song')

    if (!this.song) {
      if (this.$element) {
        this.hide()
      }
      return
    }

    if (!this.$element) {
      this.$element = this.createElement()
      this.$parent.appendChild(this.$element)
    } else if (this.currentSong.name && this.currentSong.name !== this.song.name) {
      this.hide()
    }

    this.$element.innerHTML = TEMPLATE.replace('NAME', this.song.name).replace('ARTIST', this.song.artist)

    setTimeout(() => {
      this.show()
    }, 500)

    this.currentSong = this.song
  }
}
