(function () {
  const nav = document.getElementById("years");
  if (!nav) return;

  const dateList = nav.parentElement;
  if (!dateList) return;

  const cache = new Map();
  const firstYearItem = nav.querySelector(".date-list__years-item");
  const firstYear = firstYearItem ? firstYearItem.textContent.trim() : "";

  function getMonthsFromDoc(doc) {
    return Array.from(doc.querySelectorAll(".date-list__month"));
  }

  function currentMonths() {
    return Array.from(dateList.querySelectorAll(".date-list__month"));
  }

  function swap(url, push) {
    const fetchUrl = url.split("#")[0];

    const apply = (doc) => {
      const newMonths = getMonthsFromDoc(doc);
      currentMonths().forEach((el) => el.remove());

      const fragment = document.createDocumentFragment();
      newMonths.forEach((el) =>
        fragment.appendChild(document.importNode(el, true)),
      );
      dateList.appendChild(fragment);

      const targetYear = (doc.querySelector(
        ".date-list__years-item.is-selected",
      ) || {}).textContent;

      if (targetYear) {
        nav.querySelectorAll(".date-list__years-item").forEach((item) => {
          const text = item.textContent.trim();
          const isSelected = text === targetYear.trim();
          if (isSelected && item.tagName === "A") {
            const span = document.createElement("span");
            span.className = "date-list__years-item is-selected";
            span.textContent = text;
            item.replaceWith(span);
          } else if (!isSelected && item.tagName === "SPAN") {
            const a = document.createElement("a");
            a.className = "date-list__years-item";
            a.href = text === firstYear ? "/posts#years" : `/posts/${text}#years`;
            a.textContent = text;
            item.replaceWith(a);
          }
        });
      }

      if (push) {
        history.pushState({ archiveUrl: url }, "", url);
      }
    };

    if (cache.has(fetchUrl)) {
      apply(cache.get(fetchUrl));
      return;
    }

    fetch(fetchUrl, { credentials: "same-origin" })
      .then((res) => res.text())
      .then((html) => {
        const doc = new DOMParser().parseFromString(html, "text/html");
        cache.set(fetchUrl, doc);
        apply(doc);
      })
      .catch(() => {
        window.location.href = url;
      });
  }

  nav.addEventListener("click", (event) => {
    const link = event.target.closest("a.date-list__years-item");
    if (!link) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (event.button && event.button !== 0) return;

    event.preventDefault();
    swap(link.getAttribute("href"), true);
  });

  window.addEventListener("popstate", (event) => {
    const url =
      (event.state && event.state.archiveUrl) || window.location.pathname;
    swap(url, false);
  });

  history.replaceState({ archiveUrl: window.location.pathname }, "");
})();
