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
        <% if (title) { %><div class="Popup__title"><%= title %></div> <% } %>
        <% if (description) { %><div class="Popup__description"><%= description %></div> <% } %>
        <% if (post_references) { %><div class="Popup__posts">
        <% for (let i = 0; i < post_references.length; i++) { %>
            <a class="Popup__post" href="<%= post_references[i].url -%>"><%= i + 1 -%></a>
        <% } %>
        </div> <% } %>
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

    show () {
        this.map.getContainer().classList.add('is-visible')
        this.fitBoundsToMarkers()
        this.map.setZoom(this.map.getZoom() + 1)
        this.map.invalidateSize()
    }

  hide () {
    this.map.getContainer().remove()
  }

  fitBoundsToMarkers () {
    const latlngs = this.getMarkers().map(marker => marker.getLatLng())
    this.map.fitBounds(L.latLngBounds(latlngs))
  }

  selectMarkerById (id) {
    const marker = this.getMarkers().find(marker => marker.options.location.id === id)
    this.selectedMarkerOrderId = marker.options.location.id -1
    this.selectMarker(marker, 18)
  }

  getMarkers () {
    return this.markers.getLayers().sort((a, b) => b._leaflet_id - a._leaflet_id)
  }

  getSelectedMarker () {
    return this.getMarkers()[this.selectedMarkerOrderId]
  }

  goToMarker(direction) {
    const markers = this.getMarkers()
    this.selectedMarkerOrderId = direction === 'next' ? this.getNextMarker(markers, this.selectedMarkerOrderId) : this.getPrevMarker(markers, this.selectedMarkerOrderId)

    const marker = markers[this.selectedMarkerOrderId % markers.length]
    this.selectMarker(marker, 18)
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
    let markers = []

    locations.reverse().forEach((location, index) => {
      const marker = this.createMarker(location)
      markers.push(marker)
    }) 

    this.markers = L.layerGroup(markers)
    this.markers.addTo(this.map)

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

  createMarker (location) {
    const latlng = location.latlng
    const name = location.name
    const description = location.description
    const user = location.user
    const address = location.address
    const zoom = this.map.getZoom()

    const icon = this.getIcon({ location, className: 'Marker' })

    const popup = new Popup(latlng, location)
    const marker = L.marker(latlng, { icon, location })
    marker.bindPopup(popup.render(), { maxWidth: 'auto'})
    marker.on('click', this.onMarkerClick.bind(this, location))
    return marker
  }

   onMarkerClick (location) {
    this.selectedMarkerOrderId = location.id - 1
    this.emit('marker:click', location.id)
   }

  selectMarker (marker, zoom = 18) {
    if (!marker) {
      return
    }

    const location = marker.options.location
    
    const zoomLevel = this.map.getZoom() < zoom ? zoom : this.map.getZoom()

      this.emit('marker:select', location.id)

    this.map.once("zoomend, moveend", () => {
      if (marker && marker.getElement()) {
        marker.openPopup()
        marker.getElement().focus()

        setTimeout(() => {
          this.map.setView(location.latlng, zoomLevel)
        }, 100)
      }
    })

    this.map.setView(location.latlng, zoomLevel)
  }

  getIcon ({ location, className }) {
    return new L.divIcon({
      className,
      html: location.id,
      iconSize: [16, 16],
      iconAnchor: new L.Point(16, 0)
    })
  }

  onMapClick (e) {
    const latlng = this.map.layerPointToLatLng(e.layerPoint);
    let clickedMarker = null;

    const markers = this.getMarkers()

    for (let i = 0; i < markers.length; i++) {
      const layerPoint = this.map.latLngToLayerPoint(markers[i].getLatLng());
      const distance = Math.sqrt(Math.pow(layerPoint.x - e.layerPoint.x, 2) + Math.pow(layerPoint.y - e.layerPoint.y, 2));
      if (distance < 40) { 
        clickedMarker = markers[i];
        break;
      }
    }

    if (clickedMarker) {
      this.map.flyTo(clickedMarker.getLatLng(), 18)
      clickedMarker.openPopup()
    }
  }

  render () {
    const coordinates = this.flattenCoordinates(this.coordinates)
    this.map = L.map('map', this.options).setView(coordinates, this.coordinates.zoom)

    this.map.on('click', this.onMapClick.bind(this))

    this.map.zoomControl.setPosition('topright')
    this.map.zoomControl.getContainer().classList.add('ZoomControl')
    this.addAttribution()
  }

  addAttribution () {
    const attribution = this.attribution

    L.tileLayer(this.tileLayer+ (L.Browser.retina ? '@2x.png' : '.png'), {
      attribution,
      subdomains: 'abcd',
      maxZoom: 22,
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

    this.map = new Map({ lng, lat, zoom })

    this.locations = locations

    this.locations.forEach((location, index) => {
      location.id = index + 1
    })

    this.$locations = document.querySelector('.js-locations')

    this.render()
    this.bindEvents()
  }

  bindKeyEvents () {
    document.addEventListener('keydown', (event) => {

      if (event.key === 'Escape') {
        event.preventDefault()
          this.unselectLocation()
      } else if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
        event.preventDefault()
        event.stopPropagation()
        this.map.goToMarker('next')
      } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
        event.stopPropagation()
        event.preventDefault()
        this.map.goToMarker('prev')
      } else if (event.key === 'Tab') {
        event.preventDefault()

        if (event.shiftKey) {
          this.map.goToMarker('prev')
        } else {
          this.map.goToMarker('next')
        }
      }
    })
  }

    unselectLocation () {
        this.$locations.querySelector(`[data-id="${this.previousLocationID}"]`).classList.remove('is-active')
        this.previousLocationID = null
        this.map.closePopup()
        this.map.show()
    }

    bindEvents () {

        this.map.on('marker:select', (id) => {
            const $element = this.$locations.querySelector(`[data-id="${id}"]`)
            $element.classList.add('is-active')
            setTimeout(() => {
                $element.scrollIntoView({behavior: "smooth", block: "nearest", inline: "start"})
            }, 300)

            if (this.previousLocationID) {
                this.$locations.querySelector(`[data-id="${this.previousLocationID}"]`).classList.remove('is-active')
            }

            this.previousLocationID = id
        })


        this.map.on('marker:click', (id) => {
            this.$locations.querySelectorAll('.js-location').forEach((element) => {
                if (element.dataset.id == id) {
                    element.classList.add('is-active')
                    if (this.previousLocationID) {
                        this.$locations.querySelector(`[data-id="${this.previousLocationID}"]`).classList.remove('is-active')
                    }
                    this.previousLocationID = id
                    element.scrollIntoView({behavior: "smooth", block: "nearest", inline: "start"})
                }
            })

      })

        this.$locations.querySelectorAll('.js-location').forEach((element) => {
            element.addEventListener('click', (event) => {
                this.showLocation(+element.dataset.id)
            })
        })

    this.bindKeyEvents()
  }

    showLocation (id) {
        if (this.previousLocationID) {
            if (this.previousLocationID === id) {
                this.unselectLocation()
                return
            }
            this.$locations.querySelector(`[data-id="${this.previousLocationID}"]`).classList.remove('is-active')
        }

        this.map.selectMarkerById(id)
    }

  render () {
    this.map.render()
    this.map.renderLocations(this.locations)
    this.map.show()
  }
}

window.onload = () => {
  new App()
}
