let $code;
let $message;

let debounceTimer = null;
let lastSentCode = null;
let controller = null;
const URL = "http://localhost:3000/zine/check";

const hideCode = () => {
  const $fields = $code.getElementsByClassName("input__field");

  for (let i = 0; i < $fields.length; i++) {
    $fields[i].style.transitionDelay = 100 * i + "ms";
    $fields[i].classList.add("is-hidden");
  }
};

const showMessage = (data) => {
  $message.innerHTML = data.message;
  $message.classList.add("is-visible");
  console.log(data);
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
    code.push(value);
  }

  if (code.some((v) => v.trim() === "")) return;

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

const onLoad = () => {
  $code = document.getElementById("code");
  $message = document.getElementById("message");

  const $fields = $code.getElementsByClassName("input__field");

  for (let i = 0; i < $fields.length; i++) {
    const $input = $fields[i].getElementsByTagName("input")[0];

    $input.tabIndex = i + 1;

    $input.addEventListener("input", () => {
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

window.onload = onLoad;
