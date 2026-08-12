Hi, stranger! Welcome to my little computer on the net!

This website contains a wiki, several blog posts, a collection of silly songs,
a pun, a hidden passage to another dimension, a list of dog names, a list of
names that are not dog names, references to my early memories, several photos
of myself eating ice cream, a coin, a yellow bird, a photo of your turtle, a
turtle.

I get sad when I spend my time consuming instead of making things. This website
is my attempt to spend more time thinking, documenting, and making.

---

## The `computer` command

One menu for everything this site needs: creating content, refreshing the data
files, and running Jekyll.

```sh
./computer              # open the menu
./computer post         # jump straight to one action
./computer --help       # list the action ids
```

The menu is three pages — **Write**, **Update** and **Tools**. `←→` (or `⇥`, or
`h`/`l`) moves between them, `↑↓` (or `j`/`k`) moves down a page, `⏎` runs,
`esc` quits. `/` filters, and while filtering the search leaves its page: every
match from every page shows up, under the name of the page it came from.

The dev server is not on any page in particular — `s` opens it from anywhere in
the menu, and the top right corner says whether it is up and on which port.

In a form: `⏎` for the next field, `⇧⇥` to go back, `esc` to cancel. Fields come
pre-filled with a sensible guess (the location of the last post, the camera
detected from the photo filenames, the date read off the first photo) — press
`⏎` to accept it or type over it.

| Action | What it does |
| --- | --- |
| `post`, `draft` | A post in `content/_posts`, or a draft in `_drafts` |
| `photo` | A `photos/photo` entry with a `filenames:` block |
| `reportage` | Front matter plus a body of `{% stack %}` / `{% row %}` blocks |
| `quote`, `video` | The smaller post layouts |
| `place` | A pin in `content/_places`, on the map of its city |
| `edit` | Open an existing post or draft in `$EDITOR` |
| `publish` | Review the changes, commit them and push |
| `reading` | The reading-list TUI (`_scripts/reading.js`) |
| `update` | Tick the data sources to refresh and run them in one go |
| `movies`, `books`, `places`, `subscribers`, `syndication` | One data source at a time, without the picker |
| `standard`, `standard-dry` | Publish to standard.site over the AT Protocol |
| `filenames` | Rebuild a post's `filenames:` block from its `{% photo %}` tags |
| `serve`, `serve-drafts`, `stop`, `build` | Jekyll |
| `format`, `lint` | Prettier and ESLint |

Dates accept `now`, `yesterday`, `3 days ago`, `last friday`, `in 2 weeks`,
`21:30`, `2026-08-01` or `2026-08-01 21:30`, and the resolved date is shown as
you type. A bare day means midnight.

When adding photos, paste or type one filename per line — paths and extensions
are stripped, so dragging files in works. Put a ratio after a filename to
override the `3/2` default:

```
2026-07-16-Berlin-R0021086 2/3
```

Reportage bodies are laid out from those ratios: consecutive portraits pair up
into a `{% row %}`, everything else becomes a `{% stack %}`.

`./computer place` writes a place with the `pid` posts link to (defaulted from
the title, and refused if it is already taken) and asks for its coordinates,
which can be typed as `41.3924, 2.1648` or pasted as a Google or Apple Maps
link — the pin in the URL wins over the map centre. The location suggestions
are the cities that have a map in `content/_maps`, since a place with no map
has nowhere to show up. `Tags` takes a comma-separated list and suggests the
vocabulary already in use, so a second "café" doesn't arrive as "cafés"; the
tags show up on the map cards and filter the sidebar when clicked.

`./computer update` asks what to refresh instead of assuming: movies,
subscribers and syndication come ticked (what "update everything" always meant),
books and places are one `space` away, `a` ticks the lot, and `⏎` runs them one
after another into the same transcript. With nothing ticked, `⏎` runs whatever
the cursor is on.

`./computer publish` closes the loop: it lists every change with its git status,
shows the branch and where it will push, then asks for a commit message
(pre-filled with the title of the post you just added, when the change is a
single new post). Nothing is staged until you confirm, and pushing `main` is
what triggers the GitHub Actions deploy.

Every new file is offered to your editor the moment it is written, and
`./computer edit` reopens anything you wrote earlier — drafts first (greyed out
and marked `draft`), then the newest posts, listed as date and title and
filterable with `/`. The editor is `$VISUAL`, then `$EDITOR`, then the first of
`nvim`, `vim`, `code -w`, `nano` or `open -t` found on your `PATH`.

`./computer serve` — or `s`, from anywhere in the menu — starts Jekyll in the
background and gives the menu back, so you can keep writing while it builds. A
spinner waits for the site to answer on `localhost:4001` — press any key to stop
watching and get on with it. The server outlives the CLI: `s` then opens a small
screen with the uptime, the log (`.computer/serve.log`), restart and stop, and
`./computer stop` stops it from anywhere. Set `PORT` to run a second copy of the
site somewhere else:

```sh
PORT=4002 ./computer serve
```

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

### `{% single %}` / `{% endsingle %}`

Wraps a vertical photo with arbitrary HTML content beside it. The photo is capped at `95vh`. Accepts `left` or `right` for alignment (centered by default).

```liquid
{% single left %}
{% photo barcelona R0018048 2/3 %}
<div>Text displayed to the right of the photo.</div>
{% endsingle %}

{% single right %}
<div>Text displayed to the left of the photo.</div>
{% photo barcelona R0018048 2/3 %}
{% endsingle %}
```

On mobile, content stacks vertically: text above the photo for `left`, text below for `right`.

### Gap classes

All layout tags (`stack`, `row`, `grid`, `single`) accept `gap-N` classes to override the default spacing, where N maps to the `--s-N` CSS variables (1–16).

```liquid
{% stack gap-8 %}
{% row gap-4 %}
{% single left gap-6 %}
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
