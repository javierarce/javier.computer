---
title: Feeds
permalink: feeds
layout: simple
className: Feeds
description: RSS feeds for javier.computer
---

<div class="feeds">

<div class="section">
    <p>Aquí encontrarás todos los feeds RSS disponibles en esta web. Añádelos a tu lector de feeds favorito y no te pierdas nada.</p>
    <p class="is-light">Here you'll find all the RSS feeds available on this site. Add them to your favorite feed reader and never miss an update.</p>
</div>

<div class="feeds__section">
<div class="cards">
    <a href="/feed.xml" class="card">
        <div class="card-title">Posts</div>
        <div class="card-description">Posts y fotos</div>
        <div class="card-badge"><span class="icon icon-rss"></span></div>
    </a>
    <a href="/feeds/photos.xml" class="card">
        <div class="card-title">Fotos</div>
        <div class="card-description">Solo las fotografías</div>
        <div class="card-badge"><span class="icon icon-rss"></span></div>
    </a>
    <a href="/feeds/blogroll.opml" class="card">
        <div class="card-title">Blogroll</div>
        <div class="card-description">Algunos de mis blogs y newsletters favoritas en un fichero OPML</div>
        <div class="card-badge"><span class="icon icon-rss"></span></div>
    </a>
</div>
</div>

<div class="feeds__section">
<h3 class="section-title">Lugares</h3>

<div class="cards">

<a href="/feeds/places.xml" class="card">
<div class="card-title">Lugares</div>
<div class="card-description">Mis sitios favoritos en todas las ciudades</div>
<div class="card-badge"><span class="icon icon-rss"></span></div>
</a>
</div>
</div>

<div class="feeds__section">
<h4>Feeds por ciudad</h4>

<div class="cards">
{% for map in site.maps -%}
<a href="/feeds/{{ map.location }}.xml" class="card">
<div class="card-title">{{ map.title }}</div>
<div class="card-description">Sitios en {{ map.title }}</div>
<div class="card-badge"><span class="icon icon-rss"></span></div>
</a>
{% endfor -%}
</div>
</div>
</div>
