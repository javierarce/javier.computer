(function () {
  function showResults(results, store) {
    var searchResults = document.getElementById("search-results");
    if (results.length) {
      // If there are results...
      var appendString = "";
      for (var i = 0; i < results.length; i++) {
        var result = results[i];
        var item = store[result.ref];
        var excerpt = buildExcerpt(item.content, result.matchData);
        excerpt = highlight(excerpt, searchTerm);
        // Title is no longer highlighted
        appendString +=
          '<li><a href="' + item.url + '"><h3>' + item.title + "</h3></a>";
        appendString += "<p>" + excerpt + "</p></li>";
      }
      searchResults.innerHTML = appendString;
    } else {
      searchResults.innerHTML = "<li>No hay resultados para esa búsqueda</li>";
    }
  }
  function highlight(text, query) {
    if (!query) return text;
    // Escape regex special characters in the query
    var escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    var regex = new RegExp("(" + escapedQuery + ")", "gi");
    return text.replace(regex, '<span class="is-highlighted">$1</span>');
  }
  function getQuery(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=");
      if (pair[0] === variable) {
        return decodeURIComponent(pair[1].replace(/\+/g, "%20"));
      }
    }
  }
  function buildExcerpt(text, matchData, radius) {
    radius = radius || 120;
    if (!matchData || !matchData.metadata) {
      return text.substring(0, radius * 2) + "...";
    }
    var query = searchTerm.toLowerCase();
    // 1️⃣ Prefer the searched term
    if (matchData.metadata[query]) {
      for (var field in matchData.metadata[query]) {
        var positions = matchData.metadata[query][field].position;
        if (positions && positions.length) {
          var start = Math.max(0, positions[0][0] - radius);
          var end = Math.min(text.length, positions[0][0] + radius);
          return (
            (start > 0 ? "…" : "") +
            text.substring(start, end) +
            (end < text.length ? "…" : "")
          );
        }
      }
    }
    // 2️⃣ Fallback: first available match
    for (var term in matchData.metadata) {
      for (var field in matchData.metadata[term]) {
        var positions = matchData.metadata[term][field].position;
        if (positions && positions.length) {
          var start = Math.max(0, positions[0][0] - radius);
          var end = Math.min(text.length, positions[0][0] + radius);
          return (
            (start > 0 ? "…" : "") +
            text.substring(start, end) +
            (end < text.length ? "…" : "")
          );
        }
      }
    }
    return text.substring(0, radius * 2) + "...";
  }

  var searchTerm = getQuery("q");

  if (searchTerm) {
    // Function to track search with Plausible
    function trackSearch(eventName, query) {
      if (window.plausible) {
        window.plausible(eventName, { props: { query: query } });
      } else {
        // Wait for Plausible to load
        setTimeout(function () {
          if (window.plausible) {
            window.plausible(eventName, { props: { query: query } });
          }
        }, 500);
      }
    }

    // Main search initialization function
    function initSearch() {
      var searchBox = document.getElementById("search-box");
      if (!searchBox) {
        console.error("Search box element not found");
        return;
      }

      searchBox.setAttribute("value", searchTerm);

      console.log("Searching for:", searchTerm);

      // Initialize lunr.js with the fields to search.
      // The title field is given more weight with the "boost" parameter
      var idx = lunr(function () {
        this.ref("id"); // 👈 IMPORTANT
        this.metadataWhitelist = ["position"];

        // Disable pipeline functions that might interfere with Spanish words
        this.pipeline.remove(lunr.stemmer);
        this.searchPipeline.remove(lunr.stemmer);

        this.field("title", { boost: 10 });
        this.field("author");
        this.field("category");
        this.field("content");
        for (var key in window.store) {
          // Add the JSON we generated from the site content to Lunr.js.
          this.add({
            id: key,
            title: window.store[key].title,
            author: window.store[key].author,
            category: window.store[key].category,
            content: window.store[key].content,
          });
        }
      });

      var results = idx.query(function (q) {
        var terms = searchTerm.toLowerCase().split(/\s+/);
        terms.forEach(function (term) {
          q.term(term, {
            wildcard: lunr.Query.wildcard.TRAILING,
            presence: lunr.Query.presence.OPTIONAL,
          });
          q.term(term, {
            wildcard:
              lunr.Query.wildcard.LEADING | lunr.Query.wildcard.TRAILING,
            presence: lunr.Query.presence.OPTIONAL,
          });
        });
      });

      // Track search results
      if (results.length === 0) {
        trackSearch("Search: No Results", searchTerm);
      } else {
        trackSearch("Search", searchTerm);
      }

      showResults(results, window.store);
    }

    // Run when DOM is ready
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initSearch);
    } else {
      initSearch();
    }
  }
})();
