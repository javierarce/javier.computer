---
layout: movies
className: Movies
title: Movies
category: page
permalink: movies
description: Movies I've watched
---


<table class="Movies">
<thead>
    <tr>
      <th style="text-align: left">Movie</th>
      <th style="text-align: left">Watched on</th>
      <th style="text-align: left">Rating</th>
    </tr>
  </thead>
  {% for movie in site.data.movies.movies -%}
  <tr>
  <td>{{ movie.title }}</td>
  <td>{{ movie.watched_on }}</td>
  <td>{{ movie.stars }}</td>
  </tr>
  {% endfor -%}
</table>
