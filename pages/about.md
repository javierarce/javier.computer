---
layout: about
title: About
description: "Javier's computer"
className: About
weather: true
permalink: about
---

{% assign post_count = site.posts | size -%}
{% assign subscribers_count = site.data.subscribers -%}
{% assign map_count = site.maps | size -%}
{% assign places_count = site.places | size -%}
{% assign photo_count = 0 -%}

{% for post in site.categories['photo'] -%}
{% assign current_count = post.filenames | size -%}
{% assign photo_count = photo_count | plus: current_count -%}
{% endfor -%}

{% assign projects = 0 -%}
{% for year in site.data.projects -%}

{% for project in year[1] -%}
{% assign projects = projects | plus: 1 -%}
{% endfor -%}
{% endfor -%}

{% assign drawings = 0 -%}
{% for post in site.drawings -%}
{% assign current_count = post.filenames | size -%}
{% assign drawings = drawings | plus: current_count -%}
{% endfor -%}

<div class="Photo">
    <div class="Photo__content with-source">
        <figure class="figure">
            <picture>
                <img class="lazy" style="--aspect-ratio: 135∶91" data-src="/assets/me.jpg" alt="Me eating ice cream" />
            </picture>
        </figure>
        <div class="figure__source">Original photo by <a href="http://ericafustero.com">Erica</a></div>
    </div>
</div>

{% include now.md %}

### About this computer

This computer contains an amulet, a sphinx, [{{ post_count }} blog
posts](/posts), a collection of silly songs, [{{ photo_count }}
photos](/photos), one pun, [{{ drawings }} drawings](/drawings), a modest
[blogroll](/blogroll), a hidden passage to another dimension, a ghost story, [a
newsletter](/newsletter) with {{ subscribers_count}} subscribers, a list of dog
names, a list of names that aren't dog names, references to [{{ projects}} of
my personal projects](/projects), a pretty accurate list of all the [movies
I've watched](/movies) since 2020, a pretty inaccurate list of all the [books
I've read](/books), references to my early memories, [{{ map_count}}
maps](/maps) listing {{ places_count }} of my favorite places in the world, several photos
of myself eating ice cream, a mirror, a coin, a yellow bird, a photo of your
turtle, a turtle.

### Wait, there's more!

<div class="About__cards">
    <div class="About__card">
        <div class="About__cardTitle">Contact</div>
        <div class="About__cardDescription">Do you need to tell me something incredible that happened to you? I want to know! <a href="/contact">Send me a message</a>.</div>
    </div>
    <div class="About__card">
        <div class="About__cardTitle">Newsletter</div>
        <div class="About__cardDescription"><a href="/newsletter">Subscribe to my newsletter</a> to get an email every time I do something extremely funny.</div>
    </div>
    <div class="About__card">
        <div class="About__cardTitle">Let's chat!</div>
        <div class="About__cardDescription"><a href="/office-hours">Schedule a meeting</a> with me and let's talk online or in person.</div>
    </div>
    <div class="About__card">
        <div class="About__cardTitle">RSS</div>
        <div class="About__cardDescription">Don't miss a post! <a href="/feed.xml">Subscribe to the main feed</a> or to the <a href="/photos.xml">photo feed</a>.
        </div>
    </div>
</div>

{% comment %}
Custom update display with random phrases, conditional year, and days ago
{% endcomment %}

{% assign random_phrases = "by a magician,while nobody was looking" | split: "," %}
{% assign phrase_count = random_phrases.size %}
{% assign random_index = site.time | date: "%s" | modulo: phrase_count %}
{% assign selected_phrase = random_phrases[random_index] %}

{% assign current_date = "now" | date: "%s" %}
{% assign update_time = site.time | date: "%s" %}
{% assign current_year = "now" | date: "%Y" %}
{% assign update_year = site.time | date: "%Y" %}
{% assign days_diff = current_date | minus: update_time | divided_by: 86400 %}

{% if days_diff < 7 and days_diff >= 0 %}
{% if days_diff == 0 %}
This computer was updated today {{ selected_phrase }}.
{% elsif days_diff == 1 %}
This computer was updated yesterday {{ selected_phrase }}.
{% else %}
This computer was updated {{ days_diff }} days ago {{ selected_phrase }}.
{% endif %}
{% else %}
{% if current_year == update_year %}
This computer was updated on {{ site.time | date: "%B %d" }} {{ selected_phrase }}.
{% else %}
This computer was updated on {{ site.time | date: "%B %d, %Y" }} {{ selected_phrase }}.
{% endif %}
{% endif %}
