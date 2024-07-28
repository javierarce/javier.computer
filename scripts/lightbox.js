class Lightbox {
  constructor() {
    if (!document.querySelector(".enable-lightbox")) return;

    this.injectMarkup();
    this.lightbox = document.querySelector(".Lightbox");
    this.$image = document.querySelector(".Lightbox__image");
    this.spinner = document.querySelector(".Spinner");
    this.$close = document.querySelector(".Lightbox__button.is-close");
    this.$prev = document.querySelector(".Lightbox__button.is-prev");
    this.$next = document.querySelector(".Lightbox__button.is-next");
    this.photos = Array.from(document.querySelectorAll(".Photo"));
    this.currentIndex = 0;

    this.bindEvents();
  }

  injectMarkup() {
    const lightboxMarkup = `
      <div class="Lightbox">
        <button class="Lightbox__button is-close"></button>
        <div class="Lightbox__content">
          <div class="Lightbox__imageContainer">
            <img src="" alt="" class="Lightbox__image">
            <div class="Spinner is-lightbox"></div>
          </div>
        </div>
        <button class="Lightbox__button is-prev"></button>
        <button class="Lightbox__button is-next"></button>
      </div>
    `;

    document.body.insertAdjacentHTML("beforeend", lightboxMarkup);
  }

  bindEvents() {
    this.photos.forEach((photo, index) => {
      photo.addEventListener("click", () => this.open(index));
    });

    this.$close.addEventListener("click", () => this.close());
    this.$prev.addEventListener("click", (e) => {
      e.preventDefault();
      this.navigatePhoto(-1);
    });
    this.$next.addEventListener("click", (e) => {
      e.preventDefault();
      this.navigatePhoto(1);
    });

    this.lightbox.addEventListener("click", (e) => {
      if (e.target === this.lightbox) {
        this.close();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (!this.lightbox.classList.contains("is-active")) return;

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

    this.$image.addEventListener("load", () => {
      this.spinner.style.display = "none";
      this.$image.style.opacity = "1";
      this.$image.classList.add("is-loaded");
    });
  }

  open(index) {
    this.currentIndex = index;
    const src = this.photos[this.currentIndex]
      .querySelector("img.lazy")
      .getAttribute("data-src");
    this.lightbox.classList.add("is-active");
    this.spinner.style.display = "block";
    this.$image.style.opacity = "0";
    this.$image.src = src;
    document.body.style.overflow = "hidden";
    this.updateNavButtons();
  }

  close() {
    this.lightbox.classList.remove("is-active");
    document.body.style.overflow = "";

    setTimeout(() => {
      this.$image.src = "";
      this.$image.classList.remove("is-loaded");
      this.spinner.style.display = "block";
    }, 300);
  }

  navigatePhoto(direction) {
    this.currentIndex =
      (this.currentIndex + direction + this.photos.length) % this.photos.length;
    this.open(this.currentIndex);
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
