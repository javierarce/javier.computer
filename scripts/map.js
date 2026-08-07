class Base {
  constructor() {
    this.className = this.constructor.name.toLowerCase();
    this.templateData = {};
  }

  killEvent(event) {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
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
    ...options
  }) {
    let $el = document.createElement(elementType);

    if (type) {
      $el.type = "text";
    }

    if (html) {
      $el.innerHTML = html;
    } else if (text) {
      $el.innerText = text;
    }

    className
      .split(" ")
      .filter((c) => c)
      .forEach((name) => $el.classList.add(name));

    if (!this.isEmpty(options)) {
      Object.keys(options).forEach((key) => {
        $el[key] = options[key];
      });
    }

    return $el;
  }

  template() {
    return `<div class="template"></div>`;
  }

  renderTemplate() {
    let className = this.className;
    this.$el = this.createElement({ className });
    const html = ejs.render(this.template(), this.templateData);
    this.$el.insertAdjacentHTML("beforeend", html);
  }

  on(name, callback) {
    const $el = this.$el || document.body;

    $el.addEventListener(name, (e) => {
      callback && callback(e.detail);
    });
  }

  emit(name, data) {
    if (!name) {
      console.error("Error: empty name event");
      return;
    }

    let event = undefined;

    if (data) {
      event = new CustomEvent(name, { detail: data });
    } else {
      event = new Event(name);
    }

    const $el = this.$el || document.body;
    $el.dispatchEvent(event);
  }

  render() {
    this.renderTemplate();
    return this.$el;
  }
}

class Popup extends Base {
  constructor(coordinates, options) {
    super();

    options = options || {};
    options.title = options.title || false;
    options.address = options.address || "";
    options.description = options.description || "";
    options.post_references = options.post_references || [];
    options.closed = options.closed || false;

    this.templateData = options;
  }

  template() {
    return `
      <div class="popup__content">
        <% if (title) { %><div class="popup__title"><span><%= title %></span>
          <% if (closed) { %><span class="popup__badge">Cerrado permanentemente</span><% } %>
        </div> <% } %>
        <% if (description) { %><div class="popup__description"><%- description %></div> <% } %>
        <% if (post_references && post_references.length > 0) { %><div class="popup__posts">
        <% for (let i = 0; i < post_references.length; i++) { %>
            <a class="popup__post" href="<%= post_references[i].url -%>"><%= i + 1 -%></a>
        <% } %>
        </div> <% } %>
        <% if (address) { %><div class="popup__address"><%= address %></div><% } %>
      </div>
      `;
  }

  render() {
    this.renderTemplate();

    const className = "popup";

    this.el = L.popup({
      className,
    });

    this.el.setContent(this.$el);
    let content = this.el.getContent();

    return this.el;
  }
}

class Map extends Base {
  constructor(coordinates) {
    super();
    this.selectedLocationId = null;
    // Ids the sidebar is currently showing; null means "no filter applied"
    this.visibleLocationIds = null;

    this.coordinates = coordinates;

    this.tileLayer =
      "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}";
    this.attribution =
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>';

    this.options = {
      scrollWheelZoom: true,
      zoomControl: true,
      maxBoundsViscosity: 1.0,
    };
  }

  show() {
    this.map.getContainer().classList.add("is-visible");
    this.fitBoundsToMarkers();
    this.map.invalidateSize();
  }

  hide() {
    this.map.getContainer().remove();
  }

  fitBoundsToMarkers() {
    const latlngs = this.getMarkers().map((marker) => marker.getLatLng());
    if (this.postMarkers) {
      this.postMarkers.getLayers().forEach((marker) => {
        latlngs.push(marker.getLatLng());
      });
    }

    if (!latlngs.length) {
      return;
    }

    this.map.fitBounds(L.latLngBounds(latlngs));
  }

  selectMarkerByPermalink(permalink) {
    const marker = this.getMarkers().find(
      (marker) => marker.options.location.pid === permalink,
    );

    if (marker) {
      this.selectMarker(marker, 18);
    }
  }

