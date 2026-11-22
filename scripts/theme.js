// Loaded before the stylesheet so a saved preference applies before first paint.
(() => {
  const storageKey = "theme";
  const root = document.documentElement;
  let currentTheme = "dark";
  let activeTransition;
  const themeColor = document.querySelector('meta[name="theme-color"]');

  function apply(theme) {
    const light = theme === "light";
    currentTheme = light ? "light" : "dark";
    root.dataset.theme = currentTheme;
    if (themeColor) themeColor.content = light ? "#ffffff" : "#000000";
    document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
      button.setAttribute("aria-checked", String(light));
      button.title = light ? "Cambiar a modo oscuro" : "Cambiar a modo claro";
    });
  }

  function change(theme, animate = false) {
    currentTheme = theme === "light" ? "light" : "dark";
    activeTransition?.skipTransition();
    if (
      !animate ||
      !document.startViewTransition ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      activeTransition = null;
      root.classList.remove("is-changing-theme");
      apply(currentTheme);
      return;
    }

    root.classList.add("is-changing-theme");
    // Read the latest preference inside the callback so rapid clicks or a
    // storage event cannot let an older snapshot restore a stale theme.
    const transition = document.startViewTransition(() => apply(currentTheme));
    activeTransition = transition;
    transition.finished.catch(() => {}).finally(() => {
      if (activeTransition !== transition) return;
      activeTransition = null;
      root.classList.remove("is-changing-theme");
    });
  }

  let savedTheme;
  try {
    savedTheme = localStorage.getItem(storageKey);
  } catch {
    // Storage may be disabled; switching still works for this page.
  }
  apply(savedTheme);

  document.addEventListener("DOMContentLoaded", () => {
    apply(currentTheme);
  });

  // Delegate immediately so the switch works as soon as its HTML is parsed,
  // even while deferred scripts are still holding up DOMContentLoaded.
  document.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;
    const button = event.target.closest("[data-theme-toggle]");
    if (!button) return;
    // Release pointer focus so Space scrolls; keyboard activation keeps focus.
    if (event.detail > 0) button.blur();
    const theme = currentTheme === "light" ? "dark" : "light";
    change(theme, event.detail > 0);
    try {
      localStorage.setItem(storageKey, theme);
    } catch {
      // Keep the current page usable even when preferences cannot be saved.
    }
  });

  window.addEventListener("storage", (event) => {
    if (event.key === storageKey || event.key === null) {
      change(event.newValue);
    }
  });
})();
