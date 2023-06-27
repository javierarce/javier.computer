---
layout: base
className: Photos
---

<div class="Content">
  {% include navigation.html -%}

<div class="Maps__archive">
  {% for map in site.maps -%}
    {% assign locations_count = site.data.locations[map.location].size %}
    {% if locations_count > 0 %}

  <div class="Map__item">
      <a class="Maps__itemThumbnail" href="/{{ map.permalink }}">{{ map.title}}</a>
     <div class="Maps__itemDescription">{{ locations_count }} lugares</div>
  </div>
  {% endif -%}
  {% endfor -%}
</div>
  {% include footer.html %}
</div>
