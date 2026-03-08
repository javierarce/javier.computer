Hi, stranger! Welcome to my little computer on the net!

This website contains a wiki, several blog posts, a collection of silly songs,
a pun, a hidden passage to another dimension, a list of dog names, a list of
names that are not dog names, references to my early memories, several photos
of myself eating ice cream, a coin, a yellow bird, a photo of your turtle, a
turtle.

I get sad when I spend my time consuming instead of making things. This website
is my attempt to spend more time thinking, documenting, and making.

---

## Writing a reportage

Reportage posts mix text blocks, photos, and photo layouts using four custom Liquid tags.

### `{% photo %}`

Embeds a single photo.

```liquid
{% photo location filename %}
{% photo location filename ratio %}
{% photo location filename ratio alt:"Alt text" %}
{% photo location filename ratio caption:"Caption shown below photo" %}
{% photo location filename ratio alt:"Alt text" caption:"Caption" class:is-wide %}
```

| Argument        | Type       | Description                                      |
| --------------- | ---------- | ------------------------------------------------ |
| `location`      | positional | CDN folder name (e.g. `berlin`, `barcelona`)     |
| `filename`      | positional | File name without extension or size suffix       |
| `ratio`         | positional | Aspect ratio as `w/h` (e.g. `3/2`, `2/3`, `1/1`) |
| `alt:"..."`     | named      | Alt text for the image                           |
| `caption:"..."` | named      | Caption displayed below the photo                |
| `class:name`    | named      | Extra CSS class (`is-wide`, `is-ok`)             |

### `{% stack %}` / `{% endstack %}`

Vertical stack of photos or layout elements. Accepts optional modifier classes: `has-margin-top`, `has-margin-bottom`, `with-caption`.

```liquid
{% stack %}
{% photo barcelona R0018016 3/2 %}
{% photo barcelona R0018017 3/2 %}
{% endstack %}
```

### `{% row %}` / `{% endrow %}`

Horizontal row of photos displayed side by side. Accepts optional modifier classes: `has-two`, `has-margin-bottom`.

```liquid
{% row %}
{% photo berlin R0003695 2/3 %}
{% photo berlin R0003700 2/3 %}
{% endrow %}
```

### `{% text %}` / `{% endtext %}`

Text block interspersed between photos. Accepts optional modifier class: `has-margin-top`.

```liquid
{% text %}
<p>Spanish text here.</p>
<p class="is-light">English translation here.</p>
{% endtext %}
```

### `{% grid %}` / `{% endgrid %}`

Auto-fit photo grid. Accepts optional layout variants: `is-vertical`, `is-square`, `is-half`.

```liquid
{% grid is-vertical %}
{% photo berlin R0003695 %}
{% photo berlin R0003700 %}
{% endgrid %}
```

### Full example

```liquid
{% text %}
<p>Intro text.</p>
<p class="is-light">English translation.</p>
{% endtext %}

{% stack %}
{% photo barcelona R0018016 3/2 alt:"Person on a bench" %}
{% row %}
{% photo barcelona R0018021 2/3 %}
{% photo barcelona R0018022 2/3 %}
{% endrow %}
{% photo barcelona R0018033 3/2 caption:"The last photo of the day" %}
{% endstack %}
```
