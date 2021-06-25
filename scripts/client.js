const onLoad = () => {
  new Chameleon(['twitter', 'gmail', 'wikipedia', 'tumblr'])
  let song = new Song('.js-nav')

  setInterval(() => { song.get() }, 30 * 1000)
}

window.onload = onLoad
