const submitPoll = (event) => {
  let fields = {}

  let $error = event.target.querySelector('.js-error')
  event.target.classList.remove('is-error')

  let spinner = new Spinner('is-inside-button')
  event.target.appendChild(spinner.$element)
  spinner.show()

  function isEmpty(obj) {
    return Object.keys(obj).length === 0;
  }

  const error = (error) => {
    event.target.classList.add('is-error')
    event.target.classList.remove('is-loading')
    $error.innerHTML = error

    setTimeout(() => {
      event.target.classList.remove('is-error')
    }, 3000)
  }

  event.target.classList.add('is-loading')

  let values = [... event.target.elements].forEach((field) => {
    if (field.type === 'text' && field.value) {
      fields[field.name] = field.value
    }
  })

  if (isEmpty(fields)) {
    spinner.hide()
    spinner.$element.remove()

    error('Fields are empty.')
    return
  }

  let poll = event.target.querySelector('.js-poll').value

  const URL = `https://api.javier.computer/api/poll/${poll}/save`
  const headers = { 'Content-Type': 'application/json' }
  const method = 'POST'
  const body = JSON.stringify(fields)
  const options = { method, headers, body }

  const onResponse = (response) => {
    event.target.classList.remove('is-loading')

    if (response.error) {
      error('Error')
    } else {

      spinner.hide()
      spinner.$element.remove()

      event.target.classList.add('is-success')
    }
  }

  fetch(URL, options).then(onResponse).catch(error)
}

