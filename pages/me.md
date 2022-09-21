---
layout: base
title:  About me
description: "Javier's computer"
className: About
permalink: me
---

<div class="Content">
  {% include navigation.html %}

  <div class="Content__inner">
    {% capture about %}{% include content/me.md %}{% endcapture %}
    {{ about | markdownify }}
  </div>

  {% include footer.html %}
</div>

