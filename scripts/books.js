(() => {
  const scrollToBook = (hash) => {
    if (!hash || hash === "#") return;

    let target;
    try {
      target = document.querySelector(hash);
    } catch (err) {
      return;
    }
    if (!target) return;

    target.scrollIntoView({ behavior: "smooth", block: "start" });
    target.focus({ preventScroll: true });
  };

  const onReady = () => {
    if (window.location.hash) {
      const initialHash = window.location.hash;
      window.scrollTo({ top: 0, behavior: "auto" });
      window.setTimeout(() => scrollToBook(initialHash), 60);
    }

    window.addEventListener("hashchange", () => {
      scrollToBook(window.location.hash);
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", onReady);
  } else {
    onReady();
  }
})();
