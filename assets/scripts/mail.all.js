const SUCCESS_MESSAGE = 'Message delivered. Thanks!'

const MAIL_URL = 'https://api.javier.computer'

const ENDPOINTS = {
  send: '/api/send',
  all: '/api/all',
  post: '/api/post',
  repeat: '/api/repeat',
  delete: '/api/text'
}

const killEvent = (e) => {
  e.stopPropagation()
  e.preventDefault()
}

const isEmpty = (obj) => {
  return Object.keys(obj).length === 0;
}

const createElement = ({ className, html, text, elementType = 'div', type,  ...options }) => {
  let $el = document.createElement(elementType)

  if (type) {
    $el.type = 'text'
  }

  if (html) {
    $el.innerHTML = html
  } else if (text) {
    $el.innerText = text
  }

  className.split(' ').filter(c => c).forEach(name => $el.classList.add(name))

  if (!isEmpty(options)) {
    Object.keys(options).forEach((key) => {
      $el[key] = options[key]
    })
  }

  return $el
}
const addClass = (elementClass, className) => {
  let $element = getElement(`.${elementClass}`)

  if ($element) {
    $element.classList.add(className)
  }
}

const post = (URL, content) => {
  const headers = { 'Content-Type': 'application/json' }
  const method = 'POST'
  const body = JSON.stringify(content)
  const options = { method, headers, body }

  return fetch(URL, options)
}

const getRandomItem = (items) => {
  return items[Math.floor(Math.random()*items.length)]
}

const getElements = (selector) => {
  return document.querySelectorAll(selector)
}

const getElement = (selector) => {
  return document.querySelector(selector)
}


class Mail {
  constructor () {
    this.className = this.constructor.name
    this.spinner = new Spinner()

    this.title = ''
    this.content = ''

    this.disabled = true

    this.render()
    this.bind()
  }


  bind () {
    this.$title.addEventListener('keyup', this.onWriting.bind(this))
    this.$content.addEventListener('keyup', this.onWriting.bind(this))
  }

  success () {
    this.$message.innerText = SUCCESS_MESSAGE
    this.$form.classList.add('was-sent')

    setTimeout(() => {
      this.$form.classList.remove('was-sent')
    }, 2000)
  }

  disableSend () {
    this.disabled = true
    this.$sendButton.classList.add('is-disabled')
  }

  enableSend () {
    this.disabled = false
    this.$sendButton.classList.remove('is-disabled')
  }

  onWriting () {
    this.$form.classList.remove('was-sent')

    this.title = this.$title.value
    this.content = this.$content.value

    if (this.title && this.content) {
      this.enableSend()
    } else {
      this.disableSend()
    }
  }

  killEvent (event) {
    if (event) {
      event.preventDefault()
      event.stopPropagation()
    }
  }

  renderTitle () {
    let $input = createElement({ 
      className: 'Input__field'
    })

    let $label = createElement({ 
      elementType: 'label',
      text: 'Subject',
      className: 'Label'
    })

    this.$title = createElement({ 
      type: 'text',
      elementType: 'input',
      className: 'Input'
    })

    $input.appendChild(this.$title)
    this.$form.appendChild($label)
    this.$form.appendChild($input)
  }

  renderTextarea () {
    const $input = createElement({ 
      className: 'Input__field'
    })

    const $label = createElement({ 
      elementType: 'label',
      html: 'Text',
      className: 'Label'
    })

    const $help = createElement({ 
      elementType: 'div',
      html: 'Don\'t forget to add a contact method if you need me to repond',
      className: 'Label__help'
    })

    this.$content = createElement({ 
      elementType: 'textarea',
      className: 'Textarea'
    })

    $input.appendChild(this.$content)
    this.$form.appendChild($label)
    this.$form.appendChild($input)
    this.$form.appendChild($help)
  }

  renderSendButton () {
    let $actions = createElement({ 
      elementType: 'div',
      className: 'Actions'
    })

    this.$message = createElement({ 
      elementType: 'div',
      className: 'Message',
      text: SUCCESS_MESSAGE
    })

    this.$sendButton = createElement({ 
      elementType: 'button',
      className: 'Button is-disabled',
      text: 'Send message',
      onclick: () => {
        this.sendText()
      }
    })

    this.generateSpinner = new Spinner('is-inside-button')
    this.$sendButton.appendChild(this.generateSpinner.$element)

    this.$form.appendChild($actions)
    $actions.appendChild(this.$sendButton)
    $actions.appendChild(this.$message)
  }

  sendText () {
    this.generateSpinner.show()

    if (this.disabled) {
      return
    }

    const title = this.title
    const text = this.content

    return post(`${MAIL_URL}${ENDPOINTS.send}`, { title, text }).then((response) => {
      response.json().then((result) => {

        this.generateSpinner.hide()

        if (result && result.error) {
          this.$message.innerText = result.message
          this.$form.classList.add('is-error')

          setTimeout(() => {
            this.$form.classList.remove('is-error')
          }, 2000)

          return
        }

        this.title = ''
        this.content = ''
        this.$title.value = ''
        this.$content.value = ''
        this.disableSend()
        this.success()
      })
    })
  }

  render () {
    this.$el = document.querySelector('.js-content')

    this.$form = createElement({ className: 'Form' })

    this.renderTitle()
    this.renderTextarea()
    this.renderSendButton()

    this.$el.appendChild(this.$form)
  }
}

const reader = new Mail()
