---
title: Movies
layout: movies
className: Movies
permalink: movies
description: Movies I've watched
---

{% assign sorted_movies = site.movies | sort: 'watched_on' | reverse %}
{% assign grouped_movies = sorted_movies | group_by_exp: "movie", "movie.watched_on | date: '%B %Y'" %}

{% assign last_year = "" %}

{% for group in grouped_movies %}
{% assign current_year = group.name | split: ' ' | last %}

{% if last_year != current_year %}

<h2 class="Movie__year">{{ current_year }}</h2> 
{% assign last_year = current_year %} 
{% endif %}

<h3>{% include date.html date=group.name day="false" -%} ({{ group.items.size }})</h3>

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
