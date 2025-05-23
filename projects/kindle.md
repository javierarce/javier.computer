---
layout: project
title: Kindle to Arena
date: 2021-08-18
category: project
permalink: projects/arena
show_date: true
show_title: true
---

## Kindle to Are.na

### A little gift for the geeks

<div class="Project__intro">
<p>This project was a gift to one of my favorite communities
, <a href="https://are.na">Are.na</a>. With <a href="https://arena.javierarce.com">Kindle to Arena</a> people can easily send highlights and notes from their Kindle reader into <strong>Are.na</strong>.</p></div>

<figure class="figure"> 
<img class="figure__image is-bn lazy" data-src="https://javier.work/images/arena/home.jpg">
</figure>

### What is Are.na?

[Are.na](https://are.na) is an open space where people can organize their thoughts and documents to collaborate, research, and learn together. I love its cooperative orientation in collecting knowledge and the 'slow' approach to socializing online.

**Are.na** has been described as "social media for people who dislike social media", "social media that doesn’t damage your brain," and also "Pinterest for nerds." I think all those descriptions are highly accurate.

<figure class="figure"> 
<img class="figure__image is-bn lazy" data-src="https://javier.work/images/arena/highlights.jpg">
</figure>

### How does it work?

Users connect their Kindle devices with their computers, pick a file called My Clippings.txt, and then drop it into the website. A server running Node.js parses the file, extracts the clippings, and displays the information. From there users can select their highlights and notes, and send them to their Are.na channels.

Like with my [enFont Terrible project](/projects/enfont), I took a respectful approach to privacy: which means that I never store user data on my server. But to avoid having to upload the clippings file every time the user wants to interact with the site, the information is stored locally in the Local Storage of their browsers. This way, if users reload the page or close the browser, they won't need to re-upload the file.

The user can modify the highlights and notes before sending the data to Are.na, and since Are.na uses Markdown in the description of the content, users can apply their own formatting.

<figure class="figure"> 
<img class="figure__image is-bn lazy" data-src="https://javier.work/images/arena/about.jpg">
</figure>

Future updates include adding a mechanism to create simple templates so users can customize the way they publish the highlights, and an option to share the clippings into a common Are.na channel.

The project's code is publicly available in [this GitHub repo](https://github.com/javierarce/kindle-to-arena).
