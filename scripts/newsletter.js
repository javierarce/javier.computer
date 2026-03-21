class Newsletter {
  constructor() {
    this.$el = document.querySelector(".js-newsletter-container");
    this.$countDisplay = document.getElementById("subscribers-count");

    if (!this.$el) return;

    this.spinner = new Spinner("is-inside-button");
    this.disabled = true;

    this.init();
  }

  async init() {
    this.captcha = await this.generateCaptcha();
    this.render();
    this.bind();
    this.fetchSubscribers();
  }

  createElement({ className, html, text, elementType = "div", ...options }) {
    const $el = document.createElement(elementType);
    if (options.id) $el.id = options.id;
    if (options.type) $el.type = options.type;
    if (options.for) $el.htmlFor = options.for;
    if (html) $el.innerHTML = html;
    else if (text) $el.innerText = text;

    if (className) {
      className
        .split(" ")
        .filter(Boolean)
        .forEach((name) => $el.classList.add(name));
    }
    Object.assign($el, options);
    return $el;
  }

  validateEmail(email) {
    const re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  async generateCaptcha() {
    try {
      const response = await fetch("https://api.javier.computer/captcha");
      const data = await response.json();
      return data; // { a, b, signature }
    } catch (err) {
      // Fallback in case the endpoint is unreachable
      const a = Math.floor(Math.random() * 10) + 1;
      const b = Math.floor(Math.random() * 10) + 1;
      return { a, b, signature: null };
    }
  }
  bind() {
    this.$name.addEventListener("input", this.onWriting.bind(this));
    this.$email.addEventListener("input", this.onWriting.bind(this));
    this.$captchaInput.addEventListener("input", this.onWriting.bind(this));

    this.$form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.subscribe();
    });
  }

  onWriting() {
    const isEmailValid = this.validateEmail(this.$email.value);
    const isNameValid = this.$name.value.trim().length > 0;
    const isCaptchaValid =
      parseInt(this.$captchaInput.value, 10) ===
      this.captcha.a + this.captcha.b;

    this.disabled = !(isEmailValid && isNameValid && isCaptchaValid);
    this.$sendButton.classList.toggle("is-disabled", this.disabled);

    this.$email.classList.toggle(
      "invalid-email",
      this.$email.value && !isEmailValid,
    );
  }

  async fetchSubscribers() {
    if (!this.$countDisplay) return;

    try {
      const response = await fetch(
        "https://api.javier.computer/subscribers",
      );
      const count = await response.json();

      if (count && count.toString() !== this.$countDisplay.innerText) {
        this.$countDisplay.classList.add("is-fading");
        setTimeout(() => {
          this.$countDisplay.innerText = count;
          this.$countDisplay.classList.remove("is-fading");
        }, 140);
      }
    } catch (err) {
      console.error("Subscriber fetch failed:", err);
    }
  }

  async subscribe() {
    const timeTaken = (Date.now() - this.startTime) / 1000;

    if (timeTaken < 3) {
      this.$form.classList.add("was-sent");
      return;
    }

    if (this.disabled) {
      return;
    }

    this.spinner.show();
    this.$sendButton.classList.add("is-loading");
    this.$form.classList.remove("is-error", "was-sent");
    this.$message.innerText = "";

    const payload = {
      email: this.$email.value,
      name: this.$name.value || "",
      captcha: {
        a: this.captcha.a,
        b: this.captcha.b,
        answer: parseInt(this.$captchaInput.value, 10),
        signature: this.captcha.signature,
      },
    };

    try {
      const response = await fetch(
        "https://api.javier.computer/subscribe",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const result = await response.json();

      this.spinner.hide();
      this.$sendButton.classList.remove("is-loading");

      if (result.success) {
        this.$message.innerText =
          "¡Funcionó! Recibirás un email de confirmación inmediatamente. Si no lo ves, revisa tu carpeta de spam.";
        this.$form.classList.add("was-sent");
        this.$email.value = "";
        this.$name.value = "";
        this.$captchaInput.value = "";
        this.disabled = true;
        this.$sendButton.classList.add("is-disabled");

        this.captcha = await this.generateCaptcha();
        this.$captchaInput.placeholder = `¿Cuánto es ${this.captcha.a} + ${this.captcha.b}?`;
      } else {
        this.$message.innerText =
          "¡Ya estabas en la lista! Busca un email de confirmación en tu bandeja de entrada (o spam). Si no lo encuentras, envíame un mensaje para que pueda ayudarte.";
        this.$form.classList.add("is-error");
      }
    } catch (err) {
      console.error("Subscription error:", err);
      this.spinner.hide();
      this.$sendButton.classList.remove("is-loading");
      this.$message.innerText =
        "¡Ups! Algo salió mal. Por favor, inténtalo de nuevo más tarde o envíame un mensaje para que pueda ayudarte.";
      this.$form.classList.add("is-error");
    }
  }

  render() {
    this.startTime = Date.now();

    this.$header = this.createElement({
      elementType: "h2",
      className: "newsletter__title",
      text: "Suscríbete a mi newsletter",
    });
    this.$el.appendChild(this.$header);

    this.$form = this.createElement({ elementType: "form", className: "form" });

    // Name Field
    const $nameGroup = this.createElement({ className: "input__field" });
    this.$name = this.createElement({
      elementType: "input",
      className: "input",
      type: "text",
      placeholder: "Nombre",
      name: "name",
      required: true,
    });
    $nameGroup.appendChild(this.$name);

    // Email Field
    const $emailGroup = this.createElement({ className: "input__field" });
    this.$email = this.createElement({
      elementType: "input",
      className: "input",
      type: "email",
      placeholder: "Email",
      name: "email",
      required: true,
    });
    $emailGroup.appendChild(this.$email);

    const $captchaGroup = this.createElement({
      className: "input__field input__field-short",
    });
    this.$captchaInput = this.createElement({
      elementType: "input",
      className: "input",
      type: "text",
      placeholder: `¿Cuánto es ${this.captcha.a} + ${this.captcha.b}?`,
      name: "captcha",
      required: true,
    });
    $captchaGroup.appendChild(this.$captchaInput);

    const $actions = this.createElement({
      className: "form__actions two-lines",
    });

    this.$sendButton = this.createElement({
      elementType: "button",
      className: "button is-disabled",
      text: "Suscríbeme",
      type: "submit",
    });

    this.$message = this.createElement({ className: "message" });

    this.$sendButton.appendChild(this.spinner.$element);
    $actions.appendChild(this.$sendButton);
    $actions.appendChild(this.$message);

    this.$form.appendChild($nameGroup);
    this.$form.appendChild($emailGroup);
    this.$form.appendChild($captchaGroup);
    this.$form.appendChild($actions);
    this.$el.appendChild(this.$form);

    setTimeout(() => this.$form.classList.add("is-visible"), 200);
  }
}

new Newsletter();
