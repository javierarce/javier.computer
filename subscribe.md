---
layout: newsletter
title: Newsletter
description: >
  Únete a las 147 personas que están confundidas y suscritas a mi lista de
  correo de bajísima intensidad, y recibe avisos cuando publique un nuevo
  proyecto o haga algo extremadamente gracioso.
permalink: newsletter
className: About
---

{% assign subscribers_count = site.data.subscribers -%}

<div class="section">
    <p>Únete a las <span id="subscribers-count">{{ subscribers_count }}</span> personas que están confundidas y suscritas a mi lista de correo de bajísima intensidad, y recibe avisos cuando publique un nuevo proyecto o haga algo extremadamente gracioso.</p>
    <p><a href="/tags/newsletter">Consulta el archivo</a>.</p>
</div>

<p class="is-light">Join the <span>{{ subscribers_count }}</span> confused people subscribed to my very low-intensity mailing list, and get notified when I publish a new project or do something extremely funny. 

<div class="Contact">
    <div class="js-newsletter-container"></div>
</div>
