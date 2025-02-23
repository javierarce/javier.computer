---
layout: project
title: Enfont Terrible
date: 2021-08-18
category: project
permalink: projects/enfont
show_date: true
show_title: true
---

## Enfont Terrible

### A terrible type foundry

<div class="Project__intro">
This project combines many of the things I care about:
design, code, typography… and silly puns. <a href="https://enfont.javierarce.com" target="_blank" rel="nofollow">enFont Terrible</a> produces web fonts by applying random transformations to your typography. 
</div>

<figure class="figure"> 
<img class="figure__image is-bn lazy" data-src="https://javier.work/images/enfont/home.jpg">
</figure>

### How does it work?

To use this website, users can drag and drop a font file in Open Type format. The website reads the file and then allows them to interact with a sample word using three controllers that affect the text in different ways. Once the users are (extremely) happy with the deformations applied, they can download the font and install it like a regular one.

<div class="figure">
<video class="figure__videoFile has-border" autoplay muted preload loop>
<source src="https://javier.work/videos/enfont.mp4" type="video/mp4">
</video>
<div class="Photo__caption">
Because the deformations are applied to every symbol, instead of showing
a charset map I decided to show random words and allow users to change them.
</div>
</div>

### Internals

I used <a href="https://opentype.js.org" target="_blank" rel="nofollow">OpenType.js</a> to parse the font files and generate the typography, and <a href="https://p5js.org" target="_blank" rel="nofollow">P5.js</a> to animate the glyphs and render the font onto the screen.

The project runs on Node.js, and it's hosted on <a href="http://glitch.com/" target="_blank" rel="nofollow">Glitch</a>, which is this cool community where you can publish code experiments and share them with other people.

<figure class="figure"> 
<img class="figure__image is-bn lazy" data-src="https://javier.work/images/enfont/terrible.jpg">
<div class="Photo__caption">
"Show marks" shows the points that are affected by the transformations.
</div>
</figure>

### Privacy

The font is generated in the browser. The original file that users drop in the website never touches the server, so they can rest assured that their original font files won't be shared.

<div class="figure">
<video class="figure__videoFile has-border" autoplay muted preload loop>
<source src="https://javier.work/videos/thanks.mp4" type="video/mp4">
</video>
</div>
