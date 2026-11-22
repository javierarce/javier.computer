class Mail {
  constructor() {
    this.className = this.constructor.name;
    this.spinner = new Spinner("is-inside-button");
    this.submitting = false;

    this.render();
    this.bind();
  }

  killEvent(e) {
    e.stopPropagation();
    e.preventDefault();
  }

  isEmpty(obj) {
    return Object.keys(obj).length === 0;
  }

  createElement({
    className,
    html,
    text,
    elementType = "div",
    type,
    id,
    for: htmlFor,
    ...options
  }) {
    const $el = document.createElement(elementType);
    if (type) $el.type = type;
    if (id) $el.id = id;
    if (html) $el.innerHTML = html;
    if (htmlFor) $el.htmlFor = htmlFor;
    else if (text) $el.innerText = text;

    className
      .split(" ")
      .filter(Boolean)
      .forEach((name) => $el.classList.add(name));

    Object.assign($el, options);

    return $el;
  }

  addClass(elementClass, className) {
    const $element = document.querySelector(`.${elementClass}`);
    if ($element) $element.classList.add(className);
  }

  post(URL, content) {
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(content),
    };
    return fetch(URL, options);
  }

  getRandomItem(items) {
    return items[Math.floor(Math.random() * items.length)];
  }

  getElements(selector) {
    return document.querySelectorAll(selector);
  }

  getElement(selector) {
    return document.querySelector(selector);
  }

  validateEmail(email) {
    const re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  bind() {
    this.fields = [this.$email, this.$content];
    this.fields.forEach(($field) =>
      $field.addEventListener("input", () => this.clearError($field)),
    );
    this.$form.addEventListener("keydown", this.handleEnterKey.bind(this));
  }

  success() {
    this.$message.innerText = `${this.what} enviado. ¡Gracias!`;
    this.$form.classList.add("was-sent");
    this.hideMessageLater("was-sent");
  }

  hideMessageLater(className) {
    this.messageTimer = setTimeout(() => this.$form.classList.remove(className), 2000);
  }

  setSubmitting(submitting) {
    this.submitting = submitting;
    this.$sendButton.classList.toggle("is-disabled", submitting);
    if (submitting) this.spinner.show();
    else this.spinner.hide();
  }

  handleEnterKey(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      this.sendText();
    }
  }

  problems() {
    const email = this.$email.value.trim();
    const problems = [];

    if (!email) problems.push({ $field: this.$email, missing: "tu email" });
    else if (!this.validateEmail(email)) {
      problems.push({ $field: this.$email, invalid: "El email no es válido." });
    }
    if (!this.$content.value.trim()) {
      problems.push({ $field: this.$content, missing: `tu ${this.what.toLowerCase()}` });
    }
    return problems;
  }

  // Missing fields are named together in one sentence; the other sentences
  // say what is wrong with a value.
  describe(problems) {
    const missing = problems.filter((problem) => problem.missing).map((problem) => problem.missing);
    const sentences = problems.filter((problem) => problem.invalid).map((problem) => problem.invalid);
    if (missing.length) {
      const list = new Intl.ListFormat("es", { type: "conjunction" }).format(missing);
      sentences.unshift(`Escribe ${list}.`);
    }
    return sentences.join(" ");
  }

  // Validation happens on submission: the button is always enabled. Every
  // failing field is marked and the first one takes the focus.
  validate() {
    const problems = this.problems();
    const failing = problems.map((problem) => problem.$field);
    this.fields.forEach(($field) => {
      if (failing.includes($field)) $field.setAttribute("aria-invalid", "true");
      else $field.removeAttribute("aria-invalid");
    });

    if (!problems.length) {
      this.hideProblems();
      return true;
    }

    this.reportingProblems = true;
    clearTimeout(this.messageTimer);
    this.$message.innerText = this.describe(problems);
    this.$form.classList.remove("was-sent");
    this.$form.classList.add("is-error");
    failing[0].focus({ preventScroll: true });
    return false;
  }

  // Editing a field withdraws its problem; the message keeps the others.
  // Server errors are not tied to a field, so they stay visible.
  clearError($field) {
    $field.removeAttribute("aria-invalid");
    if (!this.reportingProblems) return;
    const remaining = this.problems().filter((problem) => problem.$field.hasAttribute("aria-invalid"));
    if (remaining.length) this.$message.innerText = this.describe(remaining);
    else this.hideProblems();
  }

  hideProblems() {
    if (!this.reportingProblems) return;
    this.reportingProblems = false;
    this.$form.classList.remove("is-error");
  }

  renderTitle() {
    const urlParams = new URLSearchParams(window.location.search);
    const title = urlParams.get("title");
    const url = urlParams.get("url");

    if (!title || !url) {
      return;
    }

    const $label = this.createElement({
      elementType: "p",
      text: `Envíame tu ${this.what.toLowerCase()} sobre `,
      className: "Comment__title",
    });

    const $a = this.createElement({
      elementType: "a",
      text: `«${title}»`,
      href: url,
      className: "Comment__title",
    });

    $label.appendChild($a);
    this.$form.appendChild($label);
  }

  renderEmail() {
    const inputId = "email-input";
    const $input = this.createElement({ className: "input__field" });

    const $label = this.createElement({
      elementType: "label",
      text: "Email",
      htmlFor: inputId,
      className: "label",
    });

    this.$email = this.createElement({
      id: inputId,
      type: "email",
      elementType: "input",
      className: "input input--rounded",
      required: true,
    });

    $input.appendChild($label);
    $input.appendChild(this.$email);
    this.$form.appendChild($input);
  }

  renderComment() {
    const textareaId = "comment-textarea";
    const $input = this.createElement({ className: "input__field" });
    const $label = this.createElement({
      className: "label",
      elementType: "label",
      text: this.what,
      htmlFor: textareaId,
      required: true,
    });

    this.$content = this.createElement({
      id: textareaId,
      elementType: "textarea",
      className: "textarea textarea--rounded",
    });

    $input.appendChild($label);
    $input.appendChild(this.$content);
    this.$form.appendChild($input);
  }

  renderSendButton() {
    const $actions = this.createElement({
      elementType: "div",
      className: "form__actions",
    });

    this.$message = this.createElement({
      elementType: "div",
      className: "message",
      role: "status",
    });

    this.$sendButton = this.createElement({
      elementType: "button",
      className: "button button--solid button--sm",
      text: `Enviar ${this.what.toLowerCase()}`,
      onclick: () => this.sendText(),
    });

    this.$sendButton.appendChild(this.spinner.$element);

    $actions.appendChild(this.$sendButton);
    $actions.appendChild(this.$message);
    this.$form.appendChild($actions);
  }

  async sendText() {
    if (this.submitting || !this.validate()) {
      return;
    }

    this.setSubmitting(true);
    this.$form.classList.remove("is-error", "was-sent");

    const email = this.$email.value.trim();
    const text = this.$content.value;
    const urlParams = new URLSearchParams(window.location.search);
    const title = urlParams.get("title") || "Contacto general";
    const subject = `Nuevo ${this.what.toLowerCase()}`;

    this.post("https://api.javier.computer/comment", {
      subject,
      email,
      title,
      text,
    })
      .then((response) => response.json())
      .then((result) => {
        if (!result || !result.success) {
          this.error(result);
          return;
        }

        this.$email.value = "";
        this.$content.value = "";
        this.success();
      })
      .catch((e) => this.error(e))
      .finally(() => this.setSubmitting(false));
  }

  error(detail) {
    console.error("Mailer:", detail);
    this.$message.innerText = "No se pudo enviar. Inténtalo de nuevo.";
    this.$form.classList.add("is-error");
    this.hideMessageLater("is-error");
  }

  render() {
    this.$el = document.querySelector(".js-form");
    this.what = this.$el.getAttribute("data-what");
    this.$form = this.createElement({ className: "form" });

    this.renderTitle();
    this.renderEmail();
    this.renderComment();
    this.renderSendButton();

    this.$el.appendChild(this.$form);

    setTimeout(() => this.$form.classList.add("is-visible"), 200);
  }
}

new Mail();
