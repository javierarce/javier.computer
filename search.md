---
layout: base
title: Búsqueda
permalink: search
className: archive
category: posts
---

<div class="Content">
    {% include navigation.html -%}

    <div class="search">
        {% include search-form.html %}
        <ul id="search-results" class="search-results"></ul>
    </div>

<script>
  window.store = {
    {% for post in site.posts %}
      "{{ post.url | slugify }}": {
        "title": "{{ post.title | xml_escape }}",
        "author": "{{ post.author | xml_escape }}",
        "category": "{{ post.category | xml_escape }}",
        "content": {{ post.content | strip_html | normalize_whitespace | jsonify }},
        "url": "{{ post.url | xml_escape }}"
      }
      {% unless forloop.last %},{% endunless %}
    {% endfor %}
  };
</script>

{% include footer.html -%}

</div>

<script src="https://unpkg.com/lunr/lunr.js"></script>
<script src="/scripts/search.js"></script>
