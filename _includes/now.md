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

Right now I'm in {{ site.data.location.city }}, {{ site.data.location.country }}. Currently reading: {{ book_titles }}.
