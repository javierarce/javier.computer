const submitPoll = (event) => {
  let name = event.target.elements.Name.value
  const URL = 'https://api.javier.computer/api/poll/poll/save'
  const headers = { 'Content-Type': 'application/json' }
  const method = 'POST'
  const body = JSON.stringify({ name: name })
  const options = { method, headers, body }
  fetch(URL, options)
}

const onLoad = () => {
  new Chameleon(['twitter', 'gmail', 'wikipedia', 'tumblr'])

  window.lazyLoadInstance = new LazyLoad({
    elements_selector: '.lazy'
  })

  new Weather()


}

window.onload = onLoad
