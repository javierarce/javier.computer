// Loaded before the stylesheet so a saved preference applies before first paint.
(() => {
  const storageKey = "theme";
  const root = document.documentElement;
  const themeColor = document.querySelector('meta[name="theme-color"]');

  function apply(theme) {
    const light = theme === "light";
    root.dataset.theme = light ? "light" : "dark";
    if (themeColor) themeColor.content = light ? "#ffffff" : "#000000";
    document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
      button.setAttribute("aria-checked", String(light));
      button.title = light ? "Cambiar a modo oscuro" : "Cambiar a modo claro";
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
    apply(root.dataset.theme);
  });

  // Delegate immediately so the switch works as soon as its HTML is parsed,
  // even while deferred scripts are still holding up DOMContentLoaded.
  document.addEventListener("click", (event) => {
    if (!(event.target instanceof Element) || !event.target.closest("[data-theme-toggle]")) return;
    const theme = root.dataset.theme === "light" ? "dark" : "light";
    apply(theme);
    try {
      localStorage.setItem(storageKey, theme);
    } catch {
      // Keep the current page usable even when preferences cannot be saved.
    }
  });

  window.addEventListener("storage", (event) => {
    if (event.key === storageKey || event.key === null) {
      apply(event.newValue);
    }
  });
})();
