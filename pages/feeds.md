---
title: Feeds
permalink: feeds
layout: simple
className: Feeds
description: RSS feeds for javier.computer
---

<div class="feeds">

Aquí encontrarás todos los feeds RSS disponibles en esta web. Añádelos a tu lector de feeds favorito y no te pierdas nada.

<p class="is-light">Here you'll find all the RSS feeds available on this site. Add them to your favorite feed reader and never miss an update.</p>
<div class="feeds__section">
<div class="cards">
    <a href="/feed.xml" class="card">
        <div class="card-title">Posts</div>
        <div class="card-description">All blog posts, including photos, music, and everything else.</div>
        <div class="card-badge"><span class="icon icon-rss"></span></div>
    </a>
    <a href="/feeds/photos.xml" class="card">
        <div class="card-title">Photos</div>
        <div class="card-description">Photo posts and reportages.</div>
        <div class="card-badge"><span class="icon icon-rss"></span></div>
    </a>
    <a href="/feeds/blogroll.opml" class="card">
        <div class="card-title">Blogroll</div>
        <div class="card-description">All the blogs and newsletters I follow, as an OPML file.</div>
        <div class="card-badge"><span class="icon icon-rss"></span></div>
    </a>
</div>
</div>

<div class="feeds__section">
<h3 class="section-title">Places</h3>

<div class="cards">

<a href="/feeds/places.xml" class="card">
<div class="card-title">Places</div>
<div class="card-description">All my favorite places across every city.</div>
<div class="card-badge"><span class="icon icon-rss"></span></div>
</a>
</div>
</div>

<div class="feeds__section">
<h4>City feeds</h4>

<div class="cards">
{% for map in site.maps -%}
<a href="/feeds/{{ map.location }}.xml" class="card">
<div class="card-title">{{ map.title }}</div>
<div class="card-description">Places in {{ map.title }}.</div>
<div class="card-badge"><span class="icon icon-rss"></span></div>
</a>
{% endfor -%}
</div>
</div>
</div>