  selectMarkerById(id) {
    const marker = this.getMarkers().find(
      (marker) => marker.options.location.id === id,
    );

    if (!marker) {
      return;
    }

    this.selectMarker(marker, 18);
  }

  // Markers are returned in the same order the sidebar renders them: the
  // sidebar lists locations newest first, i.e. by descending id. Keeping both
  // in sync is what makes the arrow keys step to the adjacent card.
  getMarkers() {
    return this.markers
      .getLayers()
      .slice()
      .sort((a, b) => b.options.location.id - a.options.location.id);
  }

  // The markers the arrow keys can reach — the sidebar's current search
  // results, or every marker when there's no search in progress.
  getNavigableMarkers() {
    const markers = this.getMarkers();

    if (!this.visibleLocationIds) {
      return markers;
    }

    return markers.filter((marker) =>
      this.visibleLocationIds.has(marker.options.location.id),
    );
  }

  setVisibleLocationIds(ids) {
    this.visibleLocationIds = ids;
  }

  goToMarker(direction) {
    const markers = this.getNavigableMarkers();

    if (!markers.length) {
      return;
    }

    const current = markers.findIndex(
      (marker) => marker.options.location.id === this.selectedLocationId,
    );

    let index;

    if (current < 0) {
      // Nothing selected (or the selection is filtered out): enter from an end
      index = direction === "next" ? 0 : markers.length - 1;
    } else {
      index =
        direction === "next"
          ? (current + 1) % markers.length
          : (current - 1 + markers.length) % markers.length;
    }

    this.goToMarkerAt(markers[index]);
  }

  goToFirstMarker() {
    this.goToMarkerAt(this.getNavigableMarkers()[0]);
  }

  goToMarkerAt(marker) {
    if (!marker) {
      return;
    }

    this.selectMarker(marker, 18);

    const location = marker.options.location;

    window.history.replaceState(
      {},
      "",
      "/maps/" + location.location + "/" + location.pid,
    );
  }

  renderLocations(locations) {
    let markers = [];

    locations.forEach((location, index) => {
      const marker = this.createMarker(location);
      markers.push(marker);
    });

    this.markers = L.layerGroup(markers);
    this.markers.addTo(this.map);
  }

  renderGeotaggedPosts(geotaggedPosts) {
    if (!geotaggedPosts || !geotaggedPosts.length) return;

    let markers = [];

    geotaggedPosts.forEach((group) => {
      const marker = this.createPostMarker(group);
      markers.push(marker);
    });

    this.postMarkers = L.layerGroup(markers);
    this.postMarkers.addTo(this.map);
  }

  createPostMarker(group) {
    const latlng = group.latlng;
    const posts = group.posts;

    const icon = new L.divIcon({
      className: "marker marker--post",
      html: "",
      iconSize: [20, 20],
      iconAnchor: new L.Point(10, 10),
    });

    const popup = new Popup(latlng, {
      title: "Posts sobre este lugar",
      description: this.buildPostPopupHTML(posts),
    });

    const marker = L.marker(latlng, { icon, isPostMarker: true });
    marker.bindPopup(popup.render(), { maxWidth: "auto" });
    return marker;
  }

  buildPostPopupHTML(posts) {
    if (posts.length === 1) {
      return `<a href="${posts[0].url}">${posts[0].title}</a>`;
    }
    const items = posts
      .map((p) => `<li><a href="${p.url}">${p.title}</a></li>`)
      .join("");
    return `<ul>${items}</ul>`;
  }

  flattenCoordinates(coordinates) {
    return [coordinates.lat, coordinates.lng];
  }

  closePopup() {
    this.map.closePopup();
  }

  createMarker(location) {
    const latlng = location.latlng;
    const name = location.name;
    const description = location.description;
    const user = location.user;
    const address = location.address;
    const zoom = this.map.getZoom();

    const icon = this.getIcon({ location, className: "marker" });

    const popup = new Popup(latlng, location);
    const marker = L.marker(latlng, { icon, location });
    marker.bindPopup(popup.render(), { maxWidth: "auto" });
    marker.on("click", this.onMarkerClick.bind(this, location));
    return marker;
  }

