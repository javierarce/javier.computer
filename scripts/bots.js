window.onload = () => {
  const filename = window.location.pathname.split('/').pop()
  if (filename) {
    fetch(`https://bots.javier.computer/${filename}.json?v=${Math.random() * 1000}`).then(response => response.json()).then((data) => {
      console.log(data)
      
      let $content = document.querySelector('.js-status')
      let $archive = document.querySelector('.js-archive')
      let $updatedAt = document.querySelector('.js-updated-at')

      const today = new Date(data.updatedAt)
      const prefix = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')} at ${today.getHours()}:${today.getMinutes()}`


      let $items = document.createElement('div')
      $items.classList.add('Bot__items')

      data.items.reverse().forEach((text) => {
        let $item = document.createElement('div')
        $item.classList.add('Bot__item')
        $item.innerHTML = text
        $items.appendChild($item)
      })

      $content.appendChild($items)
      $archive.classList.add('is-visible')
      $updatedAt.innerHTML = prefix

    })
  }
}
