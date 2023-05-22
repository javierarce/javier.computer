
class Spinner {
  constructor (className = '') {
    this.className = `${this.constructor.name} ${className}`
    this.visible = false
    this.render()
  }

  show () {
    this.visible = true
    this.render()
  }

  hide () {
    this.visible = false
    this.render()
  }

  render () {
    if (!this.$element) {
      this.$element = document.createElement('div')
      this.className.split(' ').filter(c => c).forEach(name => this.$element.classList.add(name))
    }

    this.$element.classList.toggle('is-visible', this.visible)

    return this.$element
  }
}
