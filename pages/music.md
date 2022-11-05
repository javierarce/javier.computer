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

      <div class="Music__album">
      <a href="{{ post.url }}" target="_blank"><img class="Photo lazy" data-src="{{ post.img }}" /></a>
{{ post.title }} by {{ post.band }}
      </div>

    {% endfor -%}
  </div>


  {% include footer.html %}
</div>
