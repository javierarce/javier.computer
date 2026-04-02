---
title: Projects
permalink: projects
layout: simple
category: projects
className: Projects
description: List of personal projects
---

<div class="projects">
<h4 class="section-divider">Documented projects</h4>

<div class="cards projects__cards">
    <a href="/projects/arena" class="card">
        <div class="card-title">Kindle to Are.na</div>
        <div class="card-description">Send your Kindle's highlights and notes to Are.na</div>
        <div class="card-date">2020</div>
    </a>

    <a href="/projects/enfont" class="card">
    <div class="card-title">Enfont Terrible</div>
    <div class="card-description">A terrible, terrible type foundry</div>
    <div class="card-date">2019</div>
    </a>

    <a href="/projects/mapwithme" class="card">
    <div class="card-title">Map with Me</div>
    <div class="card-description">Create collaborative maps with your friends (and enemies)</div>
    <div class="card-date">2019</div>
    </a>

    <a href="/bots/iremember" class="card">
    <div class="card-title">I remember bot</div>
    <div class="card-description">A tribute to Georges Perec and his book Je me souviens</div>
    <div class="card-date">2015</div>
    </a>

</div>

<div class="projects__lists">
{% for year in site.data.projects %}

<div class="projects__year">
    <h4 class="section-divider">{{ year[0] }}</h4>
    <ul class="project__list">
        {% for project in year[1] %}
        <li>
            <a href="{{ project.url}}">{{ project.title}}</a>
            <p>{{ project.description }}</p>
        </li>
        {% endfor %}
    </ul>
</div>
{% endfor %}
</div>
</div>
