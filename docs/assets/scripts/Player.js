function onYouTubeIframeAPIReady() {
  let audio = document.getElementById("youtube-audio")
  let  $el = document.createElement("div")
  $el.innerHTML = '...'

  audio.appendChild($el)
  $el.classList.add('Player')

  let $div = document.createElement("div")

  $div.setAttribute("id", "youtube-player"), audio.appendChild($div)

  let o = function (e) {
    if (e) {
      $el.innerHTML = 'Stop'
    } else {
      $el.innerHTML = 'Play'
    }
  };

  audio.onclick = function() {
    if (player.getPlayerState() === YT.PlayerState.PLAYING || player.getPlayerState() === YT.PlayerState.BUFFERING) {
      player.pauseVideo()
      o(0)
    } else { 
      player.playVideo()
      o(1)
    }
  }

  let dataset = audio.dataset

  let player = new YT.Player("youtube-player", {
    height: "0",
    width: "0",
    videoId: dataset.video,
    playerlets: {
      autoplay: dataset.autoplay,
      loop: dataset.loop
    },
    events: {
      onReady: function(e) {
        player.setPlaybackQuality("small"), o(player.getPlayerState() !== YT.PlayerState.CUED)
      },
      onStateChange: function(e) {
        audio.data === YT.PlayerState.ENDED && o(!1)
      }
    }
  })
}
