---
layout: about
title: Acerca
description: "El ordenador de Javier"
className: About
weather: true
permalink: about
---

{% include about_vars.html lang="es" %}

<div class="section">
<p>Mi nombre es Javier Arce, <em>comme tout le monde</em>. Soy desarrollador
creativo, diseñador ético, lector atento, ilustrador casual, fanzinero frustrado,
fotógrafo compulsivo, y un humano un poco tonto, si me preguntas.</p>
</div>

<p class="is-light">This page is available in English <a href="/en/about">here</a>.</p>

<div class="section">
<h3>Ahora</h3>

<p>Ahora mismo estoy en {{ site.data.location[0].city }}{% if book_titles != "" %}, <a
href="/books">leyendo</a>: {{ book_titles }}. {% else %}. {% endif %}El
último libro que leí fue <em>{{ book.title }}</em> de {{ book.author }}. La última película
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
<a href="/books">libros que he leído</a>, referencias a mis primeros recuerdos, <a href="/maps">{{
map_count}} mapas</a> con {{ places_count }} de mis lugares favoritos del
mundo, varias fotos de mí comiendo un helado, un espejo, una moneda, un pájaro
amarillo, una foto de tu tortuga, una tortuga.</p>
</div>


<div class="section">
<h3>Espera, ¡que hay más!</h3>

<div class="cards">
    <a href="/contact" class="card">
        <div class="card-title">Contacto</div>
        <div class="card-description">¿Quieres contarme algo increíble que te ha pasado? ¡Cuéntamelo, quiero saberlo!</div>
    </a>
    <a href="/newsletter" class="card">
        <div class="card-title">Newsletter</div>
        <div class="card-description">Suscríbete a mi newsletter para recibir un email cada vez que haga algo extremadamente gracioso.</div>
    </a>
    <a href="/office-hours" class="card">
        <div class="card-title">¡Hablemos!</div>
        <div class="card-description">Agenda una reunión conmigo y hablemos online o en persona.</div>
    </a>
    <a href="/feeds" class="card">
        <div class="card-title">RSS</div>
        <div class="card-description">¡No te pierdas nada! Suscríbete a cualquiera de los feeds disponibles en esta web.</div>
    </a>
</div>
</div>

<p class="is-light is-sm" data-update-timestamp="{{ site.time | date: '%s' }}">Este ordenador fue actualizado <span id="time-phrase">el {{ site.time | date: "%d de %B de %Y" }}</span> {{ selected_phrase }}.</p>
