{% assign movies = site.movies | sort: 'watched_on' | reverse -%}

<ul>
{% for movie in movies limit: 5 -%}
<li>
<a href="https://letterboxd.com/javier/film/{{ movie.permalink }}">{{ movie.title }} ({{ movie.year }})</a>
<span>{{ movie.stars }}</span> 
</li>
{% endfor %}
</ul>
