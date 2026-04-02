class Video {
  constructor($videoContainer) {
    this.$container = $videoContainer;
    this.isLoading = true;
    this.isInitialized = false;
    this.currentVideoIndex = 0;
    this.isSwitching = false;
    this._isMobile = null;

    this.render();
  }

  createVideoElement(src, index, poster) {
    const videoElement = document.createElement("video");
    const sourceElement = document.createElement("source");

    sourceElement.src = src;
    sourceElement.type = "video/mp4";

    videoElement.playsInline = false;
    videoElement.controls = this.isMobile();
    videoElement.poster = poster;

    videoElement.preload = index === 0 ? "metadata" : "none";

    videoElement.appendChild(sourceElement);

    if (index === 0) {
      videoElement.classList.add("is-active");
    }

    return videoElement;
  }

  createVideoButton(index) {
    const button = document.createElement("button");
    button.className = "video__videoButton";
    button.textContent = index + 1;

    if (index === 0) {
      button.classList.add("is-active");
    }

    button.addEventListener("click", () =>
      this.switchVideo(index, { play: true }),
    );
    return button;
  }

  createVideoButtons() {
    const videoButtons = document.createElement("div");
    videoButtons.className = "video__videoButtons";

    this.videoElements.forEach((_, index) => {
      const button = this.createVideoButton(index);
      videoButtons.appendChild(button);
    });

    let $el = this.$container.querySelector(".video__controlsMain");

    if (this.isMobile()) {
      $el = document.body.querySelector(".video__controlsMobile");
    }

    if ($el) {
      $el.appendChild(videoButtons);
    }
  }

  async switchVideo(index, options = {}) {
    if (this.isSwitching) {
      return;
    }

    if (index === this.currentVideoIndex) {
      const video = this.videoElements[index];
      if (video.paused && options?.play) {
        video.play().catch(() => {});
        this.control.updatePlayState(true);
      }
      return;
    }

    this.isSwitching = true;

    const buttons = document.body.querySelectorAll(".video__videoButton");

    buttons.forEach((button, i) => {
      button.classList.toggle("is-active", i === index);
    });

    const currentVideo = this.videoElements[this.currentVideoIndex];
    const newVideo = this.videoElements[index];
    const shouldPlay = options?.play || !currentVideo.paused;

    try {
      if (newVideo.readyState < 2) {
        this.showLoadingState();
        if (newVideo.preload === "none") {
          newVideo.load();
        }
        await new Promise((resolve) => {
          newVideo.addEventListener("canplay", resolve, { once: true });
        });
        this.hideLoadingState();
      }

      newVideo.currentTime = 0;

      if (newVideo.seeking) {
        await new Promise((resolve) => {
          newVideo.addEventListener("seeked", resolve, { once: true });
        });
      }

      newVideo.classList.add("is-active");

      this.updateVideoComponents(newVideo);

      if (shouldPlay) {
        this.isPlaying = true;
        this.control.updatePlayState(true);

        try {
          await newVideo.play();
        } catch (e) {
          if (e.name !== "AbortError") {
            console.error("Error playing the video:", e);
          }
          this.isPlaying = false;
          this.control.updatePlayState(false);
        }
      }

      const oldIndex = this.currentVideoIndex;
      this.currentVideoIndex = index;

      setTimeout(() => {
        if (this.currentVideoIndex !== oldIndex) {
          currentVideo.pause();
          currentVideo.classList.remove("is-active");
        }
      }, 400);
    } catch (error) {
      console.error("Error switching video:", error);
    } finally {
      this.isSwitching = false;
    }
  }

  bindEvents() {
    this.videoElements.forEach((video, index) => {
      video.addEventListener("loadstart", () => {
        if (this.isInitialized) this.showLoadingState();
      });
      video.addEventListener("canplay", () => {
        if (this.isInitialized) this.hideLoadingState();
      });
      video.addEventListener("waiting", () => {
        if (this.isInitialized) this.showLoadingState();
      });
      video.addEventListener("canplaythrough", () => {
        if (this.isInitialized) this.hideLoadingState();
      });
      video.addEventListener("ended", async () => {
        if (index < this.videoElements.length - 1) {
          this.isPlaying = true;
          await this.switchVideo(index + 1, { play: true });
        } else {
          this.isPlaying = false;
          this.control.updatePlayState(false);
        }
      });
    });
  }

  isMobile() {
    if (this._isMobile === null) {
      this._isMobile =
        "ontouchstart" in window ||
        window.matchMedia("(pointer: coarse)").matches;
    }
    return this._isMobile;
  }

  showLoadingState() {
    if (this._loadingDebounce) {
      clearTimeout(this._loadingDebounce);
    }
    this._loadingDebounce = setTimeout(() => {
      if (this.isLoading) return;
      this.isLoading = true;
      this.$container.classList.add("is-loading");
      this.spinner.show();
      this.timeline.setLoading(true);
      this.control.setLoading(true);
      this.time.setLoading(true);
    }, 250);
  }

  hideLoadingState() {
    if (this._loadingDebounce) {
      clearTimeout(this._loadingDebounce);
      this._loadingDebounce = null;
    }
    this.isLoading = false;
    this.$container.classList.remove("is-loading");
    this.spinner.hide();
    this.timeline.setLoading(false);
    this.control.setLoading(false);
    this.time.setLoading(false);
  }

  initLazyLoading() {
    if ("IntersectionObserver" in window) {
      const options = {
        root: null,
        rootMargin: "200px",
        threshold: 0,
      };

      const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !this.isInitialized) {
            this.initializeVideo();
            observer.unobserve(this.$container);
          }
        });
      }, options);

      observer.observe(this.$container);
    } else {
      this.initializeVideo();
    }
  }

  initializeVideo() {
    if (this.isInitialized) {
      return;
    }

    this.isInitialized = true;

    this.videoElements[0].load();

    this.showLoadingState();
  }

  updateVideoComponents(video) {
    this.time.setVideo(video);
    this.timeline.setVideo(video);
    this.control.setVideo(video);
  }

  renderVideoComponents(video) {
    this.time = new TimeDisplay(this.$container, video, {
      isLoading: this.isLoading,
    });

    this.timeline = new Timeline(this.$container, video, this.time, {
      isLoading: this.isLoading,
    });

    this.control = new Control(this.$container, video, {
      isLoading: this.isLoading,
    });
  }

  renderVideoElements(videoSources, poster) {
    this.videoElements = videoSources.map((src, index) => {
      return this.createVideoElement(src, index, poster);
    });

    this.videoElements.forEach((video) => {
      this.$container.appendChild(video);
    });

    if (this.videoElements.length > 1) {
      this.createVideoButtons();
    }
  }

  render() {
    const aspectRatio = this.$container.getAttribute("data-aspect-ratio");
    if (aspectRatio) {
      this.$container.style.aspectRatio = aspectRatio;
    }

    const videoSources = this.$container
      .getAttribute("data-videos")
      .split("|");
    const poster = this.$container.getAttribute("data-poster");

    const $overlay = this.$container.querySelector(".video__controlOverlay");
    this.spinner = new Spinner();
    $overlay.appendChild(this.spinner.$element);

    this.renderVideoElements(videoSources, poster);
    this.renderVideoComponents(this.videoElements[0]);
    this.bindEvents();

    this.initLazyLoading();
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const $videoContainers = document.querySelectorAll(".video");

  $videoContainers.forEach(($videoContainer) => {
    new Video($videoContainer);
  });
});
