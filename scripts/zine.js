let $code;
let $message;
let $reply;

let debounceTimer = null;
let lastSentCode = null;
let controller = null;
let currentCode = null;

const codeLength = 4;
const URL = "https://api.javier.computer/zine/check";
const REPLY_URL = "https://api.javier.computer/zine/reply";

const TIMEOUT = 75;

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

const showMessage = (data, replied) => {
  let content = data.message;

  // 1. Define the Regex for the image/media (GIF/WebP)
  const imgRegex = /(https?:\/\/[^\s]+\.(?:gif|webp))/gi;

  // 2. Transform URLs into the wrapper first
  content = content.replace(imgRegex, (match) => {
    return `[[MEDIA_SPLIT]]<div class="message__media-wrapper"><img src="${match}" alt="Embedded media" class="message__img" loading="lazy" /></div>[[MEDIA_SPLIT]]`;
  });

  // 3. Split the content by our marker, filter empty strings, and wrap text in <p>
  const parts = content.split("[[MEDIA_SPLIT]]");

  const finalHTML = parts
    .map((part) => {
      const trimmed = part.trim();
      if (!trimmed) return ""; // Skip empty chunks

      // If it's the media wrapper we just built, return it as is
      if (trimmed.startsWith('<div class="message__media-wrapper"')) {
        return trimmed;
      }

      // Otherwise, it's text. Convert internal newlines to single breaks if needed,
      // or just wrap the whole block in a paragraph.
      const textWithBreaks = trimmed.replace(/[\r\n]+/g, "<br />");
      return `<p>${textWithBreaks}</p>`;
    })
    .join("");

  document.getElementById("message-content").innerHTML = finalHTML;

  // Show reply form in layout before message fades in (no shift later)
  if (!replied) {
    $reply.style.display = "block";
  } else {
    $reply.remove();
  }

  $message.classList.add("is-visible");

  $message.addEventListener("transitionend", () => {
    const $intro = document.getElementById("intro");
    if ($intro) $intro.style.display = "none";
    $code.style.display = "none";
    $message.classList.add("is-settled");
    document.documentElement.style.height = "auto";
    document.body.style.height = "auto";
    document.body.style.minHeight = "100%";
    document.querySelector(".layout__lol").style.height = "auto";
    document.querySelector(".layout__lol").style.minHeight = "100%";
    document.querySelector(".zine__content").style.height = "auto";
    document.querySelector(".zine__content").style.minHeight = "100vh";
    window.scrollTo(0, 0);

    if (window.lazyLoadInstance) {
      window.lazyLoadInstance.update();
    }

    if (!replied) {
      showReply();
    }
  }, { once: true });
};

const showReply = () => {
  $reply.classList.add("is-visible");
};

const sendReply = () => {
  const $textarea = $reply.querySelector("textarea");
  const $button = $reply.querySelector("button");
  const message = $textarea.value.trim();

  if (!message || !currentCode) return;

  $button.disabled = true;
  $button.textContent = "Enviando…";

  fetch(REPLY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code: currentCode, message }),
  })
    .then((res) => res.json())
    .then(() => {
      $reply.classList.add("is-fading-out");
      $reply.addEventListener("transitionend", () => {
        $reply.innerHTML = "<p class='reply__confirmation'>Mensaje enviado</p>";
        $reply.classList.remove("is-fading-out");
      }, { once: true });
    })
    .catch((err) => {
      console.error("Reply error:", err);
      $button.disabled = false;
      $button.textContent = "Responder";
    });
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
          currentCode = joinedCode;

          // Update URL with the successful code
          const newUrl = `${window.location.pathname}?code=${joinedCode}`;
          window.history.replaceState({ path: newUrl }, "", newUrl);

          document.activeElement?.blur();
          const $intro = document.getElementById("intro");
          $intro.style.transition = "opacity var(--transition-speed-super-slow) ease-in-out";
          $intro.style.opacity = "0";
          hideCode();
          setTimeout(() => {
            showMessage(data.data, data.replied);
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
  $reply = document.getElementById("reply");

  if (!$code) return;

  const $replyButton = $reply.querySelector("button");
  $replyButton.addEventListener("click", sendReply);

  $reply.querySelector("textarea").addEventListener("keydown", (e) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      sendReply();
    }
  });

  // Check for code in URL
  const urlParams = new URLSearchParams(window.location.search);
  const urlCode = urlParams.get("code"); // e.g., "word-word-word-word"
  const prefilledParts = urlCode ? urlCode.split("-") : [];

  for (let i = 0; i < codeLength; i++) {
    const $field = createInputField();
    const $input = $field.querySelector("input");

    // Fill input if code exists in URL
    if (prefilledParts[i]) {
      $input.value = prefilledParts[i];
    }

    $code.appendChild($field);
  }

  const $fields = $code.getElementsByClassName("input__field");
  showCode();

  // If we prefilled the whole thing, trigger the check immediately
  if (prefilledParts.length === codeLength) {
    checkCode($fields);
  }

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
        e.preventDefault();

        let targetInput;

        if (e.shiftKey) {
          const prevIndex = (i - 1 + $fields.length) % $fields.length;
          targetInput = $fields[prevIndex].getElementsByTagName("input")[0];
        } else {
          const nextIndex = (i + 1) % $fields.length;
          targetInput = $fields[nextIndex].getElementsByTagName("input")[0];
        }

        if (targetInput) {
          targetInput.focus();
          targetInput.select(); // <--- This selects the existing text
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
