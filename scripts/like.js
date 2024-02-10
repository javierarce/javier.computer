class Like {
  constructor(postId) {
    this.postId = postId
    this.KEY = '_open_heart'
  }

  get storageKey() {
    return `${this.KEY}@${encodeURIComponent(this.postId)}`
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
      console.error('Missing post ID')
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
        console.error(error)
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

document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search)
  const postId = urlParams.get('id')
  if (postId) {
    const like = new Like(postId)
    like.send()
  }
})
