(function() {
  // The clear button on the search field, matching the one on the city maps.
  // It only means something once there is something to clear, so it stays
  // hidden while the field is empty.
  function setupForm(form) {
    var input = form.querySelector(".js-search-input");
    var clear = form.querySelector(".js-search-clear");

    if (!input || !clear) return;

    function sync() {
      clear.hidden = !input.value;
    }

    input.addEventListener("input", sync);

    clear.addEventListener("click", function() {
      input.value = "";
      sync();
      input.focus();
    });

    sync();
  }

  function init() {
    var forms = document.querySelectorAll(".js-search-form");
    for (var i = 0; i < forms.length; i++) {
      setupForm(forms[i]);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
