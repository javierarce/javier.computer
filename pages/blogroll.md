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

<ul>
{% for blog in site.data.blogroll %}
  <li>
    <rss-reader
      data-title="{{ blog.title }}"
      data-author="{{ blog.author }}"
      data-url="{{ blog.url }}"
      data-feed="{{ blog.feed }}">
    </rss-reader>
  </li>
{% endfor %}
</ul>
