class Lightbox {
  constructor() {
    if (!document.querySelector(".has-lightbox")) {
      return;
    }

    this.BREAKPOINT_MOBILE = 640;
    this.BREAKPOINT_NARROW_DESKTOP = 1280;
    this.DELAY = 300;

    this.injectMarkup();

    this.lightbox = document.querySelector(".Lightbox");
    this.$image = document.querySelector(".Lightbox__image");
    this.spinner = document.querySelector(".Spinner");
    this.$close = document.querySelector(".Lightbox__button.is-close");
    this.$caption = document.querySelector(".Lightbox__caption");
    this.$prev = document.querySelector(".Lightbox__button.is-prev");
    this.$next = document.querySelector(".Lightbox__button.is-next");
    this.photos = Array.from(document.querySelectorAll(".Photo"));

    this.currentIndex = 0;
    this.isLoading = false;

    this.bindEvents();
  }

  injectMarkup() {
    const lightboxMarkup = `
      <div class="Lightbox">
        <button class="Lightbox__button is-close"></button>
        <div class="Lightbox__content">
          <div class="Lightbox__imageContainer">
            <img src="" alt="" title="" class="Lightbox__image">
            <div class="Lightbox__caption"></div>
          </div>
        </div>
        <button class="Lightbox__button is-prev"></button>
        <button class="Lightbox__button is-next"></button>
        <div class="Spinner is-lightbox"></div>
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
        if (e.target === this.lightbox) {
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

    this.$image.addEventListener("load", () => {
      this.isLoading = false;
      this.updateSpinner();
      this.$image.style.opacity = "1";
      this.$image.classList.add("is-loaded");
    });
  }

  isMobile() {
    return window.innerWidth <= this.BREAKPOINT_MOBILE;
  }

  isNarrowScreen() {
    return window.innerWidth <= this.BREAKPOINT_NARROW_DESKTOP;
  }

  getHighestResolutionImage(srcset) {
    const srcsetEntries = srcset.split(",").map((entry) => entry.trim());
    let highestResImage = srcsetEntries[0].match(
      /(https:\/\/img.javier.computer\/.*?\.webp)/,
    )[1];
    let highestResValue = 0;

    for (const entry of srcsetEntries) {
      const match = entry.match(
        /(https:\/\/img.javier.computer\/.*?\.webp) (\d*?)w/,
      );
      const url = match[1];
      const resValue = parseInt(match[2], 10);

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

  updateSpinner() {
    this.spinner.style.display = this.isLoading ? "block" : "none";
  }

  open(index) {
    this.currentIndex = index;

    const picture = this.photos[this.currentIndex].querySelector("picture");
    const srcset = picture.querySelector("source[type='image/webp']")
      ? picture
          .querySelector("source[type='image/webp']")
          .getAttribute("data-srcset")
      : picture.querySelector("source:not([type])").getAttribute("data-srcset");

    requestAnimationFrame(() => {
      this.title = picture.querySelector("img").title;
      this.caption = picture.querySelector("img").dataset.caption;
      this.alt = picture.querySelector("img").getAttribute("alt");

      this.lightbox.classList.add("is-active");
      this.isLoading = true;
      this.updateSpinner();
      this.$image.src = this.getHighestResolutionImage(srcset);
      document.body.style.overflow = "hidden";
      this.updateMetadata();
      this.updateNavButtons();
      this.preloadAdjacentImages();
    });
  }

  close() {
    this.lightbox.classList.remove("is-active");
    document.body.style.overflow = "";

    setTimeout(() => {
      this.$image.src = "";
      this.$image.classList.remove("is-loaded");
      this.isLoading = false;
      this.updateSpinner();
    }, this.DELAY);
  }

  navigatePhoto(direction) {
    this.currentIndex =
      (this.currentIndex + direction + this.photos.length) % this.photos.length;
    this.open(this.currentIndex);
    this.preloadAdjacentImages();
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

  updateNavButtons() {
    this.$prev.style.display = this.currentIndex > 0 ? "block" : "none";
    this.$next.style.display =
      this.currentIndex < this.photos.length - 1 ? "block" : "none";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new Lightbox();
});
