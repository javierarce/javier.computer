class Control {
  constructor($container, video, options = {}) {
    this.$container = $container;
    this.video = video;
    this.$overlay = $container.querySelector(".video__controlOverlay");
    this.$control = $container.querySelector(".video__controlButton");
    this.$fullscreenButton = $container.querySelector(
      ".video__fullscreenButton",
    );

    this.isLoading = options.isLoading || false;
    this.isFullscreen = false;
    this.controlsTimeout = null;

    this.initializeControls();
    this.bindEvents();
  }

  initializeControls() {
    this.$control.title = "Play";
    this.$fullscreenButton.title = "Full screen";
  }

  bindEvents() {
    document.addEventListener(
      "fullscreenchange",
      this.onFullScreenChange.bind(this),
    );
    this.$control.addEventListener("click", this.togglePlayPause.bind(this));
    this.video.addEventListener("click", this.togglePlayPause.bind(this));
    this.$overlay.addEventListener("click", this.togglePlayPause.bind(this));
    this.$fullscreenButton.addEventListener(
      "click",
      this.toggleFullscreen.bind(this),
    );

    this._onEnded = () => {
      this.$overlay.classList.remove("is-playing");
      this.$control.classList.remove("is-paused");
      this.$control.title = "Play";
      this.showControls();
    };
    this.video.addEventListener("ended", this._onEnded);

    this.$container.addEventListener("mousemove", this.showControls.bind(this));
    this.$container.addEventListener(
      "touchstart",
      this.showControls.bind(this),
      { passive: true },
    );
  }

  togglePlayPause(e) {
    e.preventDefault();
    e.stopPropagation();

    if (this.isLoading) {
      return;
    }

    if (this.video.paused) {
      this.video.play().catch((error) => {
        console.error("Play was prevented:", error);
      });
      this.$overlay.classList.add("is-playing");
      this.$control.classList.add("is-paused");
      this.$control.title = "Pause";
      this.$container.classList.add("is-playing");
    } else {
      this.video.pause();
      this.$overlay.classList.remove("is-playing");
      this.$control.classList.remove("is-paused");
      this.$control.title = "Play";
      this.$container.classList.remove("is-playing");
    }
  }

  toggleFullscreen(e) {
    e.preventDefault();
    e.stopPropagation();

    if (!document.fullscreenElement) {
      let request;
      if (this.$container.requestFullscreen) {
        request = this.$container.requestFullscreen();
      } else if (this.$container.webkitRequestFullscreen) {
        request = this.$container.webkitRequestFullscreen();
      }
      if (request && request instanceof Promise) {
        request.catch((error) => {
          console.error("Fullscreen request failed:", error);
        });
      }
      this.$fullscreenButton.title = "Exit fullscreen";
    } else {
      let exit;
      if (document.exitFullscreen) {
        exit = document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        exit = document.webkitExitFullscreen();
      }
      if (exit && exit instanceof Promise) {
        exit.catch((error) => {
          console.error("Exiting fullscreen failed:", error);
        });
      }
      this.$fullscreenButton.title = "Full screen";
    }
  }

  onFullScreenChange() {
    this.isFullscreen = !!document.fullscreenElement;
    if (this.isFullscreen) {
      this.startHideControlsTimer();
    } else {
      this.$container.classList.remove("hide-controls");
    }
  }

  showControls() {
    this.$container.classList.add("show-controls");

    if (this.isFullscreen) {
      this.startHideControlsTimer();
    }
  }

  hideControls() {
    this.$container.classList.remove("show-controls");
  }

  startHideControlsTimer() {
    clearTimeout(this.controlsTimeout);
    this.controlsTimeout = setTimeout(() => {
      this.hideControls();
    }, 1000);
  }

  setLoading(isLoading) {
    this.isLoading = isLoading;
    if (!isLoading && !this.video.paused) {
      this.$container.classList.add("is-playing");
    }
  }

  updatePlayState(isPlaying) {
    if (isPlaying) {
      this.$overlay.classList.add("is-playing");
      this.$control.classList.add("is-paused");
      this.$control.title = "Pause";
      this.$container.classList.add("is-playing");
    } else {
      this.$overlay.classList.remove("is-playing");
      this.$control.classList.remove("is-paused");
      this.$control.title = "Play";
      this.$container.classList.remove("is-playing");
    }
  }

  setVideo(video) {
    this.video.removeEventListener("click", this.togglePlayPause);
    this.video.removeEventListener("ended", this._onEnded);

    this.video = video;

    this.video.addEventListener("click", this.togglePlayPause.bind(this));
    this.video.addEventListener("ended", this._onEnded);
  }
}
