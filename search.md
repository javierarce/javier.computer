---
layout: base
title: Búsqueda
permalink: search
className: archive
category: posts
---

<div class="content">
    {% include navigation/index.html -%}

    <div class="search">
        {% include search/form.html %}
        <ul id="search-results" class="search-results"></ul>
    </div>

<script>
  window.store = {
    {% for post in site.posts %}
      {%- comment -%}
        strip_html drops href attributes, so collect each link as {url, text}.
        The anchor text is what survives into "content", so search.js uses it to
        locate the link inside an excerpt and render it back as a real link.
      {%- endcomment -%}
      {%- capture post_links -%}[
        {%- assign href_chunks = post.content | split: 'href="' -%}
        {%- for chunk in href_chunks offset: 1 -%}
          {%- assign href = chunk | split: '"' | first -%}
          {%- assign tail = chunk | split: '>' -%}
          {%- assign anchor = '' -%}
          {%- if tail.size > 1 -%}
            {%- comment -%}
              normalize_whitespace must match what "content" gets below, or an
              anchor that wraps across source lines keeps its newline and never
              lines up with the prose it came from.
            {%- endcomment -%}
            {%- assign anchor = tail[1] | split: '</a' | first | strip_html | normalize_whitespace | strip -%}
          {%- endif -%}
          {"url": {{ href | jsonify }}, "text": {{ anchor | jsonify }}}
          {%- unless forloop.last %},{% endunless -%}
        {%- endfor -%}
      ]{%- endcapture -%}
      {%- comment -%}
        Values are emitted as raw JSON strings (not xml_escape'd): search.js
        escapes them when building result HTML, so escaping here too would
        render literal "&apos;" in titles. The "</" guard keeps a title or a
        quote in the body from closing this script tag early.
      {%- endcomment -%}
      "{{ post.url | slugify }}": {
        "title": {{ post.title | jsonify | replace: '</', '<\/' }},
        "author": {{ post.author | jsonify | replace: '</', '<\/' }},
        "category": {{ post.category | jsonify | replace: '</', '<\/' }},
        "links": {{ post_links | replace: '</', '<\/' }},
        "content": {{ post.content | strip_html | normalize_whitespace | jsonify | replace: '</', '<\/' }},
        "url": "{{ post.url | xml_escape }}",
        "date": "{{ post.date | date: '%Y-%m-%dT%H:%M:%S' }}",
        "tags": {{ post.tags | where_exp: "tag", "tag != 'photo'" | jsonify }}
      }
      {% unless forloop.last %},{% endunless %}
    {% endfor %}
  };
</script>

{% include navigation/footer.html -%}

</div>
