window.onload = () => {
  const filename = window.location.pathname.split('/').pop()
  if (filename) {
    fetch(`https://bots.javier.computer/${filename}.json`).then(response => response.json()).then((data) => {
      console.log(data)
      
      let $content = document.querySelector('.js-content')

      data.items.forEach((text) => {
        let $item = document.createElement('div')
        $item.classList.add('Bot__item')
        $item.innerHTML = text
        $content.appendChild($item)
      })

      $content.classList.add('is-visible')
    })
  }
}
