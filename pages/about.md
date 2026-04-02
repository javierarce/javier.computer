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

{% assign random_phrases = site.data.reasons -%}
{% assign phrase_count = random_phrases.size -%}
{% assign random_index = site.time | date: "%s" | modulo: phrase_count -%}
{% assign selected_phrase = random_phrases[random_index] -%}

{% assign current_timestamp = 'now' | date: "%s" -%}
{% assign update_timestamp = site.time | date: "%s" -%}

<div class="photo">
    <div class="photo__content with-source">
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
[blogroll](/blogroll) with {{ site.data.blogroll | size }} fantastic blogs and newsletters, a hidden passage to another dimension, a ghost story, [a
newsletter](/newsletter) that reaches {{ subscribers_count}} subscribers, a list of dog
names, a list of names that aren't dog names, references to [{{ projects}} of
my personal projects](/projects), a pretty accurate list of all the [movies
I've watched](/movies) since 2020, a pretty inaccurate list of all the [books
I've read](/books), references to my early memories, [{{ map_count}}
maps](/maps) listing {{ places_count }} of my favorite places in the world, several photos
of myself eating ice cream, a mirror, a coin, a yellow bird, a photo of your
turtle, a turtle.

<p data-update-timestamp="{{ site.time | date: '%s' }}">This computer was updated <span id="time-phrase">on {{ site.time | date: "%B %d, %Y" }}</span> {{ selected_phrase }}.</p>

### Wait, there's more!

<div class="cards">
    <a href="/contact" class="card">
        <div class="card-title">Contact</div>
        <div class="card-description">Do you need to tell me something incredible that happened to you? I want to know! Send me a message.</div>
    </a>
    <a href="/newsletter" class="card">
        <div class="card-title">Newsletter</div>
        <div class="card-description">Subscribe to my newsletter to get an email every time I do something extremely funny.</div>
    </a>
    <a href="/office-hours" class="card">
        <div class="card-title">Let's chat!</div>
        <div class="card-description">Schedule a meeting with me and let's talk online or in person.</div>
    </a>
    <a href="/feeds" class="card">
        <div class="card-title">RSS</div>
        <div class="card-description">Don't miss a post! Subscribe to any of the feeds available on this site.</div>
    </a>
</div>
