const onLoad = () => {
  new Chameleon(['twitter', 'gmail', 'wikipedia', 'tumblr'])

  window.lazyLoadInstance = new LazyLoad({
    elements_selector: '.lazy'
  })

  new Weather()
  new Presence()
}

window.onload = onLoad
