---
layout: about
title: About
description: "Javier's computer"
className: About
weather: true
permalink: en/about
lang: en
---

{% include about/vars.html lang="en" %}

<div class="section">
<p>My name is Javier Arce, <em>comme tout le monde</em>. I'm a creative
    developer, ethical designer, attentive reader, casual illustrator,
    frustrated zine-maker, compulsive photographer, and all-around silly
    human.</p>


</div>
<p class="is-light">Esta página está disponible en castellano <a href="/about">aquí</a>.</p>

<div class="section">
<h3>Now</h3>

<p>Right now I'm in {{ site.data.location[0].city }}, {{
    site.data.location[0].country }}. {% if book_titles != "" %}I'm <a
        href="/books">currently reading</a>: {{ book_titles }}. {% endif %}The
    last book I read was <em>{{ book.title }}</em> by {{ book.author }}. The last movie
    I watched was <a href="https://letterboxd.com/javier/film/{{
        movie.permalink }}">{{ movie.title }}</a> {{ rating_phrase }}
    <music-snitch data-username='javierarce' data-key
        ='78b4ae34c84de1d5fc6510338300bd78'></music-snitch></p>
</div>

<div class="section">
<h3>About this computer</h3>

<p>This computer contains an amulet, a sphinx, <a href="/posts">{{ post_count }} blog
posts</a>, a collection of silly songs, <a href="/photos">{{ photo_count }}
photos</a>, one pun, <a href="/drawings">{{ drawings }} drawings</a>, a modest
<a href="/blogroll">blogroll</a> with {{ site.data.blogroll | size }} fantastic blogs and newsletters, a hidden passage to another dimension, a ghost story, <a href="/newsletter">a
newsletter</a> that reaches {{ subscribers_count}} subscribers, a list of dog
names, a list of names that aren't dog names, references to <a href="/projects">{{ projects}} of
my personal projects</a>, a pretty accurate list of all the <a href="/movies">movies
I've watched</a> since 2020, a pretty inaccurate list of all the <a href="/books">books
I've read</a>, references to my early memories, <a href="/maps">{{ map_count}}
maps</a> listing {{ places_count }} of my favorite places in the world, several photos
of myself eating ice cream, a mirror, a coin, a yellow bird, a photo of your
turtle, a turtle.</p>
</div>


<div class="section">
<h3>Wait, there's more!</h3>

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
</div>

<p class="is-light is-sm" data-update-timestamp="{{ site.time | date: '%s' }}">This computer was updated <span id="time-phrase">on {{ site.time | date: "%B %d, %Y" }}</span> {{ selected_phrase }}.</p>
