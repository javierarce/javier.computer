class Video {
  constructor($videoContainer) {
    this.$container = $videoContainer;
    this.$video = this.$container.querySelector("video");
    this.$overlay = this.$container.querySelector(".control-overlay");
    this.$control = this.$container.querySelector(".control-button");

    this.$fullscreenButton =
      this.$container.querySelector(".fullscreen-button");

    this.$currentTimeDisplay = this.$container.querySelector(".current-time");
    this.$totalTimeDisplay = this.$container.querySelector(".total-time");
    this.$timeDisplay = this.$container.querySelector(".time-display");

    this.spinner = new Spinner("video-spinner");
    this.$overlay.appendChild(this.spinner.render());

    this.controlsTimeout;
    this.isFullscreen = false;
    this.isLoading = true;

    this.bindEvents();

    this.showLoadingState();
  }

  bindEvents() {
    document.addEventListener(
      "fullscreenchange",
      this.onFullScreenChange.bind(this),
    );
    this.$control.addEventListener("click", this.togglePlayPause.bind(this));
    this.$video.addEventListener("click", this.togglePlayPause.bind(this));
    this.$fullscreenButton.addEventListener(
      "click",
      this.toggleFullscreen.bind(this),
    );
    this.$video.addEventListener(
      "loadedmetadata",
      this.updateTimeDisplay.bind(this),
    );
    this.$video.addEventListener(
      "timeupdate",
      this.updateTimeDisplay.bind(this),
    );
    this.$video.addEventListener("ended", () => {
      this.$overlay.classList.remove("playing");
      this.$control.classList.remove("pause");
      this.showControls();
    });

    this.$container.addEventListener("mousemove", this.showControls.bind(this));
    this.$container.addEventListener(
      "touchstart",
      this.showControls.bind(this),
    );

    this.$video.addEventListener("loadstart", this.showLoadingState.bind(this));
    this.$video.addEventListener("canplay", this.hideLoadingState.bind(this));
    this.$video.addEventListener("waiting", this.showLoadingState.bind(this));
    this.$video.addEventListener(
      "canplaythrough",
      this.hideLoadingState.bind(this),
    );
  }

  showLoadingState() {
    this.isLoading = true;
    this.$container.classList.add("is-loading");
    this.spinner.show();
    this.updateTimeDisplay();
  }

  hideLoadingState() {
    this.isLoading = false;
    this.$container.classList.remove("is-loading");
    this.spinner.hide();
    this.updateTimeDisplay();
    if (!this.$video.paused) {
      this.$container.classList.add("is-playing");
    }
  }

  onMetadataLoaded() {
    this.updateTimeDisplay();
  }

  onFullScreenChange() {
    this.isFullscreen = !!document.fullscreenElement;
    if (this.isFullscreen) {
      this.startHideControlsTimer();
    } else {
      this.$container.classList.remove("hide-controls");
    }
  }

  togglePlayPause() {
    if (this.isLoading) return;

    if (this.$video.paused) {
      this.$video.play();
      this.$overlay.classList.add("playing");
      this.$control.classList.add("pause");
      this.$container.classList.add("is-playing");
    } else {
      this.$video.pause();
      this.$overlay.classList.remove("playing");
      this.$control.classList.remove("pause");
      this.$container.classList.remove("is-playing");
    }
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      if (this.$container.requestFullscreen) {
        this.$container.requestFullscreen();
      } else if (this.$container.mozRequestFullScreen) {
        this.$container.mozRequestFullScreen();
      } else if (this.$container.webkitRequestFullscreen) {
        this.$container.webkitRequestFullscreen();
      } else if (this.$container.msRequestFullscreen) {
        this.$container.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  }

  formatTime(timeInSeconds) {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }

  updateTimeDisplay() {
    if (this.$video.currentTime && this.$video.duration) {
      this.$currentTimeDisplay.textContent = this.formatTime(
        this.$video.currentTime,
      );

      this.$totalTimeDisplay.textContent = this.formatTime(
        this.$video.duration,
      );
    }
  }

  showControls() {
    this.$container.classList.add("show-controls");

    if (this.isFullscreen) {
      console.log("show controls");
      this.startHideControlsTimer();
    }
  }

  hideControls() {
    this.$container.classList.remove("show-controls");
  }

  startHideControlsTimer() {
    clearTimeout(this.controlsTimeout);
    this.controlsTimeout = setTimeout(() => {
      console.log("hide");
      this.hideControls();
    }, 1000);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const $videoContainers = document.querySelectorAll(".Video");
  $videoContainers.forEach(($videoContainer) => {
    new Video($videoContainer);
  });
});
