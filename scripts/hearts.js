class OpenHeartElement extends HTMLElement {
  constructor() {
    super();
    this.KEY = "_open_heart";
    this._send = this.send.bind(this);
  }

  static get observedAttributes() {
    return ["count"];
  }

  attributeChangedCallback() {
    this.updateCountText();
  }

  updateCountText() {
    const count = this.querySelector(".count");
    if (!count) return;
    const next = this.getAttribute("count") || "0";
    const previous = count.querySelector(".count-value")?.textContent || count.textContent;
    if (previous === next) return;

    this._countAnimations?.forEach((animation) => animation.cancel());
    count.textContent = next;
    if (this._skipCountAnimation || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // The new value owns the layout; the old one fades away without adding width.
    const outgoing = document.createElement("span");
    outgoing.className = "count-previous";
    outgoing.setAttribute("aria-hidden", "true");
    outgoing.textContent = previous;
    const incoming = document.createElement("span");
    incoming.className = "count-value";
    incoming.textContent = next;
    count.replaceChildren(incoming, outgoing);

    const timing = { duration: 160, easing: "cubic-bezier(0.23, 1, 0.32, 1)" };
    const fadeOut = outgoing.animate([{ opacity: 1 }, { opacity: 0 }], timing);
    const fadeIn = incoming.animate([{ opacity: 0 }, { opacity: 1 }], timing);
    this._countAnimations = [fadeOut, fadeIn];
    fadeOut.onfinish = () => outgoing.remove();
  }

  connectedCallback() {
    this.updateCountText();
    this.tabIndex = 0;
    this.setAttribute("role", "button");
    this.setAttribute("aria-busy", "false");

    if (!this.emoji || !this.href) {
      console.error(this, "missing required attributes");
      this.toggleAttribute("disabled", true);
      return;
    }

    if (!this.validateEmoji()) {
      console.error(this, "emoji attribute incorrect");
      return;
    }

    if (this.hasReacted()) {
      this.setReacted();
    } else {
      this.addEventListener("click", this._send);
      this.addEventListener("keydown", this._send);
    }

    this.getCount();
  }

  validateEmoji() {
    if ("Segmenter" in Intl) {
      const segments = Array.from(
        new Intl.Segmenter(navigator.language || "en", {
          granularity: "grapheme",
        }).segment(this.emoji),
      );
      const emoji = segments.length > 0 ? segments[0].segment : false;
      if (this.emoji != emoji) return false;
      return /\p{Emoji}/u.test(emoji);
    } else {
      const match = this.emoji.match(/\p{Emoji}/u);
      return !!(match && match[0]);
    }
  }

  get title() {
    return this.getAttribute("title");
  }

  get href() {
    return this.getAttribute("href");
  }

  get emoji() {
    return this.getAttribute("emoji");
  }

  get key() {
    const url = new URL(this.href, window.location.origin);
    const id = url.searchParams.get("id");
    return `${this.emoji}@${encodeURIComponent(id)}`;
  }

  get disabled() {
    return this.hasAttribute("disabled");
  }

  hasReacted() {
    const hearts = localStorage.getItem(this.KEY);
    if (hearts) {
      return hearts.includes(this.key);
    }
    return false;
  }

  setReacted() {
    this.setAttribute("aria-pressed", "true");
    this.toggleAttribute("disabled", true);
    this.removeEventListener("click", this._send);
  }

  saveReaction() {
    const hearts = (localStorage.getItem(this.KEY) || "")
      .split(",")
      .filter((s) => s);
    hearts.push(this.key);
    localStorage.setItem(this.KEY, hearts.join(","));
  }

  async getCount(animate = true) {
    const response = await fetch(this.href, {
      headers: { Accept: "application/json" },
    });
    if (!response.ok) return;
    let json = {};
    try {
      json = await response.json();
    } catch {
      /* do nothing */
    }
    this._skipCountAnimation = !animate;
    this.setAttribute("count", Number(json[this.emoji] || 0).toString());
    this._skipCountAnimation = false;
  }

  async send(event) {
    if (event instanceof KeyboardEvent && !["Enter", " "].includes(event.key))
      return;
    if (this.disabled) return;
    if (this.getAttribute("aria-busy") === "true") return;
    if (this.hasReacted()) return this.setReacted();

    const url = this.title
      ? `${this.href}&title=${encodeURIComponent(this.title)}`
      : this.href;

    this.setAttribute("aria-busy", "true");
    await fetch(url, {
      method: "post",
      body: this.emoji,
      mode: "no-cors",
    });
    this.setAttribute("aria-busy", "false");
    this.saveReaction();
    this.setReacted();
    this.getCount(!(event instanceof KeyboardEvent));
    this.dispatchEvent(new CustomEvent("open-heart", { bubbles: true }));
  }
}

if (!window.customElements.get("open-heart")) {
  window.OpenHeartElement = OpenHeartElement;
  window.customElements.define("open-heart", OpenHeartElement);
}

export default OpenHeartElement;
