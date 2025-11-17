---
layout: page
title: Blogroll
category: page
permalink: blogroll
date: 2023-01-03
show_title: false
show_date: false
show_description: false
description: A list of blogs and newsletters that I enjoy reading
className: Blogroll
---

<a href="/feeds/blogroll.opml" download="blogroll.opml">Descárgate la lista</a>
en formato OPML, impórtala en tu lector de RSS y sé tan listo como yo leyendo
mis blogs y newsletters favoritas.

### Blogs

<ul>
{% assign sorted_blogs = site.data.blogroll | where: "type", "blog" | sort: "author" %}
{% for blog in sorted_blogs %}
{% if blog.type == "blog" %}
<li>
<rss-reader
        data-title="{{ blog.author }}"
        data-author="{{ blog.author }}"
        data-url="{{ blog.url }}"
        data-feed="{{ blog.feed }}">
</rss-reader>
</li>
{% endif %}
{% endfor %}

</ul>

### Newsletters

<ul>
{% assign sorted_newsletters = site.data.blogroll | where: "type", "newsletter" | sort: "title" %}
{% for blog in sorted_newsletters %}
  {% if blog.type == "newsletter" %}
    <li>
      <rss-reader
        data-title="{{ blog.title }}"
        data-author="{{ blog.author }}"
        data-url="{{ blog.url }}"
        data-feed="{{ blog.feed }}">
      </rss-reader>
    </li>
  {% endif %}
{% endfor %}
</ul>
