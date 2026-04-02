{% include about_vars.html lang="en" -%}

<p>¡Hola! My name is Javier Arce, <em>comme tout le monde</em>. I'm a creative
    developer, ethical designer, attentive reader, casual illustrator,
    frustrated zine-maker, compulsive photographer, and all-around silly
    human.</p>

<p>Right now I'm in {{ site.data.location[0].city }}, {{
    site.data.location[0].country }}. {% if book_titles != "" %}I'm <a
        href="/books">currently reading</a>: {{ book_titles }}. {% endif %}The
    last book I read was <em>{{ book.title }}</em> by {{ book.author }}. The last movie
    I watched was <a href="https://letterboxd.com/javier/film/{{
        movie.permalink }}">{{ movie.title }}</a> {{ rating_phrase }}
    <music-snitch data-username='javierarce' data-key
        ='78b4ae34c84de1d5fc6510338300bd78'></music-snitch></p>
