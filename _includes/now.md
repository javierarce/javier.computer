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
{% assign movie = site.data.movies.movies | first %}
{% assign movie_rating = movie.rating %}
{% assign rating_phrase = "" %}

{% case movie_rating %}
  {% when 0 %}
    {% assign rating_phrase = "and I didn't like it at all." %}
  {% when 0.5 %}
    {% assign rating_phrase = "and it was pretty bad." %}
  {% when 1 %}
    {% assign rating_phrase = "and it was not good." %}
  {% when 1.5 %}
    {% assign rating_phrase = "and it was meh." %}
  {% when 2 %}
    {% assign rating_phrase = "and it was okay." %}
  {% when 2.5 %}
    {% assign rating_phrase = "and it was decent." %}
  {% when 3 %}
    {% assign rating_phrase = "and it was good." %}
  {% when 3.5 %}
    {% assign rating_phrase = "and it was very good." %}
  {% when 4 %}
    {% assign rating_phrase = "and it was great." %}
  {% when 4.5 %}
    {% assign rating_phrase = "and I liked it a lot." %}
  {% when 5 %}
    {% assign rating_phrase = "and I totally recommend it!" %}
{% endcase %}

<div class="is-now">
    Right now I'm in {{ site.data.location.city }}, {{ site.data.location.country }}. Currently reading: {{ book_titles }}. The last movie I watched was "{{ movie.title }}" {{ rating_phrase }} <music-snitch data-username='javierarce' data-key ='78b4ae34c84de1d5fc6510338300bd78'></music-snitch>
</div>
