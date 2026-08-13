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
      },
    {% endfor %}
    {%- comment -%}
      Places are indexed next to the posts, so searching "tenzan" finds the
      place itself and not only the posts that happen to mention it. The data
      comes from site.data.locations — what the city maps render — rather than
      from the collection, so a result carries the same title, description and
      address the map shows, and links to the place on its map.

      Tags go in "category" and the street in "address", not in "content":
      both are worth matching on, but appending them to the description would
      leave them dangling at the end of every excerpt. The address is shown in
      the footer instead, where a post carries its date.

      This is a JS object literal, not JSON, so the trailing comma each entry
      leaves behind is fine — and it keeps posts and places from having to know
      which of them is written last.
    {%- endcomment -%}
    {% for city in site.data.locations %}
      {%- assign city_key = city[0] -%}
      {%- assign city_map = site.maps | where: "location", city_key | first -%}
      {%- comment -%}
        Only cities with a map of their own: site.data.locations also holds
        older entries ("unknown", "nyc") that nothing renders, and a result
        pointing at a map that doesn't exist is worse than no result. A place
        with no pid has nowhere to link to either.
      {%- endcomment -%}
      {% if city_map %}
        {% for place in city[1] %}
          {% if place.pid and place.pid != '' %}
            {%- assign place_content = place.description | strip_html | normalize_whitespace | strip -%}
            "place-{{ city_key | slugify }}-{{ place.pid | slugify }}": {
              "type": "place",
              "title": {{ place.title | jsonify | replace: '</', '<\/' }},
              "category": {{ place.tags | join: ", " | jsonify | replace: '</', '<\/' }},
              "address": {{ place.address | jsonify | replace: '</', '<\/' }},
              "content": {{ place_content | jsonify | replace: '</', '<\/' }},
              "url": "/maps/{{ city_key | xml_escape }}/{{ place.pid | xml_escape }}",
              "city": {{ city_map.title | jsonify | replace: '</', '<\/' }},
              "cityUrl": "{{ city_map.url | xml_escape }}",
              "closed": {% if place.closed %}true{% else %}false{% endif %}
            },
          {% endif %}
        {% endfor %}
      {% endif %}
    {% endfor %}
  };
</script>

{% include navigation/footer.html -%}

</div>
