(function() {
  // Accent folding, so "cafe" finds "café". The map is deliberately
  // one-character-to-one-character: excerpt highlighting locates matches in the
  // folded text and slices the original by the same offsets, which only works
  // while folding preserves length. "ñ" is left alone — in Spanish it is its own
  // letter, and folding it would make "año" match "ano".
  var ACCENTS = {
    "á": "a", "à": "a", "ä": "a", "â": "a", "ã": "a", "å": "a",
    "é": "e", "è": "e", "ë": "e", "ê": "e",
    "í": "i", "ì": "i", "ï": "i", "î": "i",
    "ó": "o", "ò": "o", "ö": "o", "ô": "o", "õ": "o",
    "ú": "u", "ù": "u", "ü": "u", "û": "u",
    "ç": "c", "ý": "y", "ÿ": "y"
  };

  // Non-breaking spaces are folded to ordinary ones as well. A reader types a
  // normal space, so a phrase like "worried about" has to match prose that was
  // written with "worried&nbsp;about".
  function fold(text) {
    return String(text == null ? "" : text)
      .toLowerCase()
      .replace(/[   ]/g, " ")
      .replace(/[áàäâãåéèëêíìïîóòöôõúùüûçýÿ]/g, function(ch) {
        return ACCENTS[ch] || ch;
      });
  }

  // lunr pipeline wrapper. It must go through token.update() rather than
  // returning a plain string, or the token loses the metadata that carries the
  // position data used to build excerpts.
  function foldToken(token) {
    return token.update(function(text) {
      return fold(text);
    });
  }

  var ENTITIES = {
    amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " "
  };

  // Store values are lifted out of rendered HTML, so they still carry kramdown's
  // entity encoding. search.js escapes on output, so leaving them encoded would
  // print a literal "&amp;" and — worse — turn "?a=1&amp;b=2" into a link whose
  // query parameters are prefixed with "amp;". Decode once on the way in.
  function decodeEntities(text) {
    return String(text == null ? "" : text).replace(
      /&(#x[0-9a-f]+|#\d+|[a-z]+);/gi,
      function(match, entity) {
        if (entity.charAt(0) === "#") {
          var hex = entity.charAt(1).toLowerCase() === "x";
          var code = parseInt(hex ? entity.slice(2) : entity.slice(1), hex ? 16 : 10);
          if (isNaN(code) || code < 0 || code > 0x10ffff) return match;
          return String.fromCodePoint ? String.fromCodePoint(code) : String.fromCharCode(code);
        }
        var name = entity.toLowerCase();
        return Object.prototype.hasOwnProperty.call(ENTITIES, name) ? ENTITIES[name] : match;
      }
    );
  }

  function decodeStore(store) {
    for (var key in store) {
      var item = store[key];
      item.title = decodeEntities(item.title);
      item.author = decodeEntities(item.author);
      item.category = decodeEntities(item.category);
      item.content = decodeEntities(item.content);
      item.city = decodeEntities(item.city);
      item.address = decodeEntities(item.address);
      (item.links || []).forEach(function(link) {
        if (!link) return;
        link.url = decodeEntities(link.url);
        link.text = decodeEntities(link.text);
      });
    }
    return store;
  }

  function escapeHtml(text) {
    return String(text == null ? "" : text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  // Same separator lunr uses when indexing (whitespace and hyphens), so
  // hyphenated queries like "home-cooked" line up with the indexed tokens.
  // Edge punctuation is stripped for the same reason: lunr.trimmer does it to
  // every indexed token, so a query token of "cosas." could never match the
  // stored "cosas". Internal punctuation stays, so "ankitron.com" still works.
  function tokenize(text) {
    return fold(text)
      .split(/[\s\-]+/)
      .map(function(token) {
        return token.replace(/^\W+/, "").replace(/\W+$/, "");
      })
      .filter(Boolean);
  }

  // A query is a mix of quoted phrases (matched literally) and loose terms.
  // Curly quotes are normalized first because typing them is the default on macOS.
  function parseQuery(raw) {
    var phrases = [];
    var rest = String(raw)
      .replace(/[“”]/g, '"')
      .replace(/"([^"]*)"/g, function(match, inner) {
        var phrase = inner.trim();
        if (phrase) phrases.push(phrase);
        return " ";
      });
    // Any quote left over is unbalanced; treat it as a separator.
    var terms = rest.replace(/"/g, " ").split(/[\s\-]+/).filter(Boolean);
    return { phrases: phrases, terms: terms };
  }

  function formatDate(dateString) {
    var months = [
      "enero", "febrero", "marzo", "abril", "mayo", "junio",
      "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
    ];
    var date = new Date(dateString);
    var currentYear = new Date().getFullYear();
    var day = date.getDate();
    var month = months[date.getMonth()];
    var year = date.getFullYear();
    var result = day + " de " + month;
    if (year !== currentYear) {
      result += " de " + year;
    }
    return result;
  }

  function isPlace(item) {
    return item.type === "place";
  }

  // A place has no date — it is located rather than published — so its footer
  // carries the address instead, read the way an address is read: street
  // first, then the city. The street links to the place, the city to the map
  // it sits on.
  function buildPlaceFooter(item) {
    var html = "";
    var parts = [];
    if (item.address) {
      parts.push('<a href="' + escapeHtml(item.url) + '">' + escapeHtml(item.address) + "</a>");
    }
    if (item.city) {
      var url = item.cityUrl || item.url;
      parts.push('<a href="' + escapeHtml(url) + '">' + escapeHtml(item.city) + "</a>");
    }
    // Joined with nothing: the comma between street and city is drawn in CSS,
    // as part of the city, so a place with only one of the two never shows a
    // separator with nothing on the other side of it.
    if (parts.length) {
      html += '<span class="search-results__location">' + parts.join("") + "</span>";
    }
    return html;
  }

  function buildFooter(item) {
    if (isPlace(item)) {
      return '<div class="post__footer">' + buildPlaceFooter(item) + "</div>";
    }

    var html = '<div class="post__footer">';
    html += '<a href="' + escapeHtml(item.url) + '" class="post__date">' + formatDate(item.date) + '</a>';
    if (item.tags && item.tags.length) {
      html += '<div class="post__tags">';
      for (var i = 0; i < item.tags.length; i++) {
        var tag = item.tags[i];
        var slug = tag.toLowerCase().replace(/\s+/g, "-");
        html += '<a href="/tags/' + encodeURIComponent(slug) + '" class="post__tag-link">' + escapeHtml(tag) + '</a>';
        if (i < item.tags.length - 1) html += " ";
      }
      html += '</div>';
    }
    html += '</div>';
    return html;
  }

  var WORD_CHAR = /[\p{L}\p{N}]/u;

  // Occurrences of `needle` in already-folded `haystack`. Loose terms only count
  // when they start a word: the index matches them as substrings, but
  // highlighting "de" inside "descendente" is noise rather than a useful hit.
  // Anchor texts additionally require a word end, so linking "app" does not also
  // swallow the start of "aparato".
  function findMatches(haystack, needle, wordStartOnly, wordEndOnly) {
    var ranges = [];
    if (!needle) return ranges;
    var index = haystack.indexOf(needle);
    while (index !== -1) {
      var end = index + needle.length;
      var previous = index > 0 ? haystack.charAt(index - 1) : "";
      var next = end < haystack.length ? haystack.charAt(end) : "";
      var startOk = !wordStartOnly || !previous || !WORD_CHAR.test(previous);
      var endOk = !wordEndOnly || !next || !WORD_CHAR.test(next);
      if (startOk && endOk) ranges.push([index, end]);
      index = haystack.indexOf(needle, end);
    }
    return ranges;
  }

  function mergeRanges(ranges) {
    ranges.sort(function(a, b) {
      return a[0] - b[0];
    });
    var merged = [];
    for (var i = 0; i < ranges.length; i++) {
      var last = merged[merged.length - 1];
      if (last && ranges[i][0] <= last[1]) {
        last[1] = Math.max(last[1], ranges[i][1]);
      } else {
        merged.push([ranges[i][0], ranges[i][1]]);
      }
    }
    return merged;
  }

  function highlightRanges(text, parsed) {
    var haystack = fold(text);
    var ranges = [];
    parsed.phrases.forEach(function(phrase) {
      ranges = ranges.concat(findMatches(haystack, fold(phrase), false));
    });
    parsed.terms.forEach(function(term) {
      ranges = ranges.concat(findMatches(haystack, fold(term), true));
    });
    return mergeRanges(ranges);
  }

  // Whether the search hit this URL. Uses the same word-start rule as text
  // highlighting, so "app" matches "bsky.app/…" but not "…/happening".
  function urlMatches(url, parsed) {
    var haystack = fold(url);
    var hit = false;
    parsed.phrases.forEach(function(phrase) {
      if (findMatches(haystack, fold(phrase), false).length) hit = true;
    });
    parsed.terms.forEach(function(term) {
      if (findMatches(haystack, fold(term), true).length) hit = true;
    });
    return hit;
  }

  // Where each link's anchor text sits inside the excerpt. strip_html left the
  // anchor text in the content, so finding it again is what lets the excerpt
  // show a real link instead of a bare URL. Overlaps are dropped, first wins.
  function linkRanges(text, links) {
    var haystack = fold(text);
    var found = [];
    (links || []).forEach(function(link) {
      if (!link || !link.url || !isSafeUrl(link.url)) return;
      findMatches(haystack, fold(link.text), true, true).forEach(function(range) {
        found.push({
          start: range[0],
          end: range[1],
          url: link.url,
          // True for the fallback excerpt that shows a bare URL as its own
          // anchor text; there the term itself is visible, so highlighting the
          // whole thing would just be a solid block.
          isBareUrl: fold(link.text) === fold(link.url)
        });
      });
    });
    found.sort(function(a, b) {
      return a.start - b.start;
    });
    var kept = [];
    found.forEach(function(range) {
      if (!kept.length || range.start >= kept[kept.length - 1].end) kept.push(range);
    });
    return kept;
  }

  // Excerpt links become real hrefs, so only allow schemes that are safe to
  // click. Anything else (javascript:, data:) renders as plain text.
  function isSafeUrl(url) {
    return /^(https?:|mailto:|[/#?])/i.test(String(url).replace(/^\s+/, ""));
  }

  function rangeAt(ranges, position) {
    for (var i = 0; i < ranges.length; i++) {
      if (position >= ranges[i].start && position < ranges[i].end) return ranges[i];
    }
    return null;
  }

  function isHighlighted(ranges, position) {
    for (var i = 0; i < ranges.length; i++) {
      if (position >= ranges[i][0] && position < ranges[i][1]) return true;
    }
    return false;
  }

  // Escapes the excerpt and lays two independent sets of ranges over it: links
  // and search highlights. Splitting on every boundary keeps the two nesting
  // correctly even when a highlight covers only part of a link's anchor text.
  function renderExcerpt(text, parsed, links) {
    var anchors = linkRanges(text, links);
    var highlights = highlightRanges(text, parsed);

    // A post can match on a URL that never appears in the prose. Highlighting
    // the anchor text is what shows the reader which link was the hit.
    anchors.forEach(function(anchor) {
      if (!anchor.isBareUrl && urlMatches(anchor.url, parsed)) {
        highlights.push([anchor.start, anchor.end]);
      }
    });
    highlights = mergeRanges(highlights);

    var boundaries = [0, text.length];
    anchors.forEach(function(range) {
      boundaries.push(range.start, range.end);
    });
    highlights.forEach(function(range) {
      boundaries.push(range[0], range[1]);
    });
    boundaries.sort(function(a, b) {
      return a - b;
    });

    var html = "";
    var openUrl = null;
    for (var i = 0; i < boundaries.length - 1; i++) {
      var from = boundaries[i];
      var to = boundaries[i + 1];
      if (to <= from) continue;

      var anchor = rangeAt(anchors, from);
      var url = anchor ? anchor.url : null;
      if (url !== openUrl) {
        if (openUrl) html += "</a>";
        // is-underlined is the site's convention for a link inside prose;
        // without it an excerpt link is indistinguishable from plain text.
        if (url) html += '<a class="is-underlined" href="' + escapeHtml(url) + '">';
        openUrl = url;
      }

      var segment = escapeHtml(text.slice(from, to));
      html += isHighlighted(highlights, from)
        ? '<span class="is-highlighted">' + segment + "</span>"
        : segment;
    }
    if (openUrl) html += "</a>";
    return html;
  }

  function getQuery(variable) {
    var query = window.location.search.substring(1);
    if (!query) return "";
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=");
      if (pair[0] !== variable) continue;
      var value = (pair[1] || "").replace(/\+/g, "%20");
      try {
        return decodeURIComponent(value);
      } catch (error) {
        // Malformed percent-encoding, e.g. /search?q=%
        return value;
      }
    }
    return "";
  }

  function clip(text, start, radius) {
    var from = Math.max(0, start - radius);
    var to = Math.min(text.length, start + radius);
    return (from > 0 ? "…" : "") + text.substring(from, to) + (to < text.length ? "…" : "");
  }

  // Position of the first match lunr recorded in the content field. Positions
  // are per-field, so offsets from title/links would point at the wrong place.
  function contentPosition(matchData) {
    if (!matchData || !matchData.metadata) return -1;
    for (var term in matchData.metadata) {
      var entry = matchData.metadata[term];
      if (entry && entry.content && entry.content.position && entry.content.position.length) {
        return entry.content.position[0][0];
      }
    }
    return -1;
  }

  // Flattens the link list into the text lunr indexes. Each URL goes in twice:
  // verbatim (so "ankitron.com" matches) and split on its punctuation (so a bare
  // "ankitron" is a token of its own).
  function linkIndexText(item) {
    var parts = [];
    (item.links || []).forEach(function(link) {
      if (!link || !link.url) return;
      parts.push(link.url);
      parts.push(link.url.replace(/[:/._?=&#+-]+/g, " "));
    });
    return parts.join(" ");
  }

  // The link whose URL contains what was searched for — the reason a post with
  // no textual match came back at all.
  function matchingLink(item, parsed) {
    var links = item.links || [];
    for (var i = 0; i < links.length; i++) {
      if (!links[i] || !links[i].url) continue;
      if (urlMatches(links[i].url, parsed)) return links[i];
    }
    return null;
  }

  function excerpt(text, links) {
    return { text: text, links: links };
  }

  function buildExcerpt(item, matchData, parsed, radius) {
    radius = radius || 120;
    var text = item.content || "";
    var haystack = fold(text);

    // Prefer a literal hit on what the reader actually typed, so the excerpt
    // shows the phrase or term in context.
    var found = [];
    parsed.phrases.forEach(function(phrase) {
      found = found.concat(findMatches(haystack, fold(phrase), false).slice(0, 1));
    });
    parsed.terms.forEach(function(term) {
      found = found.concat(findMatches(haystack, fold(term), true).slice(0, 1));
    });
    if (found.length) {
      return excerpt(clip(text, Math.min.apply(null, found.map(function(range) {
        return range[0];
      })), radius), item.links);
    }

    var position = contentPosition(matchData);
    if (position !== -1) return excerpt(clip(text, position, radius), item.links);

    // Nothing matched in the text, so the post came back because of a URL. Show
    // the sentence around that link rather than an unrelated opening paragraph.
    var link = matchingLink(item, parsed);
    if (link) {
      var anchor = findMatches(haystack, fold(link.text), true, true);
      if (anchor.length) return excerpt(clip(text, anchor[0][0], radius), item.links);
      // The link had no anchor text to find (an image link, say): show the URL.
      return excerpt(link.url, [{ url: link.url, text: link.url }]);
    }

    return excerpt(
      text.substring(0, radius * 2) + (text.length > radius * 2 ? "…" : ""),
      item.links
    );
  }

  function showResults(results, store, parsed) {
    var searchResults = document.getElementById("search-results");
    if (!searchResults) return;

    if (!results.length) {
      searchResults.innerHTML = "<li>No hay resultados para esa búsqueda</li>";
      return;
    }

    var html = "";
    for (var i = 0; i < results.length; i++) {
      var item = store[results[i].ref];
      if (!item) continue;
      var snippet = buildExcerpt(item, results[i].matchData, parsed);
      // A place that has closed says so before anything else: it is the first
      // thing worth knowing about it, and it reads as part of the description.
      var closed = isPlace(item) && item.closed ? "Cerrado permanentemente." : "";
      html += '<li><a href="' + escapeHtml(item.url) + '">' + escapeHtml(item.title) + "</a>";
      // A place with no description of its own has nothing to excerpt, and an
      // empty paragraph would leave a gap between the title and the footer.
      if (closed || snippet.text) {
        html += "<p>";
        if (closed) html += escapeHtml(closed) + (snippet.text ? " " : "");
        html += renderExcerpt(snippet.text, parsed, snippet.links);
        html += "</p>";
      }
      html += buildFooter(item);
      html += "</li>";
    }
    searchResults.innerHTML = html;
  }

  // Every phrase must appear verbatim (ignoring case/accents) somewhere in the
  // post. lunr has no phrase queries, so this runs as a filter over its results.
  function matchesPhrases(item, phrases) {
    if (!phrases.length) return true;
    var haystack = fold(
      [item.title, item.content, item.address, linkIndexText(item)].join(" ")
    );
    return phrases.every(function(phrase) {
      return haystack.indexOf(fold(phrase)) !== -1;
    });
  }

  function queryTokens(parsed) {
    var tokens = [];
    parsed.phrases.forEach(function(phrase) {
      tokens = tokens.concat(tokenize(phrase));
    });
    parsed.terms.forEach(function(term) {
      tokens = tokens.concat(tokenize(term));
    });
    return tokens;
  }

  function runQuery(idx, tokens, strict) {
    return idx.query(function(q) {
      tokens.forEach(function(token) {
        // The substring clause carries the presence requirement; it matches a
        // superset of the prefix clause, which is added only to boost the score
        // of posts where the term starts a word.
        q.term(token, {
          wildcard: lunr.Query.wildcard.LEADING | lunr.Query.wildcard.TRAILING,
          presence: strict ? lunr.Query.presence.REQUIRED : lunr.Query.presence.OPTIONAL
        });
        q.term(token, {
          wildcard: lunr.Query.wildcard.TRAILING,
          presence: lunr.Query.presence.OPTIONAL
        });
      });
    });
  }

  var searchTerm = getQuery("q");

  if (searchTerm && searchTerm.trim()) {
    function trackSearch(eventName, query) {
      if (window.plausible) {
        window.plausible(eventName, { props: { query: query } });
      } else {
        // Wait for Plausible to load
        setTimeout(function() {
          if (window.plausible) {
            window.plausible(eventName, { props: { query: query } });
          }
        }, 500);
      }
    }

    document.title = searchTerm + " — Búsqueda";

    function initSearch() {
      var searchBox = document.getElementById("search-box");
      if (searchBox) {
        searchBox.value = searchTerm;
        // search-form.js owns the clear button and only watches for typing, so
        // a query that arrives from the URL has to announce itself.
        searchBox.dispatchEvent(new Event("input", { bubbles: true }));
      }

      var store = decodeStore(window.store || {});
      var parsed = parseQuery(searchTerm);
      var tokens = queryTokens(parsed);
      if (!tokens.length) {
        showResults([], store, parsed);
        trackSearch("Search: No Results", searchTerm);
        return;
      }

      // Named so lunr does not warn about an unregistered pipeline function.
      lunr.Pipeline.registerFunction(foldToken, "accentFolder");

      // Initialize lunr.js with the fields to search.
      // The title field is given more weight with the "boost" parameter
      var idx = lunr(function() {
        this.ref("id"); // 👈 IMPORTANT
        this.metadataWhitelist = ["position"];

        // Disable pipeline functions that might interfere with Spanish words.
        // lunr.trimmer strips leading/trailing characters outside [A-Za-z0-9_],
        // which counts accented letters as punctuation: "órbita" was indexed as
        // "rbita" and "café" as "caf". Folding has to run *before* it so those
        // words are plain ASCII by the time the trimmer sees them. The English
        // stop-word list is dropped too — it swallows common Spanish words like
        // "no", "a" and "me".
        this.pipeline.remove(lunr.stemmer);
        this.searchPipeline.remove(lunr.stemmer);
        this.pipeline.remove(lunr.stopWordFilter);
        this.searchPipeline.remove(lunr.stopWordFilter);
        this.pipeline.before(lunr.trimmer, foldToken);

        this.field("title", { boost: 10 });
        this.field("author");
        this.field("category");
        // Only places have one, and it is shown in the footer rather than in
        // the excerpt — but a street is a fair thing to search a city by.
        this.field("address");
        this.field("links", { boost: 5 });
        this.field("content");
        for (var key in store) {
          // Add the JSON we generated from the site content to Lunr.js.
          this.add({
            id: key,
            title: store[key].title,
            author: store[key].author,
            category: store[key].category,
            address: store[key].address,
            links: linkIndexText(store[key]),
            content: store[key].content
          });
        }
      });

      var results = runQuery(idx, tokens, true).filter(function(result) {
        return matchesPhrases(store[result.ref], parsed.phrases);
      });

      // Requiring every term is the right default, but it can be too strict on
      // a longer query. Rather than show nothing, fall back to matching any
      // term — quoted phrases are never relaxed, since those were explicit.
      if (!results.length && !parsed.phrases.length && tokens.length > 1) {
        results = runQuery(idx, tokens, false);
      }

      if (results.length === 0) {
        trackSearch("Search: No Results", searchTerm);
      } else {
        trackSearch("Search", searchTerm);
      }

      showResults(results, store, parsed);
    }

    // Run when DOM is ready
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initSearch);
    } else {
      initSearch();
    }
  }
})();
