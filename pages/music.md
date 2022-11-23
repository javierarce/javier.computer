---
layout: base
title: Music
category: page
permalink: music
description: Music I like
---

<div class="Content">
  {% include navigation.html -%}

  <div class="Music__grid">
    {% for post in site.categories.music -%}
      <a href="{{ post.url }}" class="Music__album">
      <img class="Photo lazy" data-src="{{ post.img }}" />
      <div class="Music__albumTitle">{{ post.title }} by {{ post.band }}</div>
      </a>
    {% endfor -%}
  </div>


  {% include footer.html %}
</div>
