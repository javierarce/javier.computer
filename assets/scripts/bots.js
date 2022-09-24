window.onload = () => {
  const filename = window.location.pathname.split('/').pop()
  if (filename) {
    fetch(`https://bots.javier.computer/${filename}.json?v=${Math.random() * 1000}`).then(response => response.json()).then((data) => {
      console.log(data)
      
      let $content = document.querySelector('.js-content')

      let $items = document.createElement('div')
      $items.classList.add('Bot__items')

      data.items.reverse().forEach((text) => {
        let $item = document.createElement('div')
        $item.classList.add('Bot__item')
        $item.innerHTML = text
        $items.appendChild($item)
      })

      $content.appendChild($items)
      $content.classList.add('is-visible')
    })
  }
}
