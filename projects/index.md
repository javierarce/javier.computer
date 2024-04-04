---
title: Projects
permalink: projects
layout: table
category: projects
className: Projects
description: List of personal projects
---

### Documented projects 

<div class="Project__cards">
    <a href="/projects/arena" class="Project__card">
    <div class="Project__cardTitle">Kindle to Are.na</div>
    <div class="Project__cardDescription">Send your Kindle's highlights and notes to Are.na</div>
    <div class="Project__cardDate">2020</div>
    </a>
    
    <a href="/projects/enfont" class="Project__card">
    <div class="Project__cardTitle">Enfont Terrible</div>
    <div class="Project__cardDescription">A terrible, terrible type foundry</div>
    <div class="Project__cardDate">2019</div>
    </a>
    
    <a href="/projects/mapwithme" class="Project__card">
    <div class="Project__cardTitle">Map with Me</div>
    <div class="Project__cardDescription">Create collaborative maps with your friends (and enemies)</div>
    <div class="Project__cardDate">2019</div>
    </a>
    
    <a href="/bots/iremember" class="Project__card">
    <div class="Project__cardTitle">I remember bot</div>
    <div class="Project__cardDescription">A tribute to Georges Perec and his book Je me souviens</div>
    <div class="Project__cardDate">2015</div>
    </a>
</div>

{% for year in site.data.projects %}
### {{ year[0] }}

<ul class="Project__list">
{% for project in year[1] %}
<li>
<a href="{{ project.url}}">{{ project.title}}</a>
<p>{{ project.description }}</p>
</li>
{% endfor %}
</ul>
{% endfor %}
