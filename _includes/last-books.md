{% assign books = site.books | sort: 'read' | reverse -%}

<ul>
{% for book in books limit: 5 -%}
<li>{{ book.title }}</li>
{% endfor %}
</ul>
