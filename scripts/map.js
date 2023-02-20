class Base {
  constructor () {
    this.className = this.constructor.name
    this.templateData = {}
  }

  killEvent (event) {
    if (event) {
      event.stopPropagation()
      event.preventDefault()
    }
  }

  isEmpty (obj) {
    return Object.keys(obj).length === 0;
  }

  get (URL, content) {
    const headers = { 'Content-Type': 'application/json' }
    const method = 'GET'
    const options = { method, headers }

    return fetch(URL, options)
  }

  post (URL, content) {
    const headers = { 'Content-Type': 'application/json' }
    const method = 'POST'
    const body = JSON.stringify(content)
    const options = { method, headers, body }

    return fetch(URL, options)
  }

  createElement ({ className, html, text, elementType = 'div', type,  ...options }) {
    let $el = document.createElement(elementType)

    if (type) {
      $el.type = 'text'
    }

    if (html) {
      $el.innerHTML = html
    } else if (text) {
      $el.innerText = text
    }

    className.split(' ').filter(c => c).forEach(name => $el.classList.add(name))

    if (!this.isEmpty(options)) {
      Object.keys(options).forEach((key) => {
        $el[key] = options[key]
      })
    }

    return $el
  }

  template () {
    return `<div class="Template"></div>`
  }

  renderTemplate () {
    let className = this.className
    this.$el = this.createElement({ className })
    const html = ejs.render(this.template(), this.templateData)
    this.$el.insertAdjacentHTML('beforeend', html)
  }

  on (name, callback) {
    const $el = this.$el || document.body

    $el.addEventListener(name, (e) => {
      callback && callback(e.detail)
    })
  }

  emit (name, data) {
    if (!name) {
      console.error('Error: empty name event')
      return
    }

    let event = undefined

    if (data) {
      event = new CustomEvent(name, { detail: data })
    } else {
      event = new Event(name)
    }

    const $el = this.$el || document.body
    $el.dispatchEvent(event)
  }

  render () {
    this.renderTemplate()
    return this.$el
  }
}

class Locations extends Base {
  constructor (filename) {
    super()
    this.filename = filename
    this.locations = []
    this.getLocations()
  }

  onGetLocations (response) {
    return response.json().then((locations) => {
      this.locations = locations
      this.emit('data', this.locations)
    })
  }

  getLocations () {
    return this.get(`/locations/${this.filename}.json`)
      .then(this.onGetLocations.bind(this))
      .catch((error) => {
        console.error(error)
          this.emit('error', true)
      })
  }
}

class Popup extends Base {
  constructor (coordinates, options) {
    super()

    options = options || { }
    options.title = options.title || false
    options.address = options.address || ''
    options.description = options.description || ''

    this.templateData = options
  }

  template () {
    return `
      <div class="Popup__content">
        <% if (description) { %><div class="Popup__description"><%= description %></div> <% } %>
        <% if (address) { %><div class="Popup__address"><%= address %></div><% } %>
      </div>
      `
  }

  render () {
    this.renderTemplate()

    const className = 'Popup'

    this.el = L.popup({
      className
    })

    this.el.setContent(this.$el)
    let content = this.el.getContent()

    return this.el
  }
}
class Map extends Base {
  constructor (coordinates) {
    super()
    this.selectedMarkerId = null
    this.selectedMarkerOrderId = -1

    this.coordinates = coordinates

    this.tileLayer = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}'
    this.attribution = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>'

