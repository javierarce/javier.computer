{% assign books_with_status_reading = site.books | where: "status", "reading" %}
{% assign sorted_books_reading = books_with_status_reading | sort: 'read' %}

{% assign book_titles = "" %}
{% for book in sorted_books_reading %}
  {% if forloop.first %}
    {% assign book_titles = '"' | append: book.title | append: '"' %}
  {% elsif forloop.last %}
    {% assign book_titles = book_titles | append: ", and " | append: '"' | append: book.title | append: '"' %}
  {% else %}
    {% assign book_titles = book_titles | append: ", " | append: '"' | append: book.title | append: '"' %}
  {% endif %}
{% endfor %}
{% assign last_movie = site.data.movies.movies | first %}


<div class="is-now">
    Right now I'm in {{ site.data.location.city }}, {{ site.data.location.country }}. Currently reading: {{ book_titles }}. The last movie I watched was {{ last_movie.title }}. <music-snitch data-username='javierarce' data-key ='78b4ae34c84de1d5fc6510338300bd78'></music-snitch>
</div>