  onMarkerClick(location) {
    this.selectedLocationId = location.id;
    this.emit("marker:click", location.id);
  }

  selectMarker(marker, zoom = 18) {
    if (!marker) {
      return;
    }

    const location = marker.options.location;

    const zoomLevel = this.map.getZoom() < zoom ? zoom : this.map.getZoom();

    this.selectedLocationId = location.id;
    this.emit("marker:select", location.id);

    this.map.once("zoomend, moveend", () => {
      if (marker && marker.getElement()) {
        marker.openPopup();

        setTimeout(() => {
          this.map.setView(location.latlng, zoomLevel);
        }, 100);
      }
    });

    this.map.setView(location.latlng, zoomLevel);
  }

  getIcon({ location, className }) {
    let html = location.id;
    let classNames = ["marker", "has-title"];

    if (location.emoji) {
      html = location.emoji;
      classNames.push("has-emoji");
    }

    return new L.divIcon({
      className: classNames.join(" "),
      html,
      iconSize: [16, 16],
      iconAnchor: new L.Point(16, 0),
    });
  }

  onMapClick(e) {
    const latlng = this.map.layerPointToLatLng(e.layerPoint);
    let clickedMarker = null;

    const markers = this.getMarkers();

    for (let i = 0; i < markers.length; i++) {
      const layerPoint = this.map.latLngToLayerPoint(markers[i].getLatLng());
      const distance = Math.sqrt(
        Math.pow(layerPoint.x - e.layerPoint.x, 2) +
          Math.pow(layerPoint.y - e.layerPoint.y, 2),
      );
      if (distance < 40) {
        clickedMarker = markers[i];
        break;
      }
    }

    if (clickedMarker) {
      this.map.flyTo(clickedMarker.getLatLng(), 18);
      clickedMarker.openPopup();
    }
  }

  render() {
    const coordinates = this.flattenCoordinates(this.coordinates);
    this.map = L.map("map", this.options).setView(
      coordinates,
      this.coordinates.zoom,
    );

    this.map.on("click", this.onMapClick.bind(this));

    // Leaflet prepends into bottom corners, so controls added later stack
    // higher: the zoom control moves down first, then the fit control lands
    // above the "+". setPosition rebuilds the control's container, so the
    // class has to go on afterwards or it's discarded.
    this.map.zoomControl.setPosition("bottomright");
    this.map.zoomControl.getContainer().classList.add("zoom-control");

    this.addFitControl();

    this.addExpandControl();
    this.addAttribution();
  }

  createControl({ className, position, label, onClick }) {
    const Control = L.Control.extend({
      options: { position },

      onAdd() {
        const $container = L.DomUtil.create(
          "div",
          `${className} leaflet-bar leaflet-control`,
        );

        const $button = L.DomUtil.create(
          "a",
          `${className}__button`,
          $container,
        );

        $button.href = "#";
        $button.setAttribute("role", "button");
        $button.title = label;
        $button.setAttribute("aria-label", label);

        L.DomEvent.on($button, "click", (event) => {
          L.DomEvent.stop(event);
          onClick();
        });

        L.DomEvent.disableClickPropagation($container);

        return $container;
      },
    });

    const control = new Control();
    this.map.addControl(control);

    return control.getContainer().querySelector(`.${className}__button`);
  }

  addExpandControl() {
    this.$expandButton = this.createControl({
      className: "expand-control",
      position: "topright",
      label: "Expandir el mapa",
      onClick: () => this.emit("sidebar:toggle"),
    });

    this.updateExpandControl(false);
  }

  addFitControl() {
    this.createControl({
      className: "fit-control",
      position: "bottomright",
      label: "Ver toda la ciudad",
      onClick: () => this.fitBoundsToMarkers(),
    });
  }

