---
title: Projects
permalink: projects
layout: simple
category: projects
className: Projects
description: List of personal projects
---

<div class="projects">
<div class="projects__lists">
{% assign project_years = site.data.projects | sort | reverse %}
{% for year in project_years %}

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
