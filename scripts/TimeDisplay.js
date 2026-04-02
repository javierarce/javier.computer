class TimeDisplay {
  constructor($container, video, options = {}) {
    this.$currentTimeDisplay = $container.querySelector(".video__currentTime");
    this.$totalTimeDisplay = $container.querySelector(".video__totalTime");
    this.video = video;
    this.isLoading = options.isLoading || false;

    this._bindVideoEvents();
  }

  _bindVideoEvents() {
    this._onTimeUpdate = this.updateDisplay.bind(this);
    this._onLoadedMetadata = this.updateDisplay.bind(this);

    this.video.addEventListener("timeupdate", this._onTimeUpdate);
    this.video.addEventListener("loadedmetadata", this._onLoadedMetadata);
  }

  formatTime(timeInSeconds) {
    if (isNaN(timeInSeconds) || timeInSeconds === Infinity) {
      return "0:00";
    }
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }

  updateDisplay() {
    const currentTime = this.isLoading ? 0 : this.video.currentTime;
    const duration = this.video.duration;

    this.$currentTimeDisplay.textContent = this.formatTime(currentTime);

    if (isNaN(duration) || duration === Infinity) {
      this.$totalTimeDisplay.textContent = "0:00";
    } else {
      this.$totalTimeDisplay.textContent = this.formatTime(duration);
    }
  }

  setCurrentTime(time) {
    this.$currentTimeDisplay.textContent = this.formatTime(time);
  }

  setLoading(isLoading) {
    this.isLoading = isLoading;
    this.updateDisplay();
  }

  setVideo(video) {
    this.video.removeEventListener("timeupdate", this._onTimeUpdate);
    this.video.removeEventListener("loadedmetadata", this._onLoadedMetadata);

    this.video = video;
    this._bindVideoEvents();
    this.updateDisplay();
  }
}
