---
title: "Books"
layout: table
className: Books
description: Books I'm reading, I've read, I want to read
category: page
permalink: books
---

{% assign all_books_with_read = site.books | where: "status", "read" %}
{% assign sorted_books = all_books_with_read | sort: 'read' | reverse %}
{% assign grouped_books = sorted_books | group_by_exp: "book", "book.read | date: '%Y'" %}

{% assign books_with_status_reading = site.books | where: "status", "reading" %}
{% assign sorted_books_reading = books_with_status_reading | sort: 'started' %}

{% if sorted_books_reading.size > 0 %}

### Reading

| Title   | Author  | Started       | Rating |
|:--------|:--------|:-----------|:-------|
{% for book in sorted_books_reading -%}
{% assign content = book.content | strip_newlines -%}
{% if content != "" -%}
| [{{ book.title }}{% if book.subtitle %}<br />{{ book.subtitle }}{% endif %}]({{ book.url }}) | {{ book.author }} | {{ book.started | date: '%B %d' }} | - |
{% else -%}
| {{ book.title }}{% if book.subtitle %}<br />{{ book.subtitle }}{% endif %} | {{ book.author }} | {{ book.started | date: '%B %d' }} | - |
{% endif -%}
{% endfor -%}
{% endif -%}

{% for group in grouped_books %}
### {{ group.name }}

| Title   | Author  | Read       | Rating |
|:--------|:--------|:-----------|:-------|
{% for book in group.items -%}
{% assign content = book.content | strip_newlines -%}
{% if content != "" -%}
| [{{ book.title }}{% if book.subtitle %}<br />{{ book.subtitle }}{% endif %}]({{ book.url }}) | {{ book.author }} | {{ book.read | date: '%B %d' }} | {{ book.rating }} |
{% else -%}
| {{ book.title }}{% if book.subtitle %}<br />{{ book.subtitle }}{% endif %} | {{ book.author }} | {{ book.read | date: '%B %d' }} | {{ book.rating }} |
{% endif -%}
{% endfor -%}
{% endfor -%}
