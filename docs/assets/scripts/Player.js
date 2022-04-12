let trackId = undefined

function secondsToHms(d) {
  d = Number(d)

  let h = Math.floor(d / 3600)
  let m = Math.floor(d % 3600 / 60)
  let s = Math.floor(d % 3600 % 60)

  let time = []

  if (h > 0) {
    time.push(h)
  }

  if (!h && m > 0) {
    time.push(m)
  }

  time.push(s.toString().padStart(2, '0'))

  return time.join(':')
}

function onYouTubeIframeAPIReady() {
  let $audio = document.getElementById('youtube-audio')
  let dataset = $audio.dataset
  let videoId = dataset.video

  let $player = document.createElement('div')
  $player.classList.add('Player')

  let $progressBar = document.createElement('div')
  $progressBar.classList.add('Player__progress')
  $progressBar.style.width = '0%'

  let  $play = document.createElement('div')
  $play.classList.add('Player__play')
  $play.innerHTML = '▶'

  let $time = document.createElement('div')
  $time.classList.add('Player__time')

  let $played = document.createElement('div')
  $played.classList.add('Player__played')
  $played.innerHTML = '00:00'

  let $separator = document.createElement('div')
  $separator.classList.add('Player__separator')
  $separator.innerHTML = '/'

  let $duration = document.createElement('div')
  $duration.classList.add('Player__duration')
  $duration.innerHTML = '00:00'

  let  $title = document.createElement('div')
  $title.classList.add('Player__title')
  $title.innerHTML = '...'

  let $div = document.createElement('div')
  $div.setAttribute('id', 'youtube-player')

  $audio.appendChild($div)
  $audio.appendChild($player)


  let $left = document.createElement('div')
  $left.classList.add('Player__info')
  $player.appendChild($left)

  $left.appendChild($play)
  $left.appendChild($title)
  $left.appendChild($progressBar)

  $time.appendChild($played)
  $time.appendChild($separator)
  $time.appendChild($duration)
  $player.appendChild($time)

  let o = function (e) {
    if (e) {
      $player.classList.add('is-playing')
    } else {
      $player.classList.remove('is-playing')
    }
  };

  let player = new YT.Player("youtube-player", {
    height: "0",
    width: "0",
    videoId,
    events: {
      onReady: function(e) {
        if (player) {
          let videoData  = player.getVideoData()
          $title.innerHTML = videoData.title
          $duration.innerHTML = secondsToHms(player.getDuration())
        }
        //player.setPlaybackQuality("small"), o(player.getPlayerState() !== YT.PlayerState.CUED)
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
  window.player = player

  $player.onclick = function(e) {
    e.stopPropagation()
    e.preventDefault()

    let x = e.offsetX
    let w = $player.offsetWidth
    let p = Math.round((x / w) * 100)
    let duration = player.getDuration()
    let seek = Math.round((duration * p) / 100)
    console.log(seek)
    //player.seekTo(seek, true)
  }

  $play.onclick = function(e) {
    e.stopPropagation()
    e.preventDefault()

    if (player.getPlayerState() === YT.PlayerState.PLAYING || player.getPlayerState() === YT.PlayerState.BUFFERING) {
      o(0)
      $play.innerHTML = '▶'
      player.pauseVideo()
    } else { 
      $play.innerHTML = '■'
      o(1)
      player.playVideo()
    }
  }

  const updateBar = () => {
    let p = Math.ceil((player.getCurrentTime() / player.getDuration()) * 100)
    $progressBar.style.width = `${p}%`
    $played.innerHTML = secondsToHms(player.getCurrentTime())
  }

}
