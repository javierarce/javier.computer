const onLoad = () => {
  new Chameleon(['twitter', 'gmail', 'wikipedia', 'tumblr'])
  new Song('.js-nav')
  new Weather()
}

window.onload = onLoad