  updateExpandControl(isExpanded) {
    if (!this.$expandButton) {
      return;
    }

    const label = isExpanded ? "Mostrar la lista" : "Expandir el mapa";

    this.$expandButton.classList.toggle("is-expanded", isExpanded);
    this.$expandButton.title = label;
    this.$expandButton.setAttribute("aria-label", label);
    this.$expandButton.setAttribute("aria-pressed", String(isExpanded));
  }

  // The sidebar sits outside the map, so the container needs to re-measure
  // itself once the new layout has been applied
  refresh() {
    requestAnimationFrame(() => {
      this.map.invalidateSize();
    });
  }

  addAttribution() {
    const attribution = this.attribution;

    this.map.attributionControl.setPosition("bottomleft");

    L.tileLayer(this.tileLayer + (L.Browser.retina ? "@2x.png" : ".png"), {
      attribution,
      subdomains: "abcd",
      maxZoom: 22,
      minZoom: 0,
    }).addTo(this.map);
  }
}

class App {
  constructor() {
    this.$el = document.querySelector(".js-map");
    this.$bigMap = document.querySelector(".big-map");

    this.flexDirection = window
      .getComputedStyle(this.$bigMap)
      .getPropertyValue("flex-direction");

    const lng = this.$el.attributes["data-lng"].value;
    const lat = this.$el.attributes["data-lat"].value;
    const zoom = this.$el.attributes["data-zoom"].value;

    this.map = new Map({ lng, lat, zoom });

    this.locations = locations;
    this.geotaggedPosts = typeof geotaggedPosts !== "undefined" ? geotaggedPosts : [];

    this.locations.forEach((location, index) => {
      location.id = index + 1;
      location.searchText = this.buildSearchText(location);
    });

    this.$locations = document.querySelector(".js-locations");
    this.$search = document.querySelector(".js-map-search");
    this.$searchClear = document.querySelector(".js-map-search-clear");
    this.$empty = document.querySelector(".js-locations-empty");

    this.render();
    this.bindEvents();

    const queryString = window.location.href;
    const permalink = queryString.split("/").pop();

    if (permalink) {
      this.map.selectMarkerByPermalink(permalink);
    }
  }

  // Title, description and address, accent-folded so "cafe" finds "café"
  buildSearchText(location) {
    return this.normalize(
      [location.title, location.description, location.address]
        .filter(Boolean)
        .join(" ")
        .replace(/<[^>]*>/g, " "),
    );
  }

