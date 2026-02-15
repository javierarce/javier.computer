class Player {
  constructor ($element) {
    this.$element = $element
    this.render()
  }

  killEvent (e) {
    e.stopPropagation()
    e.preventDefault()
  }

  secondsToHms(d) {
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

  createElement (kind, className, value = undefined) {
    let $element = document.createElement(kind)
    $element.classList.add(className)

    if (value) {
      $element.innerHTML = value
    }

    return $element
  }

  onClickProgressBar (event) {
    this.killEvent(event)

    let x = event.offsetX
    let w = this.$player.offsetWidth
    let p = Math.round((x / w) * 100)
    let duration = this.player.getDuration()
    let seek = Math.round((duration * p) / 100)
    this.player.seekTo(seek, true)
    let i = Math.ceil((this.player.getCurrentTime() / this.player.getDuration()) * 100)
    this.$progress.style.width = `${i}%`
    this.play()
  }

  onReady (event) {
    if (this.player) {
      this.player.unMute()
      this.player.setVolume(100)

      let videoData  = this.player.getVideoData()
      this.$title.innerHTML = this.title || videoData.title
      this.$duration.innerHTML = this.secondsToHms(this.player.getDuration())
    }
  }

  stop () {
    this.o(0)
    this.$play.innerHTML = '▶'
    this.player.pauseVideo()
  }

  play () {
    this.o(1)
    this.$play.innerHTML = '■'
    this.player.playVideo()
  }

  updateBar () {
    let p = Math.ceil((this.player.getCurrentTime() / this.player.getDuration()) * 100)
    this.$progress.style.width = `${p}%`
    if (!this.scratching) {
      this.$played.innerHTML = this.secondsToHms(this.player.getCurrentTime())
    }
  }

  onStateChange (event) {
    if (this.player.getPlayerState() == YT.PlayerState.PLAYING)  {
      if (this.trackId) {
        clearInterval(this.trackId)
      }
      this.trackId = setInterval(this.updateBar.bind(this), 500)
    } else {
      if (this.trackId) {
        clearInterval(this.trackId)
      }
    }

    this.$element.data === YT.PlayerState.ENDED && o(!1)
  }

  onClickPlay (event) {
    this.killEvent(event)

    if (this.player.getPlayerState() === YT.PlayerState.PLAYING || this.player.getPlayerState() === YT.PlayerState.BUFFERING) {
      this.stop()
    } else { 
      this.play()
    }
  }

  onMouseOut () {
    this.scratching = false
    this.$played.innerHTML = this.savedTime
  }

  onMouseEnter () {
    this.savedTime = this.$played.innerHTML
  }

  onMouseMove (e) {
    this.scratching = true
    let x = e.offsetX
    let w = this.$player.offsetWidth
    let p = Math.round((x / w) * 100)
    let duration = this.player.getDuration()
    let seek = Math.round((duration * p) / 100)
    this.$played.innerHTML = this.secondsToHms(seek)
  }

  o (e) {
    if (e) {
      this.$player.classList.add('is-playing')
    } else {
      this.$player.classList.remove('is-playing')
    }
  }

  render () {
    this.trackId = undefined
    this.scratching = false
    this.savedTime = 0

    this.dataset = this.$element.dataset
    this.videoId = this.dataset.video
    this.title = this.dataset.title
    this.$element.classList.add('player__frame')

    this.$player = this.createElement('div', 'player')
    this.$play = this.createElement('div', 'player__play', '▶')
    this.$time = this.createElement('div', 'player__time')
    this.$progress = this.createElement('div', 'player__progress')
    this.$progressBar = this.createElement('div', 'player__progressBar')

    this.$played = this.createElement('div', 'player__played', '00:00')
    this.$duration = this.createElement('div', 'player__duration', '00:00')
    this.$title = this.createElement('a', 'player__title', '...')

    let $separator = this.createElement('div', 'player__separator', '/')
    let $left = this.createElement('div', 'player__info')

    this.$time.onclick = this.killEvent.bind(this)
    this.$play.onclick = this.onClickPlay.bind(this)
    this.$progressBar.onmouseout = this.onMouseOut.bind(this)
    this.$progressBar.onmouseenter = this.onMouseEnter.bind(this)
    this.$progressBar.onmousemove = this.onMouseMove.bind(this)
    this.$progressBar.onclick = this.onClickProgressBar.bind(this)

    this.$title.href = `https://www.youtube.com/watch?v=${this.videoId}`
    this.$title.target = '_blank'

    this.$progress.style.width = '0%'
    this.$progressBar.appendChild(this.$progress)

    let $div = document.createElement('div')
    $div.setAttribute('id', this.videoId)

    this.$element.appendChild($div)
    this.$element.appendChild(this.$player)

    this.$player.appendChild($left)

    $left.appendChild(this.$play)
    $left.appendChild(this.$title)
    $left.appendChild(this.$progressBar)

    this.$time.appendChild(this.$played)
    this.$time.appendChild($separator)
    this.$time.appendChild(this.$duration)
    this.$player.appendChild(this.$time)

    this.player = new YT.Player(this.videoId, {
      height: "0",
      width: "0",
      videoId: this.videoId,
      events: {
        onReady: this.onReady.bind(this),
        onStateChange: this.onStateChange.bind(this)
      }
    })

  }
}

function onYouTubeIframeAPIReady () {
  const audios = document.querySelectorAll('[data-video]')

  audios.forEach(($element) => {
    let player = new Player($element)
  })
}
