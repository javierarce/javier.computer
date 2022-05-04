const submitPoll = (event) => {
  let fields = {}

  let spinner = new Spinner('is-inside-button')
  event.target.appendChild(spinner.$element)
  spinner.show()

  function isEmpty(obj) {
    return Object.keys(obj).length === 0;
  }

  const error = (error) => {
    event.target.classList.add('is-error')
    event.target.classList.remove('is-loading')

    spinner.hide()
    spinner.$element.remove()
  }

  event.target.classList.add('is-loading')

  let values = [... event.target.elements].forEach((field) => {
    if (field.type === 'text' && field.value) {
      fields[field.name] = field.value
    }
  })

  if (isEmpty(fields)) {
    error(0)
    return
  }

  const URL = 'https://api.javier.computer/api/poll/poll/save'
  //const URL = 'http://localhost:3001/api/poll/poll/save'
  const headers = { 'Content-Type': 'application/json' }
  const method = 'POST'
  const body = JSON.stringify(fields)
  const options = { method, headers, body }

  fetch(URL, options).then((response) => {
    event.target.classList.remove('is-loading')
    spinner.hide()

    if (response.status === 200) {
      event.target.classList.add('is-success')
    }
  }).catch((e) => {
    error(e)
  })
}

const onLoad = () => {
  new Chameleon(['twitter', 'gmail', 'wikipedia', 'tumblr'])

  window.lazyLoadInstance = new LazyLoad({
    elements_selector: '.lazy'
  })

  new Weather()


}

window.onload = onLoad
