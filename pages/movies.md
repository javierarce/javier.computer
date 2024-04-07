---
title: Movies
layout: table
className: Movies
category: page
permalink: movies
description: Movies I've watched
---

{% assign sorted_movies = site.movies | sort: 'watched_on' | reverse %}
{% assign grouped_movies = sorted_movies | group_by_exp: "movie", "movie.watched_on | date: '%B %Y'" %}

{% for group in grouped_movies %}

### {{ group.name }} ({{ group.items.size }})

<ul class="Movie__list">
{% for movie in group.items -%}
<li>
<span class="Movie__listDate">{{ movie.watched_on | date: "%d" }}</span>
<a href="https://letterboxd.com/javier/film/{{ movie.permalink }}">{{ movie.title }} ({{ movie.year }})</a>
<span>{{ movie.stars }}</span> 
</li>
{% endfor %}
</ul>
{% endfor -%}