  normalize(text) {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  search(query) {
    const term = this.normalize(query).trim();
    const matchedIds = new Set();

    this.$locations.querySelectorAll(".js-location").forEach(($element) => {
      const id = +$element.dataset.id;
      const location = this.locations[id - 1];
      const matches = !term || (location && location.searchText.includes(term));

      $element.classList.toggle("is-hidden", !matches);

      if (matches) {
        matchedIds.add(id);
      }
    });

    if (this.$empty) {
      this.$empty.hidden = matchedIds.size > 0;
    }

    if (this.$searchClear) {
      this.$searchClear.hidden = !this.$search.value;
    }

    this.map.setVisibleLocationIds(term ? matchedIds : null);
  }

  bindSearchEvents() {
    if (!this.$search) {
      return;
    }

    this.$search.addEventListener("input", () => {
      this.search(this.$search.value);
    });

    if (this.$searchClear) {
      this.$searchClear.addEventListener("click", () => {
        this.clearSearch();
      });
    }
  }

  clearSearch() {
    this.$search.value = "";
    this.search("");
    this.$search.focus();
  }

  toggleSidebar() {
    const isExpanded = this.$bigMap.classList.toggle("is-expanded");

    this.map.updateExpandControl(isExpanded);
    this.map.refresh();
  }

  bindKeyEvents() {
    document.addEventListener("keydown", (event) => {
      const isSearching = event.target === this.$search;

      if (event.key === "Escape") {
        event.preventDefault();

        // While typing, Escape clears the search before it clears the selection
        if (isSearching && this.$search.value) {
          this.clearSearch();
          return;
        }

        this.unselectLocation();
      } else if (
        event.key === "ArrowDown" ||
        (event.key === "ArrowRight" && !isSearching)
      ) {
        event.preventDefault();
        event.stopPropagation();
        this.map.goToMarker("next");
      } else if (
        event.key === "ArrowUp" ||
        (event.key === "ArrowLeft" && !isSearching)
      ) {
        event.stopPropagation();
        event.preventDefault();
        this.map.goToMarker("prev");
      } else if (event.key === "Tab") {
        // Tab out of the search field jumps to the first result, keeping focus
        // in the input so you can keep typing or arrow through from there
        if (isSearching) {
          if (event.shiftKey) {
            return;
          }

          event.preventDefault();
          this.map.goToFirstMarker();
          return;
        }

        event.preventDefault();

        if (event.shiftKey) {
          this.map.goToMarker("prev");
        } else {
          this.map.goToMarker("next");
        }
      }
    });
  }

  unselectLocation() {
    const $previous = this.previousLocationID
      ? this.$locations.querySelector(`[data-id="${this.previousLocationID}"]`)
      : null;

    if ($previous) {
      $previous.classList.remove("is-active");
    }

    this.previousLocationID = null;
    this.map.closePopup();
    this.map.show();
  }

  scrollIntoView($element) {
    if (!$element) {
      return;
    }

    if (this.flexDirection !== "column") {
      $element.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "start",
      });
    }
  }

  pinMarker(id) {
    const $element = this.$locations.querySelector(`[data-id="${id}"]`);

    if (!$element) {
      return;
    }

    $element.classList.add("is-active");
    setTimeout(() => {
      this.scrollIntoView($element);
    }, 300);

    if (this.previousLocationID) {
      const $previous = this.$locations.querySelector(
        `[data-id="${this.previousLocationID}"]`,
      );

      if ($previous) {
        $previous.classList.remove("is-active");
      }
    }

    this.previousLocationID = id;
  }

  bindEvents() {
    window.addEventListener("resize", () => {
      this.flexDirection = window
        .getComputedStyle(this.$bigMap)
        .getPropertyValue("flex-direction");
    });

    this.bindSearchEvents();

    this.map.on("sidebar:toggle", this.toggleSidebar.bind(this));

    this.map.on("marker:select", this.pinMarker.bind(this));

    this.map.on("marker:click", (id) => {
      this.$locations.querySelectorAll(".js-location").forEach(($element) => {
        if ($element.dataset.id == id) {
          $element.classList.add("is-active");
          if (this.previousLocationID) {
            this.$locations
              .querySelector(`[data-id="${this.previousLocationID}"]`)
              .classList.remove("is-active");
          }
          this.scrollIntoView($element);
          this.previousLocationID = id;
          const location = this.locations[id - 1];
          const permalink = location.pid;
          window.history.replaceState(
            {},
            "",
            "/maps/" + location.location + "/" + permalink,
          );
        }
      });
    });

    this.$locations.querySelectorAll(".js-location").forEach(($element) => {
      $element.addEventListener("click", (event) => {
        const id = +$element.dataset.id;
        this.showLocation(id);
        const location = this.locations[id - 1];
        const permalink = location.pid;
        window.history.replaceState(
          {},
          "",
          "/maps/" + location.location + "/" + permalink,
        );
      });
    });

    this.bindKeyEvents();
  }

  showLocation(id) {
    if (this.previousLocationID) {
      if (this.previousLocationID === id) {
        this.unselectLocation();
        return;
      }
      this.$locations
        .querySelector(`[data-id="${this.previousLocationID}"]`)
        .classList.remove("is-active");
    }

    this.map.selectMarkerById(id);
  }

  render() {
    this.map.render();
    this.map.renderLocations(this.locations);
    this.map.renderGeotaggedPosts(this.geotaggedPosts);
    this.map.show();
  }
}

window.onload = () => {
  new App();
};
