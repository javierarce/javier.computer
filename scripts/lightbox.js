class Lightbox {
  constructor() {
    if (!document.querySelector(".has-lightbox")) {
      return;
    }

    this.BREAKPOINT_MOBILE = 640;
    this.BREAKPOINT_NARROW_DESKTOP = 1280;
    this.DELAY = 300;

    this.injectMarkup();

    this.lightbox = document.querySelector(".lightbox");
    this.$image = document.querySelector(".lightbox__image");
    this.spinner = document.querySelector(".spinner");
    this.$close = document.querySelector(".lightbox__button.is-close");
    this.$caption = document.querySelector(".lightbox__caption");
    this.$prev = document.querySelector(".lightbox__button.is-prev");
    this.$next = document.querySelector(".lightbox__button.is-next");
    this.photos = Array.from(document.querySelectorAll(".photo"));

    this.currentIndex = 0;
    this.isLoading = false;
    this.isOpen = false;

    this.bindEvents();
  }

  injectMarkup() {
    const lightboxMarkup = `
      <div class="lightbox" role="dialog" aria-label="Image viewer" aria-modal="true">
        <button class="lightbox__button is-close" aria-label="Close"></button>
        <div class="lightbox__content">
          <div class="lightbox__imageContainer">
            <img src="" alt="" title="" class="lightbox__image">
            <div class="lightbox__caption" aria-live="polite"></div>
          </div>
        </div>
        <button class="lightbox__button is-prev" aria-label="Previous image"></button>
        <button class="lightbox__button is-next" aria-label="Next image"></button>
        <div class="spinner is-lightbox" aria-hidden="true"></div>
      </div>
    `;

    document.body.insertAdjacentHTML("beforeend", lightboxMarkup);
  }

  preloadAdjacentImages() {
    const preloadNext = (this.currentIndex + 1) % this.photos.length;
    const preloadPrev =
      (this.currentIndex - 1 + this.photos.length) % this.photos.length;

    [preloadNext, preloadPrev].forEach((index) => {
      const img = new Image();
      const picture = this.photos[index].querySelector("picture");
      const srcset = picture.querySelector("source[type='image/webp']")
        ? picture
            .querySelector("source[type='image/webp']")
            .getAttribute("data-srcset")
        : picture
            .querySelector("source:not([type])")
            .getAttribute("data-srcset");
      img.src = this.getHighestResolutionImage(srcset);
    });
  }

  bindEvents() {
    this.photos.forEach((photo, index) => {
      photo.addEventListener("click", () => this.open(index), {
        passive: true,
      });
    });

    this.$close.addEventListener("click", () => this.close(), {
      passive: true,
    });

    this.$prev.addEventListener("click", (e) => {
      e.preventDefault();
      this.navigatePhoto(-1);
    });

    this.$next.addEventListener("click", (e) => {
      e.preventDefault();
      this.navigatePhoto(1);
    });

    this.lightbox.addEventListener(
      "click",
      (e) => {
        const isButton = e.target.closest(".lightbox__button");
        const isImage = e.target === this.$image;
        if (!isButton && !isImage) {
          this.close();
        }
      },
      { passive: true },
    );

    document.addEventListener("keydown", (e) => {
      if (!this.lightbox.classList.contains("is-active")) {
        return;
      }

      switch (e.key) {
        case "ArrowLeft":
          this.navigatePhoto(-1);
          break;
        case "ArrowRight":
          this.navigatePhoto(1);
          break;
        case "Escape":
          this.close();
          break;
        case "Tab":
          this.trapFocus(e);
          break;
      }
    });

    this.lightbox.addEventListener(
      "mouseenter",
      () => {
        this.lightbox.classList.remove("hide-ui");
      },
      { passive: true },
    );

    this.lightbox.addEventListener(
      "mouseleave",
      () => {
        this.lightbox.classList.add("hide-ui");
      },
      { passive: true },
    );

  }

  isMobile() {
    return window.innerWidth <= this.BREAKPOINT_MOBILE;
  }

  isNarrowScreen() {
    return window.innerWidth <= this.BREAKPOINT_NARROW_DESKTOP;
  }

  getHighestResolutionImage(srcset) {
    const srcsetEntries = srcset.split(",").map((entry) => entry.trim());
    let highestResImage = srcsetEntries[0].split(/\s+/)[0];
    let highestResValue = 0;

    for (const entry of srcsetEntries) {
      const parts = entry.split(/\s+/);
      const url = parts[0];
      const resValue = parseInt(parts[1], 10);

      if (this.isMobile() && resValue <= this.BREAKPOINT_MOBILE) {
        return url;
      } else if (
        this.isNarrowScreen() &&
        !this.isMobile() &&
        resValue <= this.BREAKPOINT_NARROW_DESKTOP
      ) {
        return url;
      } else if (
        !this.isMobile() &&
        !this.isNarrowScreen() &&
        resValue > highestResValue
      ) {
        highestResValue = resValue;
        highestResImage = url;
      }
    }

    return highestResImage;
  }

  getSrcsetForIndex(index) {
    const picture = this.photos[index].querySelector("picture");
    return picture.querySelector("source[type='image/webp']")
      ? picture
          .querySelector("source[type='image/webp']")
          .getAttribute("data-srcset")
      : picture
          .querySelector("source:not([type])")
          .getAttribute("data-srcset");
  }

  updateSpinner() {
    this.spinner.style.display = this.isLoading ? "block" : "none";
  }

  loadImage(srcset) {
    const url = this.getHighestResolutionImage(srcset);
    const probe = new Image();

    this.$image.classList.remove("is-loaded");
    this.isLoading = true;
    this.updateSpinner();

    probe.src = url;
    const show = () => {
      probe.decode().then(() => {
        this.$image.src = url;
        this.isLoading = false;
        this.updateSpinner();
        this.$image.offsetHeight;
        this.$image.style.opacity = "1";
        this.$image.classList.add("is-loaded");
        this.$image.classList.remove("is-opening");
      });
    };

    if (probe.complete) {
      show();
    } else {
      probe.onload = show;
    }
  }

  open(index) {
    this.currentIndex = index;

    const picture = this.photos[this.currentIndex].querySelector("picture");
    const srcset = this.getSrcsetForIndex(index);

    requestAnimationFrame(() => {
      this.title = picture.querySelector("img").title;
      this.caption = picture.querySelector("img").dataset.caption;
      this.alt = picture.querySelector("img").getAttribute("alt");

      this.$image.style.opacity = "0";
      this.$image.classList.remove("is-loaded");

      if (!this.isOpen) {
        this.$image.classList.add("is-opening");
        this.lightbox.classList.add("is-active");
        this.previouslyFocused = document.activeElement;
        const scrollY = window.scrollY;
        document.body.style.overflowY = "scroll";
        document.body.style.position = "fixed";
        document.body.style.width = "100%";
        document.body.style.top = `-${scrollY}px`;
        this.isOpen = true;
      }

      this.loadImage(srcset);
      this.$close.focus();
      this.updateMetadata();
      this.updateNavButtons();
      this.preloadAdjacentImages();
    });
  }

  close() {
    const scrollY = document.body.style.top;
    this.lightbox.classList.remove("is-active");
    this.isOpen = false;
    if (this.previouslyFocused) {
      this.previouslyFocused.focus();
      this.previouslyFocused = null;
    }
    document.body.style.overflowY = "";
    document.body.style.position = "";
    document.body.style.width = "";
    document.body.style.top = "";
    window.scrollTo(0, parseInt(scrollY || "0") * -1);

    setTimeout(() => {
      this.$image.src = "";
      this.$image.classList.remove("is-loaded");
      this.isLoading = false;
      this.updateSpinner();
    }, this.DELAY);
  }

  navigatePhoto(direction) {
    const newIndex = this.currentIndex + direction;
    if (newIndex < 0 || newIndex >= this.photos.length) {
      return;
    }

    // Fade out the current image, then load the new one with some overlap
    this.$image.style.opacity = "0";
    this.$caption.classList.remove("is-visible");

    this.currentIndex = newIndex;
    const picture = this.photos[this.currentIndex].querySelector("picture");
    const srcset = this.getSrcsetForIndex(this.currentIndex);

    this.title = picture.querySelector("img").title;
    this.caption = picture.querySelector("img").dataset.caption;
    this.alt = picture.querySelector("img").getAttribute("alt");

    setTimeout(() => {
      this.loadImage(srcset);
      this.updateMetadata();
      this.updateNavButtons();
      this.preloadAdjacentImages();
    }, this.DELAY / 4);
  }

  updateMetadata() {
    if (this.alt) {
      this.$image.setAttribute("alt", this.alt);
    }

    if (this.title) {
      this.$image.setAttribute("title", this.title);
    }

    if (!this.caption) {
      this.$caption.classList.remove("is-visible");
    } else {
      this.$caption.textContent = this.caption;

      setTimeout(() => {
        this.$caption.classList.add("is-visible");
      }, this.DELAY);
    }
  }

  trapFocus(e) {
    const focusable = this.lightbox.querySelectorAll(
      'button:not([style*="display: none"])',
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  updateNavButtons() {
    this.$prev.style.display = this.currentIndex > 0 ? "block" : "none";
    this.$next.style.display =
      this.currentIndex < this.photos.length - 1 ? "block" : "none";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new Lightbox();
});
