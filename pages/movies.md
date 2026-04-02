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

<div class="movies date-list">
<h3 class="date-list__year">{{ current_year }}</h3>
{% assign last_year = current_year -%}
{% endif -%}

<h4 class="date-list__month-name section-divider">{% include date.html date=group.name day="false" -%} ({{ group.items.size }})</h4>

<ul class="date-list__items">
{% assign last_day = "" -%}
{% for movie in group.items -%}
{% assign current_day = movie.watched_on | date: "%d" -%}
{% if current_day != last_day -%}
{% if last_day != "" -%}
</div>
</li>
{% endif -%}
<li class="date-list__row">
    <span class="day">{{ current_day }}</span>
    <div class="date-list__links">
{% else -%}
        <span class="Post__footerSeparator">&middot;</span>
{% endif -%}
        <a href="https://letterboxd.com/javier/film/{{ movie.permalink }}">{{ movie.title }} ({{ movie.year }})</a>
        {% if movie.stars != "" -%}<span class="movie__stars">{{ movie.stars }}</span>{% endif -%}
{% assign last_day = current_day -%}
{% endfor -%}
    </div>
</li>
</ul>
{% endfor -%}
</div>
