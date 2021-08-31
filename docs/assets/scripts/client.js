const onLoad = () => {
  new Chameleon(['twitter', 'gmail', 'wikipedia', 'tumblr'])
  new Song('.js-nav')
  new Weather()

  window.lazyLoadInstance = new LazyLoad({
    elements_selector: '.lazy'
  })
}

window.onload = onLoad
