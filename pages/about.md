---
layout: about
title: Acerca
description: "El ordenador de Javier"
className: About
category: about
weather: true
permalink: about
---

{% include about/vars.html lang="es" %}

<div class="section">
<p>Mi nombre es Javier Arce, <em>comme tout le monde</em>. Soy desarrollador
creativo, diseñador ético, lector atento, ilustrador casual, fanzinero frustrado,
fotógrafo compulsivo, y un humano un poco tonto, si me preguntas.</p>

{% assign current_location = site.data.location.cities | where: "slug", site.data.location.current | first %}
{% assign current_city_map = collections.maps | where: "location", current_location.slug | first %}
<p>Ahora mismo estoy en {% if current_city_map %}<a href="{{ current_city_map.url | relative_url }}">{{ current_location.city }}</a>{% else %}{{ current_location.city }}{% endif %}{% if book_titles != "" %}, leyendo: {{ book_titles }}. {% else %}. {% endif %}El
último libro que leí fue <a href="/books#{{ book.slug }}" class="book-title">{{ book.title }}</a> de {{ book.author }}. La última película
que vi fue <a href="https://letterboxd.com/javier/film/{{
movie.permalink }}">{{ movie.title }}</a> {{ rating_phrase }}
<music-snitch data-username='javierarce' data-key
='78b4ae34c84de1d5fc6510338300bd78'></music-snitch></p>
</div>


<div class="section">
<h3>Acerca de este ordenador</h3>

<p>Este ordenador contiene un amuleto, una esfinge, <a href="/posts">{{ post_count }}
artículos</a>, una colección de canciones tontas, <a href="/photos">{{ photo_count }}
fotos</a>, un juego de palabras, <a href="/drawings">{{ drawings }} dibujos</a>, un
modesto <a href="/blogroll">blogroll</a> con {{ site.data.blogroll | size }} fantásticos blogs y
newsletters, un pasadizo secreto a otra dimensión, una historia de
fantasmas, <a href="/newsletter">una newsletter</a> que llega a {{ subscribers_count}}
suscriptores cuando menos se lo esperan, una lista de nombres de perros, una lista de nombres que no son
de perros, referencias a <a href="/projects">{{ projects}} de mis proyectos
personales</a>, una lista bastante precisa de todas las <a href="/movies">películas que
he visto</a> desde 2020, una lista bastante imprecisa de todos los
<a href="/books">libros que he leído</a> desde 2012, referencias a mis primeros recuerdos, <a href="/maps">{{
map_count}} mapas</a> con {{ places_count }} de mis lugares favoritos del
mundo, varias fotos de mí comiendo un helado, un espejo, una moneda, un pájaro
amarillo, una foto de tu tortuga, una tortuga.</p>
</div>


<p class="is-light is-sm" data-update-timestamp="{{ site.time | date: '%s' }}">Este ordenador fue actualizado <span id="time-phrase">el {% include date.html date=site.time %}</span> {{ selected_phrase }}.</p>

<div class="section">
<div class="link-list">
    <a href="/contact" class="link-list__item">
        <span class="link-list__title">Contacto</span>
        <span class="link-list__description">¿Quieres contarme algo increíble que te ha pasado? ¡Cuéntamelo, quiero saberlo!</span>
    </a>
    <a href="/newsletter" class="link-list__item">
        <span class="link-list__title">Newsletter</span>
        <span class="link-list__description">Suscríbete a mi newsletter para recibir un email cada vez que haga algo extremadamente gracioso.</span>
    </a>
    <a href="/office-hours" class="link-list__item">
        <span class="link-list__title">¡Hablemos!</span>
        <span class="link-list__description">Agenda una reunión conmigo y hablemos online o en persona.</span>
    </a>
    <a href="/feeds" class="link-list__item">
        <span class="link-list__title">RSS</span>
        <span class="link-list__description">¡No te pierdas nada! Suscríbete a cualquiera de los feeds disponibles en esta web.</span>
    </a>
</div>
</div>
