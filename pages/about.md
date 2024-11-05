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

{% assign binocular_count = site.binoculars | size -%}

{% include now.md %}

### About this computer

This computer contains an amulet, a sphinx, [{{ post_count }} blog posts](/posts), a
collection of silly songs, [{{ photo_count }} photos](/photos), one pun, [{{
drawings }} drawings](/drawings), a modest [blogroll](/blogroll), a hidden
passage to another dimension, a ghost story, [a newsletter](/newsletter) with
{{ subscribers_count}} subscribers, a list of dog names, a list of names that
are not dog names, references to [{{ projects}} of my personal projects](/projects), a pretty accurate list of all the [movies I've
watched](/movies) since 2020, a pretty inaccurate list of all the [books I've
read](/books), references to my early memories, [{{ map_count}} maps](/maps)
listing {{ places_count }} of my favorite places, several photos of myself
eating ice cream, a list of [{{ binocular_count }} movies](/binoculars) with
scenes where binoculars are incorrectly depicted, a mirror, a coin, a yellow
bird, a photo of your turtle, a turtle.

This computer doesn't track you, your friends, or your enemies.

### Follow and subscribe

- If you like what you are reading (and why wouldn't you?), add the
  [RSS main feed](/feed.xml) to your favorite feed reader to get the updates.
- Only interested in the photos I publish? The [RSS photo feed](/feeds/photos.xml) is
  for you.
- If you want to get an email (in Spanish) every time I do something funny [subscribe to
  my newsletter](/newsletter).

### Don't be a stranger

Do you need to tell me something incredible that happened to you? [Go
here](/contact) to get in touch or write to 'email' at this domain.
