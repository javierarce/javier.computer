---
title: Movies
layout: tables
className: Movies
category: page
permalink: movies
description: Movies I've watched
---

{% assign sorted_movies = site.data.movies.movies | sort: 'watched_on' | reverse %}
{% assign grouped_movies = sorted_movies | group_by_exp: "movie", "movie.watched_on | date: '%B %Y'" %}

{% for group in grouped_movies %}

### {{ group.name }} ({{ group.items.size }})

| Day     | Title   |  Rating    |
|:--------|:--------|:-----------|
{% for movie in group.items -%}
| {{ movie.watched_on | date: "%d" }} | [{{ movie.title }}](https://letterboxd.com/javier/film/{{ movie.permalink }}) | {{ movie.stars }} |
{% endfor %}
{% endfor -%}
