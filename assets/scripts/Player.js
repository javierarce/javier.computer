function secondsToHms(d) {
  d = Number(d)

  let h = Math.floor(d / 3600)
  let m = Math.floor(d % 3600 / 60)
  let s = Math.floor(d % 3600 % 60)

  let time = []

  if (h > 0) {
    time.push(h.toString().padStart(2, '0'))
  }
  time.push(m.toString().padStart(2, '0'))
  time.push(s.toString().padStart(2, '0'))

  return time.join(':')
}

function createElement (kind, className, value = undefined) {
  let $element = document.createElement(kind)
  $element.classList.add(className)

  if (value) {
    $element.innerHTML = value
  }

  return $element
}

function onYouTubeIframeAPIReady() {
  let audios = document.querySelectorAll('[data-video]')

  audios.forEach(($audio) => {
    let trackId = undefined
    let scratching = false
    let savedTime = 0

    let dataset = $audio.dataset
    let videoId = dataset.video
    $audio.classList.add('Player__frame')

    let $player = createElement('div', 'Player')
    let $play = createElement('div', 'Player__play', '▶')
    let $time = createElement('div', 'Player__time')
    let $progress = createElement('div', 'Player__progress')
    let $progressBar = createElement('div', 'Player__progressBar')

    let $played = createElement('div', 'Player__played', '00:00')
    let $separator = createElement('div', 'Player__separator', '/')
    let $duration = createElement('div', 'Player__duration', '00:00')
    let $title = createElement('a', 'Player__title', '...')
    let $left = createElement('div', 'Player__info')

    $title.href = `https://www.youtube.com/watch?v=${videoId}`
    $title.target = '_blank'

    $progress.style.width = '0%'
    $progressBar.appendChild($progress)

    let $div = document.createElement('div')
    $div.setAttribute('id', videoId)

    $audio.appendChild($div)
    $audio.appendChild($player)

    $player.appendChild($left)

    $left.appendChild($play)
    $left.appendChild($title)
    $left.appendChild($progressBar)

    $time.appendChild($played)
    $time.appendChild($separator)
    $time.appendChild($duration)

    $time.onclick = (e) => {
      killEvent(e)
    }

    $player.appendChild($time)

    const killEvent = (e) => {
      e.stopPropagation()
      e.preventDefault()
    }

    let o = function (e) {
      if (e) {
        $player.classList.add('is-playing')
      } else {
        $player.classList.remove('is-playing')
      }
    }

    let player = new YT.Player(videoId, {
      height: "0",
      width: "0",
      videoId,
      events: {
        onReady: function(event) {
          if (player) {
            player.unMute()
            player.setVolume(100)

            let videoData  = player.getVideoData()
            $title.innerHTML = videoData.title
            $duration.innerHTML = secondsToHms(player.getDuration())
          }
        },
        onStateChange: function(event) {
          if (player.getPlayerState() == YT.PlayerState.PLAYING)  {
            if (trackId) {
              clearInterval(trackId)
            }
            trackId = setInterval(updateBar, 500)
          } else {
            if (trackId) {
              clearInterval(trackId)
            }
          }

          $audio.data === YT.PlayerState.ENDED && o(!1)
        }
      }
    })

    $progressBar.onmouseout = function(e) {
      scratching = false
      $played.innerHTML = savedTime
    }

    $progressBar.onmouseenter = function(e) {
      savedTime = $played.innerHTML
    }

    $progressBar.onmousemove = function(e) {
      scratching = true
      let x = e.offsetX
      let w = $player.offsetWidth
      let p = Math.round((x / w) * 100)
      let duration = player.getDuration()
      let seek = Math.round((duration * p) / 100)
      $played.innerHTML = secondsToHms(seek)
    }

    $progressBar.onclick = function(e) {
      killEvent(e)

      let x = e.offsetX
      let w = $player.offsetWidth
      let p = Math.round((x / w) * 100)
      let duration = player.getDuration()
      let seek = Math.round((duration * p) / 100)
      player.seekTo(seek, true)
      let i = Math.ceil((player.getCurrentTime() / player.getDuration()) * 100)
      $progress.style.width = `${i}%`
      play()
    }

    $play.onclick = function(e) {
      killEvent(e)

      if (player.getPlayerState() === YT.PlayerState.PLAYING || player.getPlayerState() === YT.PlayerState.BUFFERING) {
        stop()
      } else { 
        play()
      }
    }

    const stop = () => {
        o(0)
        $play.innerHTML = '▶'
        player.pauseVideo()
    }

    const play = () => {
      $play.innerHTML = '■'
      o(1)
      player.playVideo()
    }

    const updateBar = () => {
      let p = Math.ceil((player.getCurrentTime() / player.getDuration()) * 100)
      $progress.style.width = `${p}%`
      if (!scratching) {
        $played.innerHTML = secondsToHms(player.getCurrentTime())
      }
    }
  })
}
