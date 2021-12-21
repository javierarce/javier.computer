const onLoad = () => {
  new Chameleon(['twitter', 'gmail', 'wikipedia', 'tumblr'])

  window.lazyLoadInstance = new LazyLoad({
    elements_selector: '.lazy'
  })

  new Song('.js-nav')
  new Weather()
}

window.onload = onLoad
