class Timeline {
  constructor($container, video, time, options = {}) {
    this.$container = $container;
    this.$timeline = $container.querySelector(".video__timelineContainer");
    this.$progress = $container.querySelector(".video__progress");
    this.video = video;
    this.time = time;
    this.isLoading = options.isLoading || false;
    this.isDragging = false;
    this._animFrameId = null;
    this._cachedPadding = null;

    this.bindEvents();
  }

  _cacheTimelinePadding() {
    const computedStyle = window.getComputedStyle(this.$timeline);
    this._cachedPadding = {
      left: parseFloat(computedStyle.paddingLeft),
      right: parseFloat(computedStyle.paddingRight),
    };
  }

  bindEvents() {
    this.$timeline.addEventListener(
      "click",
      this.handleTimelineClick.bind(this),
    );
    this.$timeline.addEventListener(
      "mousemove",
      this.handleTimelineHover.bind(this),
    );
    this.$timeline.addEventListener(
      "mouseleave",
      this.handleTimelineLeave.bind(this),
    );

    this.$timeline.addEventListener(
      "mousedown",
      this.handleDragStart.bind(this),
    );
    document.addEventListener("mousemove", this.handleDragMove.bind(this));
    document.addEventListener("mouseup", this.handleDragEnd.bind(this));

    this.$timeline.addEventListener(
      "touchstart",
      this.handleDragStart.bind(this),
      { passive: false },
    );
    document.addEventListener("touchmove", this.handleDragMove.bind(this), {
      passive: false,
    });
    document.addEventListener("touchend", this.handleDragEnd.bind(this));

    window.addEventListener("resize", () => {
      this._cachedPadding = null;
    });

    this.video.addEventListener("timeupdate", () => {
      if (!this._animFrameId) {
        this.startProgressLoop();
      }
    });

    this.video.addEventListener("play", () => this.startProgressLoop());
    this.video.addEventListener("pause", () => this.stopProgressLoop());
    this.video.addEventListener("ended", () => this.stopProgressLoop());
  }

  startProgressLoop() {
    if (this._animFrameId) return;
    const loop = () => {
      this.updateProgress();
      this._animFrameId = requestAnimationFrame(loop);
    };
    this._animFrameId = requestAnimationFrame(loop);
  }

  stopProgressLoop() {
    if (this._animFrameId) {
      cancelAnimationFrame(this._animFrameId);
      this._animFrameId = null;
    }
    this.updateProgress();
  }

  calculateTimelineHoverPosition(e) {
    const rect = this.$timeline.getBoundingClientRect();

    if (!this._cachedPadding) {
      this._cacheTimelinePadding();
    }

    const clickableWidth =
      rect.width - this._cachedPadding.left - this._cachedPadding.right;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;

    return Math.max(
      0,
      Math.min(
        1,
        (clientX - rect.left - this._cachedPadding.left) / clickableWidth,
      ),
    );
  }

  handleTimelineClick(e) {
    if (this.isDragging) return;

    e.preventDefault();
    e.stopPropagation();

    if (this.isLoading) {
      return;
    }

    const pos = this.calculateTimelineHoverPosition(e);
    this.video.currentTime = pos * this.video.duration;
    this.updateProgress();
  }

  handleDragStart(e) {
    if (this.isLoading) return;
    this.isDragging = true;
    this._wasPlaying = !this.video.paused;
    this.video.pause();
    this.$timeline.classList.add("is-dragging");

    const pos = this.calculateTimelineHoverPosition(e);
    this.video.currentTime = pos * this.video.duration;
    this.updateProgress();

    e.preventDefault();
  }

  handleDragMove(e) {
    if (!this.isDragging) return;

    const pos = this.calculateTimelineHoverPosition(e);
    this.video.currentTime = pos * this.video.duration;
    this.updateProgress();
    this.time.setCurrentTime(this.video.currentTime);

    e.preventDefault();
  }

  handleDragEnd() {
    if (!this.isDragging) return;
    this.isDragging = false;
    this.$timeline.classList.remove("is-dragging");

    if (this._wasPlaying) {
      this.video.play().catch(() => {});
    }
  }

  handleTimelineLeave() {
    this.$timeline.style.removeProperty("--hover-position");
    this.time.setCurrentTime(this.video.currentTime);
  }

  handleTimelineHover(e) {
    if (this.isDragging) return;

    const pos = this.calculateTimelineHoverPosition(e);
    this.$timeline.style.setProperty("--hover-position", `${pos * 100}%`);

    if (!this.video.paused) {
      return;
    }

    const duration = this.video.duration * pos;
    this.time.setCurrentTime(duration);
  }

  updateProgress() {
    if (isNaN(this.video.duration)) return;
    const progress = this.video.currentTime / this.video.duration;
    this.$progress.style.transform = `scaleX(${progress})`;
  }

  setLoading(isLoading) {
    this.isLoading = isLoading;
  }

  setVideo(video) {
    this.video.removeEventListener("timeupdate", this._onTimeUpdate);
    this.video.removeEventListener("play", this._onPlay);
    this.video.removeEventListener("pause", this._onPause);
    this.video.removeEventListener("ended", this._onEnded);

    this.stopProgressLoop();
    this.video = video;
    this._bindVideoEvents();
    this.updateProgress();
  }

  _bindVideoEvents() {
    this._onTimeUpdate = () => {
      if (!this._animFrameId) {
        this.startProgressLoop();
      }
    };
    this._onPlay = () => this.startProgressLoop();
    this._onPause = () => this.stopProgressLoop();
    this._onEnded = () => this.stopProgressLoop();

    this.video.addEventListener("timeupdate", this._onTimeUpdate);
    this.video.addEventListener("play", this._onPlay);
    this.video.addEventListener("pause", this._onPause);
    this.video.addEventListener("ended", this._onEnded);
  }
}
