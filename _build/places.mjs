import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import yaml from "js-yaml";
import { frontMatter } from "./content.mjs";
import { escapeXml } from "./liquid.mjs";

export function normalizeTags(value) {
  return [
    ...new Set(
      (Array.isArray(value)
        ? value
        : value == null
          ? []
          : String(value).split(",")
      )
        .map((tag) => String(tag).trim().toLowerCase().replace(/\s+/g, " "))
        .filter(Boolean),
    ),
  ];
}

function validDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(+date) ? null : date;
}

export function placeDate(place, firstCommitDate) {
  return (
    validDate(place.updated_at) ||
    validDate(place.frontmatter_date) ||
    validDate(firstCommitDate) ||
    fs.statSync(place.file).mtime
  );
}

export function buildPlaces(documents, markdown) {
  const locations = {},
    geotagged = {},
    byPid = new Map();
  // One history lookup per build, instead of starting git once per place.
  const dates = new Map();
  try {
    const history = execFileSync(
      "git",
      [
        "log",
        "--diff-filter=A",
        "--format=@%aI",
        "--name-only",
        "--",
        "content/_places",
      ],
      { encoding: "utf8" },
    );
    let date;
    for (const line of history.split("\n")) {
      if (line.startsWith("@")) date = line.slice(1);
      // `git log --diff-filter=A -- path` used the newest addition before the
      // migration, including files that were deleted and later re-added.
      else if (line.startsWith("content/") && !dates.has(line))
        dates.set(line, date);
    }
  } catch {
    /* A source archive may have no git history; use file dates. */
  }
  for (const doc of documents.filter(
    (doc) => doc.file.startsWith("content/_places/") && doc.pid,
  )) {
    const { content, raw, output, url, file, date, ...fields } = doc;
    const place = {
      ...fields,
      description: markdown.render(String(doc.description || "")),
      post_references: [],
    };
    // Places historically parsed a bare date as UTC, while posts use Madrid
    // midnight. Read the authored value before the post-date conversion.
    const authoredDate = validDate(
      frontMatter(raw, (source) =>
        yaml.load(source, { json: true, schema: yaml.JSON_SCHEMA }),
      ).data.date,
    );
    place.last_updated = placeDate(
      { ...doc, frontmatter_date: authoredDate },
      dates.get(file),
    );
    if (authoredDate) {
      place.date = authoredDate;
      place.frontmatter_date = authoredDate;
    }
    const tags = normalizeTags(doc.tags);
    if (tags.length) place.tags = tags;
    else delete place.tags;
    byPid.set(place.pid, place);
  }
  for (const place of byPid.values())
    (locations[place.location || "unknown"] ||= []).push(place);
  const posts = documents
    .filter((doc) => /^(content\/_posts|_drafts)\//.test(doc.file))
    .sort((a, b) => a.date - b.date);
  for (const post of posts) {
    const reference = {
      url: post.url,
      title: post.title,
      date: post.date.toISOString(),
    };
    for (const pid of post.places || []) {
      const place = byPid.get(pid);
      if (!place) continue;
      if (!place.post_references.some((ref) => ref.url === post.url))
        place.post_references.push(reference);
      if (post.date > place.last_updated) place.last_updated = post.date;
    }
    if (post.latlng && post.location) {
      const groups = (geotagged[post.location] ||= {});
      (groups[post.latlng.join(",")] ||= {
        latlng: post.latlng,
        posts: [],
      }).posts.unshift(reference);
    }
  }
  const compare = (a, b) =>
    b.last_updated - a.last_updated || a.pid.localeCompare(b.pid, "en");
  for (const places of Object.values(locations)) places.sort(compare);
  return {
    locations,
    geotagged_posts: Object.fromEntries(
      Object.entries(geotagged).map(([city, groups]) => [
        city,
        Object.values(groups),
      ]),
    ),
  };
}

const csvCell = (value) => {
  const text =
    value instanceof Date ? value.toISOString() : String(value ?? "");
  return /[",\n\r]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
};

export function placesCsv(places) {
  return (
    [
      [
        "name",
        "description",
        "address",
        "tags",
        "latitude",
        "longitude",
        "updated_at",
      ],
      ...places.map((p) => [
        p.title,
        (p.description || "").replace(/<[^>]*>/g, ""),
        p.address,
        (p.tags || []).join(", "),
        p.latlng?.[0],
        p.latlng?.[1],
        p.updated_at || p.date,
      ]),
    ]
      .map((row) => row.map(csvCell).join(","))
      .join("\n") + "\n"
  );
}

export function placesFeed(places, city, settings, cityTitles) {
  const combined = city === "places";
  const title = combined
    ? "Feed de lugares"
    : `Feed de lugares de ${city.charAt(0).toUpperCase() + city.slice(1)}`;
  const description = combined ? "Todos los sitios" : `Sitios en ${city}`;
  const items = places.slice(0, 20).map((place) => {
    const location = place.location || "unknown";
    const url = `${settings.url}/maps/${location}/${place.pid}`;
    let body = place.description || "";
    if (place.address) {
      let address = place.address;
      if (combined && location !== "unknown")
        address += `, ${cityTitles[location] || location.charAt(0).toUpperCase() + location.slice(1)}`;
      body += `<br><strong>Dirección:</strong> <a href='${escapeXml(url)}'>${escapeXml(address)}</a>`;
    }
    if (place.post_references.length)
      body +=
        "<br><br><strong>Aparece en estos posts:</strong><ul>" +
        place.post_references
          .map(
            (ref) =>
              `<li><a href='${escapeXml(settings.url + ref.url)}'>${escapeXml(ref.title)}</a></li>`,
          )
          .join("") +
        "</ul>";
    return `<item><title>${escapeXml(place.title || "Sin título")}</title><link>${escapeXml(url)}</link><description>${escapeXml(body)}</description><pubDate>${place.last_updated.toUTCString()}</pubDate><dc:date>${place.last_updated.toISOString()}</dc:date><dc:subject>${escapeXml(location)}</dc:subject></item>`;
  });
  return `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet href="/feed-places.xsl" type="text/xsl"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/"><channel><title>${escapeXml(title)}</title><link>${settings.url}/feeds/${city}.xml</link><description>${escapeXml(description)}</description><language>es</language><lastBuildDate>${(places[0]?.last_updated || new Date("2023-01-01")).toUTCString()}</lastBuildDate>${items.join("\n")}</channel></rss>`;
}

export function writePlaceFiles(outputDirectory, data, settings, documents) {
  const write = (file, content) => {
    const target = path.join(outputDirectory, file);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, content);
  };
  const titles = Object.fromEntries(
    documents
      .filter((doc) => doc.file.startsWith("content/_locations/"))
      .map((doc) => [doc.location, doc.title]),
  );
  for (const [city, places] of Object.entries(data.locations)) {
    write(`assets/maps/${city}.csv`, placesCsv(places));
    write(`feeds/${city}.xml`, placesFeed(places, city, settings, titles));
  }
  const combined = Object.values(data.locations)
    .flat()
    .sort(
      (a, b) =>
        b.last_updated - a.last_updated || a.pid.localeCompare(b.pid, "en"),
    );
  write("feeds/places.xml", placesFeed(combined, "places", settings, titles));
}
