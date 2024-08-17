class Mail {
  constructor() {
    this.className = this.constructor.name;
    this.spinner = this.spinner = new Spinner("is-inside-button");
    this.title = "";
    this.content = "";
    this.email = "";
    this.disabled = true;

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
    this.$email.addEventListener("keyup", this.onWriting.bind(this));
    this.$content.addEventListener("keyup", this.onWriting.bind(this));
    this.$form.addEventListener("keydown", this.handleEnterKey.bind(this));
  }

  success() {
    this.$message.innerText = `${this.what} enviado. ¡Gracias!`;
    this.$form.classList.add("was-sent");
    setTimeout(() => this.$form.classList.remove("was-sent"), 2000);
  }

  disableSend() {
    this.disabled = true;
    this.$sendButton.classList.add("is-disabled");
  }

  enableSend() {
    this.disabled = false;
    this.$sendButton.classList.remove("is-disabled");
  }

  handleEnterKey(event) {
    if (event.key === "Enter" && !event.shiftKey && !this.disabled) {
      event.preventDefault();
      this.sendText();
    }
  }

  onWriting() {
    this.$form.classList.remove("was-sent");
    this.email = this.$email.value;
    this.content = this.$content.value;

    if (this.validateEmail(this.email) && this.content) {
      this.enableSend();
      this.$email.classList.remove("invalid-email");
    } else {
      this.disableSend();
      if (this.email && !this.validateEmail(this.email)) {
        this.$email.classList.add("invalid-email");
      } else {
        this.$email.classList.remove("invalid-email");
      }
    }
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
      text: `Envía tu ${this.what.toLowerCase()} sobre `,
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
    const $input = this.createElement({ className: "Input__field" });

    const $label = this.createElement({
      elementType: "label",
      text: "Email",
      htmlFor: inputId,
      className: "Label",
    });

    this.$email = this.createElement({
      id: inputId,
      type: "email",
      elementType: "input",
      className: "Input",
      required: true,
    });

    $input.appendChild($label);
    $input.appendChild(this.$email);
    this.$form.appendChild($input);
  }

  renderComment() {
    const textareaId = "comment-textarea";
    const $input = this.createElement({ className: "Input__field" });
    const $label = this.createElement({
      className: "Label",
      elementType: "label",
      text: this.what,
      htmlFor: textareaId,
      required: true,
    });

    this.$content = this.createElement({
      id: textareaId,
      elementType: "textarea",
      className: "Textarea",
    });

    $input.appendChild($label);
    $input.appendChild(this.$content);
    this.$form.appendChild($input);
  }

  renderSendButton() {
    const $actions = this.createElement({
      elementType: "div",
      className: "Form__actions",
    });

    this.$message = this.createElement({
      elementType: "div",
      className: "Message",
    });

    this.$sendButton = this.createElement({
      elementType: "button",
      className: "Button is-disabled",
      text: `Enviar ${this.what.toLowerCase()}`,
      onclick: () => this.sendText(),
    });

    this.$sendButton.appendChild(this.spinner.$element);

    this.$form.appendChild($actions);
    $actions.appendChild(this.$sendButton);
    $actions.appendChild(this.$message);
  }

  async sendText() {
    if (this.disabled) {
      return;
    }

    this.spinner.show();

    const { email, content: text } = this;
    const urlParams = new URLSearchParams(window.location.search);
    const title = urlParams.get("title") || "Contacto general";
    const subject = `Nuevo ${this.what.toLowerCase()}`;

    this.post("https://api.javier.computer/api/comment", {
      subject,
      email,
      title,
      text,
    })
      .then((response) => response.json())
      .then((result) => {
        this.spinner.hide();

        if (result && result.error) {
          this.$message.innerText = result.message;
          this.$form.classList.add("is-error");
          setTimeout(() => this.$form.classList.remove("is-error"), 2000);
          return;
        }

        this.$email.value = "";
        this.$content.value = "";
        this.disableSend();
        this.success();
      });
  }

  render() {
    this.$el = document.querySelector(".js-form");
    this.what = this.$el.getAttribute("data-what");
    this.$form = this.createElement({ className: "Form" });

    this.renderTitle();
    this.renderComment();
    this.renderEmail();
    this.renderSendButton();

    this.$el.appendChild(this.$form);

    setTimeout(() => this.$form.classList.add("is-visible"), 200);
  }
}

new Mail();
