document.addEventListener('DOMContentLoaded', () => {
  const channel_title = 'binocular-shot'
  const api = 'https://api.are.na/v2/channels/'
  let allBlocks = []
  let currentIndex = 0

  async function loadAllBlocks() {
    let page = 1
    let hasMore = true

    while (hasMore) {
      const response = await fetch(`${api}${channel_title}?sort=updated_at&page=${page}&per=20`, {
        method: 'GET',
        headers: { 'Cache-Control': 'no-cache' }
      })
      const data = await response.json()

      if (data.contents && data.contents.length) {
        allBlocks.push(...data.contents)
        page++
        hasMore = data.contents.length === 20
      } else {
        hasMore = false
      }
    }

    console.log(allBlocks)
    //loadVideo(currentIndex, true)
  }

  loadAllBlocks()
})
