class Like {
  constructor() {
    this.KEY = '_open_heart'
  }

  saveReaction() {
    const hearts = (localStorage.getItem(this.KEY) || '').split(',').filter(s => s)
    console.log(this.KEY)
    hearts.push(this.KEY)
    localStorage.setItem(this.KEY, hearts.join(','))
  }

  hasReacted() {
    const hearts = (localStorage.getItem(this.KEY) || '').split(',')
    return hearts.includes(this.KEY)
  }

  send (id) {
    this.id = id

    if (!id) {
      this.error(`falta el id del post`)
      return
    } else if (this.hasReacted()) {
      this.thanks()
      return
    } 

    const URL = `https://api.javier.computer/heart?id=${id}`

    fetch(URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain'
      },
      body: '❤️' 
    }).then((response) => {
      return response.json()
    }).then((data) => {
      this.thanks()
      this.saveReaction()
    }).catch((error) => {
      this.error(error)
    })
  }

  error (msg) {
    const $error = document.querySelector('.js-error')
    const $msg = document.querySelector('.js-error-message')
    $msg.innerHTML = msg
    $error.classList.remove('is-hidden')
  }

  thanks () {
    const $thanks = document.querySelector('.js-thanks')
    const $url = document.querySelector('.js-url')
    $url.href = this.id
    $thanks.classList.remove('is-hidden')
  }
}

window.addEventListener('load', () => {
  const url = new URL(window.location.href)
  const id = url.searchParams.get('id')
  const like = new Like()
  like.send(id)
})
