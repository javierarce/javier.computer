let $code;
let $message;

let debounceTimer = null;
let lastSentCode = null;
let controller = null;

const codeLength = 4;
const URL = "https://api.javier.computer/zine/check";

const TIMEOUT = 100;

const createInputField = () => {
  const field = document.createElement("div");
  field.className = "input__field input--zine is-hidden";

  const input = document.createElement("input");
  input.type = "text";
  input.className = "input";

  input.setAttribute("autocapitalize", "none");
  input.setAttribute("autocomplete", "off");
  input.setAttribute("autocorrect", "off");
  input.setAttribute("spellcheck", "false");

  field.appendChild(input);

  return field;
};

const createSeparator = () => {
  const separator = document.createElement("div");
  separator.className = "input__separator is-hidden";
  return separator;
};

const showCode = () => {
  const $fields = $code.getElementsByClassName("input__field");
  const $separators = $code.getElementsByClassName("input__separator");

  let delayIndex = 0;

  for (let i = 0; i < $fields.length; i++) {
    $fields[i].style.transitionDelay = TIMEOUT * delayIndex + "ms";
    setTimeout(() => {
      $fields[i].classList.remove("is-hidden");
    }, TIMEOUT * delayIndex);
    delayIndex++;

    // Add separator after each field except the last one
    if (i < $separators.length) {
      $separators[i].style.transitionDelay = TIMEOUT * delayIndex + "ms";
      setTimeout(() => {
        $separators[i].classList.remove("is-hidden");
      }, TIMEOUT * delayIndex);
      delayIndex++;
    }
  }
};

const hideCode = () => {
  const $fields = $code.getElementsByClassName("input__field");
  const $separators = $code.getElementsByClassName("input__separator");

  let delayIndex = 0;

  for (let i = 0; i < $fields.length; i++) {
    $fields[i].style.transitionDelay = TIMEOUT * delayIndex + "ms";
    $fields[i].classList.add("is-hidden");
    delayIndex++;

    if (i < $separators.length) {
      $separators[i].style.transitionDelay = TIMEOUT * delayIndex + "ms";
      $separators[i].classList.add("is-hidden");
      delayIndex++;
    }
  }
};

const showMessage = (data) => {
  $message.innerHTML = data.message.replace(/\n/g, "<br /><br />");
  $message.classList.add("is-visible");
};

const startLoading = () => {
  $code.classList.add("is-loading");
};

const stopLoading = () => {
  $code.classList.remove("is-loading");
};

const checkCode = ($fields) => {
  let code = [];

  for (let i = 0; i < $fields.length; i++) {
    const value = $fields[i].getElementsByTagName("input")[0].value;

    if (value) {
      code.push(value.trim());
    }
  }

  if (code.length !== codeLength) return;

  const joinedCode = code.join("-");

  if (joinedCode === lastSentCode) return;

  clearTimeout(debounceTimer);

  debounceTimer = setTimeout(() => {
    lastSentCode = joinedCode;

    if (controller) controller.abort();
    controller = new AbortController();

    startLoading();

    fetch(URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: joinedCode }),
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((data) => {
        stopLoading();
        if (data.valid) {
          hideCode();
          setTimeout(() => {
            showMessage(data.data);
          }, 800);
        }
      })
      .catch((err) => {
        stopLoading();
        if (err.name !== "AbortError") {
          console.error("Error:", err);
        }
      });
  }, 500);
};

const loadCode = () => {
  $code = document.getElementById("code");
  $message = document.getElementById("message");

  if (!$code) {
    return;
  }

  // Create input fields and separators
  for (let i = 0; i < codeLength; i++) {
    const $field = createInputField();
    $code.appendChild($field);

    // Add separator after each field except the last one
    if (i < codeLength - 1) {
      const $separator = createSeparator();
      $code.appendChild($separator);
    }
  }

  const $fields = $code.getElementsByClassName("input__field");

  showCode();

  for (let i = 0; i < $fields.length; i++) {
    const $input = $fields[i].getElementsByTagName("input")[0];

    $input.tabIndex = i + 1;

    $input.addEventListener("input", () => {
      $input.value = $input.value.toLowerCase();

      checkCode($fields);
    });

    $input.addEventListener("paste", (e) => {
      e.preventDefault();

      const pasteData = (e.clipboardData || window.clipboardData)
        .getData("text")
        .trim();

      if (!pasteData) return;

      const fieldIndex = $input.tabIndex - 1;
      const targetInput = $fields[fieldIndex].getElementsByTagName("input")[0];
      targetInput.value = pasteData;

      const nextIndex = (fieldIndex + 1) % $fields.length;
      $fields[nextIndex].getElementsByTagName("input")[0].focus();

      checkCode($fields);
    });

    $input.addEventListener("keydown", (e) => {
      if (e.key === "Tab") {
        e.preventDefault(); // stop normal tab behavior

        if (e.shiftKey) {
          const prevIndex = (i - 1 + $fields.length) % $fields.length;
          $fields[prevIndex].getElementsByTagName("input")[0].focus();
        } else {
          const nextIndex = (i + 1) % $fields.length;
          $fields[nextIndex].getElementsByTagName("input")[0].focus();
        }
      }
    });
  }
};

const onLoad = () => {
  window.lazyLoadInstance = new LazyLoad({
    elements_selector: ".lazy",
  });

  loadCode();
};

window.onload = onLoad;
