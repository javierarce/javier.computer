---
layout: project
title: Map with Me
date: 2021-08-18
category: project
permalink: projects/mapwithme
show_date: true
show_title: true
---

## Map with Me 
### Make maps with your homies… or enemies

<div class="Project__intro">
<p>Working at <a href="https://carto.com">CARTO</a>, the Location Intelligence platform, taught me a lot about digital cartography and web mapping, something I’ve continued applying in several personal projects.<sup>1</sup></p>
</div>

<figure class="Figure"> 
<img class="Figure__image is-bn lazy" data-src="https://javier.work/images/mapwithme/home.jpg">
</figure>

[This project](https://map.javierarce.com) started because I wanted to create a simple solution to get travel tips from my friends. In the past, I had made a couple of interactive maps to get recommendations for my trips to Japan and [New York](https://twitter.com/javier/status/771076164517523456) and it had worked pretty well.

Setting up new maps was manual process, though. I wanted to set up new maps faster, just by clicking a button (not that I travel that often, especially since, well… you know)

Another big reason to create this project was that I wanted other people to do the same thing without dealing with server configurations.

<figure class="Figure"> 
<img class="Figure__image is-bn lazy" data-src="https://javier.work/images/mapwithme/config.jpg">
</figure>

### Export / Import

Users can subscribe to the map using RSS or download the public data in CSV format. I plan to add the option to import a list of points so users can create maps that have content right from the start. Combine this with the current export feature, and we’ll have a nice little backup system right there.

### My voice is my passport. Verify Me. 

Initially, I decided to use Twitter OAuth as the login system and also as a way to reduce spam messages. In a second version, I expanded the options to allow for more fine-grained interactions with the maps.

<figure class="Figure"> 
<img class="Figure__image is-bn lazy" data-src="https://javier.work/images/mapwithme/about.jpg">
</figure>

In the current version, map administrators can now select three different publication settings: anonymous (anybody can publish anything without login), moderated (the admin has to approve every publication), and protected (nobody except for the administrator can publish anything).

### Open-source data and locations

Right from the start of the project, I decided to avoid using any Google solution for two reasons: first, they are expensive, making it costly and complicated for other people to set up a map. Second, I don’t like their business model based on selling ads and using users' browsing data.

Because of this, the reverse geocoding (which is the system that transforms a point in a map into an address) is powered by the open-source project <a href="https://nominatim.openstreetmap.org/ui/search" target="_blank">Nominatim by OpenStreetMap</a>.
          

<figure class="Figure"> 
<img class="Figure__image is-bn lazy" data-src="https://javier.work/images/mapwithme/error.jpg">
</figure>

Since **OpenStreetMap** is a public project and has limited resources, if they don’t have the address for the location, I encourage the visitor to add it to the project themself. In a future version, I'd like to automate this process entirely. But in any case, visitors can still add the place manually to the map.

### Setting up your own map

Thanks to **Glitch's** remix functionality people can clone my example and create their own customizable map quickly. For more advanced usages, the whole project is open-source in <a href="https://github.com/javierarce/map-with-me" target="_blank">this GitHub repo</a>.

---


<div class="Footnotes">
<p><sub>1</sub> Like this one I launched back in 2015 called Spotimap, which was a catalog of 7,681 songs that were related to 212 cities across the globe. The project was covered in Boing Boing, The Washington Post, Bloomberg, and Die Welt).</p>
</div>  
