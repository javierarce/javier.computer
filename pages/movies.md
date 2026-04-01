---
title: Movies
layout: simple
className: Movies
permalink: movies
description: Movies I've watched
---

{% assign sorted_movies = site.movies | sort: 'watched_on' | reverse -%}
{% assign grouped_movies = sorted_movies | group_by_exp: "movie", "movie.watched_on | date: '%B %Y'" -%}

{% assign last_year = "" -%}

{% for group in grouped_movies -%}
{% assign current_year = group.name | split: ' ' | last -%}

{% if last_year != current_year -%}

<div class="movies">
<h2 class="movies__year">{{ current_year }}</h2> 
{% assign last_year = current_year -%} 
{% endif -%}

<h3 class="movies__month">{% include date.html date=group.name day="false" -%} ({{ group.items.size }})</h3>

<ul class="movie__list">
{% for movie in group.items -%}
<li class="movie">
    <span class="day">{{ movie.watched_on | date: "%d" }}</span>
    <div class="movie__content">
        <a href="https://letterboxd.com/javier/film/{{ movie.permalink }}" class="movie__title">{{ movie.title }} ({{ movie.year }})</a>
        <span class="movie__stars">{{ movie.stars }}</span>
    </div>
</li>
{% endfor -%}
</ul>
{% endfor -%}
</div>
