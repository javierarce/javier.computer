---
layout: about
title:  About
description: "Javier's computer"
className: About
weather: true
permalink: about
---
{% assign post_count = site.posts | size -%}
{% assign subscribers_count = site.data.subscribers -%}
{% assign map_count = site.maps | size -%}
{% assign places_count = site.places | size -%}
{% assign photos = 0 -%}

{% for post in site.categories['photo'] -%}
  {% assign current_count = post.filenames | size -%}
  {% assign photos = photos | plus: current_count -%}
{% endfor -%}

{% assign drawings = 0 -%}
{% for post in site.drawings -%}
  {% assign current_count = post.filenames | size -%}
  {% assign drawings = drawings | plus: current_count -%}
{% endfor -%}

My name is [Javier Arce](/me), <em>comme tout le monde</em>. I'm very into: [making things online](/projects),
[taking pictures](/photos), [reading](/books), [drawing](/drawings), and [watching movies](/movies).

{% include now.md %}

### About this site

This site contains a wiki, [{{ post_count }} blog posts](/archive), a collection of silly songs, [{{ photos }} photos](/photos), at least one pun, [{{ drawings }} drawings](/drawings), a modest [blogroll](/blogroll), a hidden passage to another dimension, a ghost story, [a newsletter](/newsletter) with {{ subscribers_count}} subscribers, a list of dog names, a list of names that are not dog names, references to my early memories, [{{ map_count}} maps](/maps) listing {{ places_count }} of my favorite places, several photos of myself eating ice cream, a mirror, a coin, a yellow bird, a photo of your turtle, a turtle.

This site doesn't track you, your friends, or your enemies.

### Don't be a stranger

If you like what you are reading (and why wouldn't you?), add this
[RSS](/feed.xml) feed to your favorite feed reader to get the updates. If you
are only interested in the photos I publish, this [RSS](/feeds/photos.xml) is
for you.

Do you need to tell me something incredible that happened to you recently? [Use
this link](https://javier.computer/contact) to get in touch with me.
