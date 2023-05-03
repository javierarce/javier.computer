class OpenHeartElement extends HTMLElement {
    constructor() {
        super(),
        this.KEY = "_open_heart",
        this._send = this.send.bind(this)
    }
    connectedCallback() {
        if (this.tabIndex = 0,
        this.setAttribute("role", "button"),
        this.setAttribute("aria-busy", "false"),
        !this.emoji || !this.href)
            return console.error(this, "missing required attributes"),
            void this.toggleAttribute("disabled", !0);
        this.validateEmoji() ? this.hasReacted() ? this.setReacted() : (this.addEventListener("click", this._send),
        this.addEventListener("keydown", this._send)) : console.error(this, "emoji attribute incorrect"),
  this.getCount()
    }
    validateEmoji() {
        if ("Segmenter"in Intl) {
            const t = Array.from(new Intl.Segmenter(navigator.language || "en",{
                granularity: "grapheme"
            }).segment(this.emoji))
              , e = t.length > 0 && t[0].segment;
            return this.emoji == e && /\p{Emoji}/u.test(e)
        }
        {
            const t = this.emoji.match(/\p{Emoji}/u);
            return !(!t || !t[0])
        }
    }
    get href() {
        return this.getAttribute("href")
    }
    get emoji() {
        return this.getAttribute("emoji")
    }
    get key() {
        return `${this.emoji}@${encodeURIComponent(this.href)}`
    }
    get disabled() {
        return this.hasAttribute("disabled")
    }
    hasReacted() {
        return (localStorage.getItem(this.KEY) || "").split(",").includes(this.key)
    }
    setReacted() {
        this.setAttribute("aria-pressed", "true"),
        this.toggleAttribute("disabled", !0),
        this.removeEventListener("click", this._send)
    }
    saveReaction() {
        const t = (localStorage.getItem(this.KEY) || "").split(",").filter((t=>t));
        t.push(this.key),
        localStorage.setItem(this.KEY, t.join(","))
    }
    async getCount() {
        const t = await fetch(this.href, {
            headers: {
                Accept: "application/json"
            }
        });
        if (!t.ok)
            return;
        let e = {};
        try {
            e = await t.json()
        } catch {}
      if (e[this.emoji] > 0) {
        this.setAttribute("count", Number(e[this.emoji] || 0).toString())
      }
    }
    async send(t) {
        if ((!(t instanceof KeyboardEvent) || ["Enter", " "].includes(t.key)) && !this.disabled && "true" !== this.getAttribute("aria-busy")) {
            if (this.hasReacted())
                return this.setReacted();
            this.setAttribute("aria-busy", "true"),
            await fetch(this.href, {
                method: "post",
                body: this.emoji,
                mode: "no-cors"
            }),
            this.setAttribute("aria-busy", "false"),
            this.saveReaction(),
            this.setReacted(),
            this.getCount(),
            this.dispatchEvent(new CustomEvent("open-heart",{
                bubbles: !0
            }))
        }
    }
}
window.customElements.get("open-heart") || (window.OpenHeartElement = OpenHeartElement,
window.customElements.define("open-heart", OpenHeartElement));
export default OpenHeartElement;