    this.options = { 
      scrollWheelZoom: true,
      zoomControl: true,
      maxBoundsViscosity: 1.0
    }
  }

    hide () {
        this.map.getContainer().remove()
    }

  selectMarkerById (id) {
    const marker = this.getMarkers().find(marker => marker.options.location.id === id)

    this.selectMarker(marker)
  }

  getMarkers () {
    return this.cluster.getLayers().sort((a, b) => b._leaflet_id - a._leaflet_id)
  }

  getSelectedMarker () {
    return this.getMarkers()[this.selectedMarkerOrderId]
  }

  goToMarker(direction) {
    const markers = this.getMarkers()
    
    if (this.selectedMarkerId) {
      this.selectedMarkerOrderId = markers.findIndex(marker => marker.options.location.id === this.selectedMarkerId)
    }

    this.selectedMarkerOrderId = direction === 'next' ? this.getNextMarker(markers, this.selectedMarkerOrderId) : this.getPrevMarker(markers, this.selectedMarkerOrderId)

    const marker = markers[this.selectedMarkerOrderId % markers.length]
    this.selectMarker(marker)
  }

  getPrevMarker (markers, id) {
    id = (id - 1) % markers.length

    if (id < 0) {
      id = markers.length - 1
    }

    return id
  }

  getNextMarker (markers, id) {
    return id = (id + 1) % markers.length
  }

  renderLocations (locations) {
    locations.reverse().forEach(this.addMarker.bind(this)) 

    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)
    const markerId = +urlParams.get('marker')
    
    if (markerId) {
      this.selectMarkerById(markerId)
      document.body.getElementsByClassName('App')[0].scrollIntoView({ 
        block: 'center',
        inline: 'center'
      })
    }
  }

  flattenCoordinates (coordinates) {
    return [coordinates.lat, coordinates.lng]
  }

  closePopup () {
    this.map.closePopup()
  }

  addMarker (location) {
    const latlng = location.latlng
    const name = location.name
    const description = location.description
    const user = location.user
    const address = location.address
    const zoom = this.map.getZoom()

    const icon = this.getIcon({ location })

    const popup = new Popup(latlng, location)
    const marker = L.marker(latlng, { icon, location }).bindPopup(popup.render(), { maxWidth: 'auto'})

    this.cluster.addLayer(marker)

    this.map.addLayer(this.cluster)
  }

  selectMarker (marker) {
    if (!marker) {
      return
    }

    this.map.once("zoomend, moveend", () => {
      if (marker && marker.getElement()) {
        marker.openPopup()
        marker.getElement().focus()
      }
    })

    const location = marker.options.location
    const latlng = location.latlng
    const zoom = this.map.getZoom() < 18 ? 18 : this.map.getZoom()

    this.map.setView(latlng, zoom)
  }

  getIcon ({ location, className }) {
    let html = location.title
    let classNames = ['Marker', 'has-title']

    if (location.emoji) {
      html = location.emoji
      classNames.push('has-emoji')
    }

    return new L.divIcon({
      className: classNames.join(' '),
      html,
      iconSize: [100, 200],
      iconAnchor: new L.Point(50, 0)
    })
  }

  render () {
    const coordinates = this.flattenCoordinates(this.coordinates)
    this.map = L.map('map', this.options).setView(coordinates, this.coordinates.zoom)

    this.cluster = L.markerClusterGroup({
      spiderfyOnMaxZoom: false,
      showCoverageOnHover: false,
      iconCreateFunction: (cluster) => {
        return L.divIcon({
          className: "Cluster",
          html: '<div>' + cluster.getChildCount() + '</div>',
          iconSize: [32, 32],
          iconAnchor: new L.Point(16, 0)
        })
      }
    })

    this.map.zoomControl.setPosition('topright')
    this.addAttribution()
  }

  addAttribution () {
    const attribution = this.attribution

    L.tileLayer(this.tileLayer+ (L.Browser.retina ? '@2x.png' : '.png'), {
      attribution,
      subdomains: 'abcd',
      maxZoom: 20,
      minZoom: 0
    }).addTo(this.map)
  }
}

class App {
  constructor () {
    this.$el = document.querySelector('.js-map')

    const lng = this.$el.attributes['data-lng'].value
    const lat = this.$el.attributes['data-lat'].value
    const zoom = this.$el.attributes['data-zoom'].value
    const locationsFilename  = this.$el.attributes['data-locations'].value

    this.locations = new Locations(locationsFilename)
    this.map = new Map({ lng, lat, zoom })

    this.render()
    this.bindEvents()
  }

  bindKeyEvents () {
    document.addEventListener('keydown', (event) => {

      if (event.key === 'Escape') {
        event.preventDefault()
        this.map.closePopup()
      }  else if (event.key === 'Tab') {
        event.preventDefault()

        if (event.shiftKey) {
          this.map.goToMarker('prev')
        } else {
          this.map.goToMarker('next')
        }
      }
    })
  }

  bindEvents () {
    this.bindKeyEvents()
    this.locations.on('data', (locations) => {
      this.map.renderLocations(locations)
    })

    this.locations.on('error', () => {
        this.map.hide()
    })
  }

  render () {
    this.map.render()
  }
}

window.onload = () => {
  new App()
}
