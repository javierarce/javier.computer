---
title: Projects
permalink: projects
layout: simple
category: projects
className: Projects
description: List of personal projects
---

<div class="projects">
<h3>Documented projects</h3>

<div class="project__cards">
    <a href="/projects/arena" class="project__card">
        <div class="project__card-title">Kindle to Are.na</div>
        <div class="project__card-description">Send your Kindle's highlights and notes to Are.na</div>
        <div class="project__card-date">2020</div>
    </a>

    <a href="/projects/enfont" class="project__card">
    <div class="project__card-title">Enfont Terrible</div>
    <div class="project__card-description">A terrible, terrible type foundry</div>
    <div class="project__card-date">2019</div>
    </a>

    <a href="/projects/mapwithme" class="project__card">
    <div class="project__card-title">Map with Me</div>
    <div class="project__card-description">Create collaborative maps with your friends (and enemies)</div>
    <div class="project__card-date">2019</div>
    </a>

    <a href="/bots/iremember" class="project__card">
    <div class="project__card-title">I remember bot</div>
    <div class="project__card-description">A tribute to Georges Perec and his book Je me souviens</div>
    <div class="project__card-date">2015</div>
    </a>

</div>

<div class="projects__lists">
{% for year in site.data.projects %}

<div class="projects__year">
    <h3>{{ year[0] }}</h3>
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
