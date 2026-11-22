class Newsletter {
  static nextId = 0;

  constructor(element) {
    this.$el = element;
    this.$countDisplays = document.querySelectorAll(".subscribers-count");

    if (!this.$el) return;

    this.twoStep = this.$el.hasAttribute("data-two-step");
    if (this.twoStep) {
      this.$box = this.$el.closest(".newsletter");
      this.$body = this.$box.querySelector(".newsletter__body");
      this.$title = this.$body.querySelector(".newsletter__title");
      this.originalTitle = this.$title?.textContent || "";
      if (!this.$title) {
        this.$title = this.createElement({ elementType: "h3", className: "newsletter__title" });
        this.$body.prepend(this.$title);
      }
      this.$description = this.$body.querySelector(".newsletter__description");
      this.$title.tabIndex = -1;
    }
    this.step = this.twoStep ? "email" : "captcha";
    this.spinner = new Spinner("is-inside-button");

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
      return data; // { a, b, id, expires, signature }
    } catch (err) {
      // Fallback in case the endpoint is unreachable
      const a = Math.floor(Math.random() * 10) + 1;
      const b = Math.floor(Math.random() * 10) + 1;
      return { a, b, signature: null };
    }
  }
  bind() {
    this.fields = [this.$name, this.$email, this.$captchaInput].filter(Boolean);
    this.fields.forEach(($field) =>
      $field.addEventListener("input", () => this.clearError($field)),
    );

    this.$form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (this.transitioning || this.submitting) return;
      if (this.twoStep && this.step === "email") {
        if (this.validate()) this.changeStep("captcha");
      } else {
        this.subscribe();
      }
    });
  }

  // The button is only disabled while a subscription is being sent.
  setSubmitting(submitting) {
    this.submitting = submitting;
    this.$sendButton.disabled = submitting;
    this.$sendButton.classList.toggle("is-disabled", submitting);
  }

  // Only the fields of the current step can stop a submission.
  problems() {
    const checksEmail = !this.twoStep || this.step === "email";
    const checksCaptcha = !this.twoStep || this.step === "captcha";
    const email = this.$email.value.trim();
    const answer = this.$captchaInput.value.trim();
    const problems = [];

    if (this.$name && !this.$name.value.trim()) {
      problems.push({ $field: this.$name, missing: "tu nombre" });
    }
    if (checksEmail) {
      if (!email) problems.push({ $field: this.$email, missing: "tu email" });
      else if (!this.validateEmail(email)) {
        problems.push({ $field: this.$email, invalid: "El email no es válido." });
      }
    }
    if (checksCaptcha) {
      if (!answer) problems.push({ $field: this.$captchaInput, missing: "la respuesta a la suma" });
      else if (!/^\d+$/.test(answer) || Number(answer) !== this.captcha.a + this.captcha.b) {
        problems.push({ $field: this.$captchaInput, invalid: "La respuesta no es correcta." });
      }
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
    this.$message.innerText = "";
    this.$form.classList.remove("is-error");
  }

  async fade(from, to) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const style = getComputedStyle(this.$form);
    const duration = parseFloat(style.getPropertyValue("--transition-speed-default"));
    const easing = style.getPropertyValue("--transition-ease-out").trim();
    await (this.$body || this.$form).animate(
      [{ opacity: from }, { opacity: to }],
      { duration, easing, fill: "forwards" },
    ).finished;
  }

  showStep(step) {
    const isEmail = step === "email";
    const isCaptcha = step === "captcha";
    const isSuccess = step === "success";
    this.$box.dataset.step = step;
    this.$el.hidden = isSuccess;
    this.$emailGroup.hidden = !isEmail;
    this.$email.disabled = !isEmail;
    this.$captchaGroup.hidden = !isCaptcha;
    this.$captchaInput.disabled = !isCaptcha;
    this.$captchaLabel.hidden = !isCaptcha;
    this.$title.textContent = isSuccess
      ? "¡Funcionó! Revisa tu correo para confirmar la suscripción"
      : isEmail ? this.originalTitle : "Resuelve esta suma para suscribirte";
    this.$title.hidden = isEmail && !this.originalTitle;
    if (this.$description) this.$description.hidden = !isEmail;
    this.$buttonLabel.innerText = isEmail ? "Continuar" : "Suscribirme";
  }

  measureBox() {
    // Measure every step at the current width, before painting any change.
    this.$box.style.minHeight = "0";
    this.showStep("email");
    const emailHeight = this.$box.getBoundingClientRect().height;
    this.showStep("captcha");
    const captchaHeight = this.$box.getBoundingClientRect().height;
    this.showStep("success");
    const successHeight = this.$box.getBoundingClientRect().height;
    this.showStep(this.step);
    this.$box.style.minHeight = `${Math.max(emailHeight, captchaHeight, successHeight)}px`;
  }

  async changeStep(step) {
    if (this.transitioning || this.submitting) return;
    this.transitioning = true;
    this.$form.inert = true;
    if (step === "captcha") {
      this.spinner.show();
      this.$sendButton.classList.add("is-loading");
      await this.refreshCaptcha();
      this.spinner.hide();
      this.$sendButton.classList.remove("is-loading");
    }
    await this.fade(1, 0);
    this.step = step;
    this.showStep(step);
    await this.fade(0, 1);
    this.$body.getAnimations().forEach((animation) => animation.cancel());
    this.$form.inert = false;
    this.transitioning = false;
    (step === "success" ? this.$title : step === "email" ? this.$email : this.$captchaInput).focus({ preventScroll: true });
  }

  async fetchSubscribers() {
    if (!this.$countDisplays || this.$countDisplays.length === 0) return;

    try {
      const response = await fetch(
        "https://api.javier.computer/subscribers",
      );
      const count = await response.json();
      if (!count) return;

      this.$countDisplays.forEach(($el) => {
        if (count.toString() === $el.innerText) return;
        $el.classList.add("is-fading");
        setTimeout(() => {
          $el.innerText = count;
          $el.classList.remove("is-fading");
        }, 140);
      });
    } catch (err) {
      console.error("Subscriber fetch failed:", err);
    }
  }

  // A challenge is good for one subscription, and runs out after an hour, so a
  // failed attempt needs a new one before the next.
  async refreshCaptcha() {
    this.captcha = await this.generateCaptcha();
    this.$captchaInput.value = "";
    const question = `¿Cuánto es ${this.captcha.a} + ${this.captcha.b}?`;
    this.$captchaLabel.innerText = question;
  }

  async subscribe() {
    if (this.submitting || !this.validate()) {
      return;
    }

    const timeTaken = (Date.now() - this.startTime) / 1000;

    if (!this.twoStep && timeTaken < 3) {
      this.$form.classList.add("was-sent");
      return;
    }

    this.setSubmitting(true);
    this.spinner.show();
    this.$sendButton.classList.add("is-loading");
    this.$form.classList.remove("is-error", "was-sent");
    this.$message.innerText = "";

    const payload = {
      email: this.$email.value,
      name: this.$name?.value || "",
      captcha: {
        a: this.captcha.a,
        b: this.captcha.b,
        answer: Number(this.$captchaInput.value),
        id: this.captcha.id,
        expires: this.captcha.expires,
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
        if (!this.twoStep) this.$message.innerText =
          "¡Funcionó! Recibirás un email de confirmación inmediatamente. Si no lo ves, revisa tu carpeta de spam.";
        this.$form.classList.add("was-sent");
        this.$email.value = "";
        if (this.$name) this.$name.value = "";
        this.$captchaInput.value = "";

        if (!this.twoStep) await this.refreshCaptcha();
      } else {
        this.$message.innerText =
          "¡Ya estabas en la lista! Busca un email de confirmación en tu bandeja de entrada (o spam). Si no lo encuentras, envíame un mensaje para que pueda ayudarte.";
        this.$form.classList.add("is-error");
        await this.refreshCaptcha();
      }
    } catch (err) {
      console.error("Subscription error:", err);
      this.spinner.hide();
      this.$sendButton.classList.remove("is-loading");
      this.$message.innerText =
        "¡Ups! Algo salió mal. Por favor, inténtalo de nuevo más tarde o envíame un mensaje para que pueda ayudarte.";
      this.$form.classList.add("is-error");
      await this.refreshCaptcha();
    } finally {
      this.setSubmitting(false);
      if (this.twoStep && this.$form.classList.contains("was-sent")) {
        await this.changeStep("success");
      }
    }
  }

  render() {
    this.startTime = Date.now();

    // Our own messages replace the browser's validation bubbles.
    this.$form = this.createElement({ elementType: "form", className: "form", noValidate: true });

    // The standalone form labels its fields like the contact form; the
    // two-step box keeps its compact inputs with placeholders.
    const formId = ++Newsletter.nextId;
    const inputClass = this.twoStep ? "input input--sm input--rounded" : "input input--rounded";
    const question = `¿Cuánto es ${this.captcha.a} + ${this.captcha.b}?`;
    const createLabel = ($input, text, options) =>
      this.createElement({ elementType: "label", className: "label", for: $input.id, text, ...options });

    // Name Field
    const $nameGroup = this.createElement({ className: "input__field" });
    if (!this.twoStep) {
      this.$name = this.createElement({
        elementType: "input",
        className: inputClass,
        type: "text",
        id: `newsletter-name-${formId}`,
        name: "name",
        autocomplete: "name",
        required: true,
      });
      $nameGroup.append(createLabel(this.$name, "Nombre"), this.$name);
    }

    // Email Field
    this.$emailGroup = this.createElement({ className: "input__field" });
    this.$email = this.createElement({
      elementType: "input",
      className: inputClass,
      type: "email",
      id: `newsletter-email-${formId}`,
      name: "email",
      autocomplete: "email",
      required: true,
      ...(this.twoStep && { placeholder: "Email", ariaLabel: "Email" }),
    });
    if (!this.twoStep) this.$emailGroup.appendChild(createLabel(this.$email, "Email"));
    this.$emailGroup.appendChild(this.$email);

    // Captcha Field: its label is the question, in both forms.
    this.$captchaGroup = this.createElement({
      className: "input__field input__field-short",
      hidden: this.twoStep,
    });
    this.$captchaInput = this.createElement({
      elementType: "input",
      className: inputClass,
      type: "text",
      id: `newsletter-captcha-${formId}`,
      name: "captcha",
      inputMode: "numeric",
      disabled: this.twoStep,
      required: !this.twoStep,
      ...(this.twoStep && { placeholder: "Respuesta" }),
    });
    if (this.twoStep) {
      this.$captchaLabel = createLabel(this.$captchaInput, question, {
        className: "newsletter__question",
        hidden: true,
      });
      this.$form.appendChild(this.$captchaLabel);
    } else {
      this.$captchaLabel = createLabel(this.$captchaInput, question);
      this.$captchaGroup.appendChild(this.$captchaLabel);
    }
    this.$captchaGroup.appendChild(this.$captchaInput);

    const $actions = this.createElement({
      className: "form__actions",
    });

    this.$sendButton = this.createElement({
      elementType: "button",
      className: "button button--solid button--sm",
      type: "submit",
    });

    this.$message = this.createElement({ className: "message", role: "status" });

    this.$buttonLabel = this.createElement({
      elementType: "span",
      text: this.twoStep ? "Continuar" : "Suscribirme",
    });
    this.$sendButton.appendChild(this.$buttonLabel);
    this.$sendButton.appendChild(this.spinner.$element);
    if (!this.twoStep) this.$form.appendChild($nameGroup);
    if (this.twoStep) {
      const $field = this.createElement({ className: "input-action" });
      $field.appendChild(this.$emailGroup);
      $field.appendChild(this.$captchaGroup);
      $field.appendChild(this.$sendButton);
      this.$form.appendChild($field);
      this.$form.appendChild(this.$message);
    } else {
      this.$form.appendChild(this.$emailGroup);
      this.$form.appendChild(this.$captchaGroup);
      $actions.appendChild(this.$sendButton);
      $actions.appendChild(this.$message);
      this.$form.appendChild($actions);
    }
    this.$el.appendChild(this.$form);

    if (this.twoStep) {
      this.measureBox();
      let previousWidth;
      this.resizeObserver = new ResizeObserver(([entry]) => {
        if (entry.contentRect.width === previousWidth) return;
        previousWidth = entry.contentRect.width;
        this.measureBox();
      });
      this.resizeObserver.observe(this.$box);
      document.fonts.ready.then(() => this.measureBox());
    }

    const delay = parseFloat(getComputedStyle(this.$form).getPropertyValue("--transition-speed-default"));
    setTimeout(() => this.$form.classList.add("is-visible"), delay);
  }
}

document.querySelectorAll(".js-newsletter-container").forEach((element) => {
  new Newsletter(element);
});
