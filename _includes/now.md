{% assign books_with_status_reading = site.books | where: "status", "reading" %}

{% assign books_with_status_read = site.books | where: "status", "read" %}
{% assign sorted_books_read = books_with_status_read | sort: 'read' %}
{% assign books_with_status_reading = site.books | where: "status", "reading" %}
{% assign sorted_books_reading = books_with_status_reading | sort: 'read' %}

{% assign book = sorted_books_read | last %}
{% assign book_rating = book.rating %}
{% assign rating_phrase = "" %}

{% case book_rating %}
{% when 0 %}
{% assign book_rating_phrase = "and I didn't like it at all." %}
{% when 0.5 %}
{% assign book_rating_phrase = "and it was pretty bad." %}
{% when 1 %}
{% assign book_rating_phrase = "and it was not good." %}
{% when 1.5 %}
{% assign book_rating_phrase = "and it was meh." %}
{% when 2 %}
{% assign book_rating_phrase = "and it was okay." %}
{% when 2.5 %}
{% assign book_rating_phrase = "and it was decent." %}
{% when 3 %}
{% assign book_rating_phrase = "and it was good." %}
{% when 3.5 %}
{% assign book_rating_phrase = "and it was very good." %}
{% when 4 %}
{% assign book_rating_phrase = "and it was great." %}
{% when 4.5 %}
{% assign book_rating_phrase = "and I liked it a lot." %}
{% when 5 %}
{% assign book_rating_phrase = "and I totally recommend it!" %}
{% endcase %}

{% assign book_titles = "" -%}
{% for book in sorted_books_reading -%}
{% if forloop.first %}
{% assign book_titles = "<em>" | append: book.title | append: "</em>" -%}
{% elsif forloop.last %}
{% assign book_titles = book_titles | append: ", and <em>" | append: book.title | append: "</em>" -%}
{% else %}
{% assign book_titles = book_titles | append: ", <em>" | append: book.title | append: "</em>" -%}
{% endif %}
{% endfor %}

{% assign movie = site.data.movies.movies | first %}

{% assign movie_rating = movie.rating %}
{% assign liked = movie.liked %}
{% assign rating_phrase = "" %}

{% case movie_rating %}
{% when 0 %}
{% if liked %}
{% assign rating_phrase = "and I liked." %}
{% else %}
{% assign rating_phrase = "and I didn't like it at all." %}
{% endif %}

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

<p>¡Hola! My name is Javier Arce, <em>comme tout le monde</em>. I'm a creative
    developer, ethical designer, attentive reader, casual illustrator,
    frustrated zine-maker, compulsive photographer, and all-around silly
    human.</p>

<p>Right now I'm in {{ site.data.location[0].city }}, {{
    site.data.location[0].country }}. {% if book_titles != "" %}I'm <a
        href="/books">currently reading</a>: {{ book_titles }}. {% endif %}The
    last book I read was <em>{{ book.title }}</em> by {{ book.author }}. The last movie
    I watched was <a href="https://letterboxd.com/javier/film/{{
        movie.permalink }}">{{ movie.title }}</a> {{ rating_phrase }}
    <music-snitch data-username='javierarce' data-key
        ='78b4ae34c84de1d5fc6510338300bd78'></music-snitch></p>
