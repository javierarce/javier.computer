class Like {
  constructor(postId) {
    this.postId = postId
    this.KEY_PREFIX = '_open_heart_'
  }

  get storageKey() {
    return `${this.KEY_PREFIX}${this.postId}`
  }

  saveReaction() {
    const hearts = (localStorage.getItem(this.storageKey) || '').split(',').filter(s => s)
    hearts.push(this.postId)
    localStorage.setItem(this.storageKey, hearts.join(','))
  }

  hasReacted() {
    const hearts = (localStorage.getItem(this.storageKey) || '').split(',')
    return hearts.includes(this.postId)
  }

  send() {
    if (!this.postId) {
      this.error('Missing post ID')
      return
    } else if (this.hasReacted()) {
      this.thanks()
      return
    }

    const URL = `https://api.javier.computer/heart?id=${this.postId}`

    fetch(URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain'
      },
      body: '❤️' 
    }).then(response => response.json())
      .then(data => {
        this.thanks()
        this.saveReaction()
      }).catch(error => {
        this.error(error.toString())
      })
  }

  error(msg) {
    const $error = document.querySelector('.js-error')
    const $msg = document.querySelector('.js-error-message')
    $msg.textContent = msg
    $error.classList.remove('is-hidden')
  }

  thanks() {
    const $thanks = document.querySelector('.js-thanks')
    const $url = document.querySelector('.js-url')
    $url.href = `post.html?id=${this.postId}`
    $thanks.classList.remove('is-hidden')
  }
}

window.addEventListener('load', () => {
  const url = new URL(window.location.href)
  const id = url.searchParams.get('id')
  if (id) { 
    const like = new Like(id)
    like.send()
  } else {
    console.error("Post ID is missing from the URL.")
  }
})
