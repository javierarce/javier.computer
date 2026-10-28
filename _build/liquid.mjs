import { Liquid } from "liquidjs";

export const escapeXml = (value) =>
  String(value ?? "").replace(
    /[&<>"']/g,
    (char) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&apos;",
      })[char],
  );
export const slugify = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-|-$/g, "");

export function sortItems(items, property, nils = "first") {
  const value = (item) => {
    let result = property
      ? property.split(".").reduce((object, key) => object?.[key], item)
      : item;
    if (result instanceof Date) result = result.toISOString();
    return result;
  };
  const values = Array.isArray(items)
    ? items
    : items && typeof items === "object"
      ? Object.entries(items)
      : [];
  return [...values].sort((a, b) => {
    const left = value(a),
      right = value(b);
    if (left == null && right == null) return 0;
    if (left == null) return nils === "first" ? -1 : 1;
    if (right == null) return nils === "first" ? 1 : -1;
    return left < right ? -1 : left > right ? 1 : 0;
  });
}

export function photo(markup) {
  const named = {};
  const positional = markup
    .replace(
      /(\w+):(?:"([^"]*)"|'([^']*)'|(\S+))/g,
      (_, key, double, single, bare) => {
        named[key] = double ?? single ?? bare;
        return "";
      },
    )
    .trim()
    .split(/\s+/);
  const location = named.location || positional[0];
  const filename = named.filename || positional[1];
  const ratio =
    named.ratio || (/^\d+\/\d+$/.test(positional[2]) ? positional[2] : "");
  const caption = named.caption;
  const alt = named.alt || caption || "";
  const base = `https://img.javier.computer/${location}/${filename}`;
  return `<div class="${escapeXml(["photo", named.class].filter(Boolean).join(" "))}">
  <div class="photo__content"><figure class="figure"><picture>
  <source data-srcset="${escapeXml(base)}_2880.webp 2880w" type="image/webp">
  <source data-srcset="${escapeXml(base)}_2880.jpg 2880w">
  <img class="lazy" data-src="${escapeXml(base)}_2880.jpg"${ratio ? ` style="--aspect-ratio: ${escapeXml(ratio)};"` : ""}${alt ? ` alt="${escapeXml(alt)}"` : ""}${caption ? ` data-caption="${escapeXml(caption)}"` : ""}>
  </picture></figure>${caption ? `<figcaption>${escapeXml(caption)}</figcaption>` : ""}</div></div>\n\n`;
}

export function createLiquid(markdown, settings) {
  const liquid = new Liquid({
    root: ["_includes", "."],
    extname: ".html",
    jekyllInclude: true,
    strictFilters: true,
    ownPropertyOnly: false,
    cache: true,
    timezoneOffset: "Europe/Madrid",
  });
  liquid.registerTag("photo", {
    parse(token) {
      this.markup = token.args;
    },
    render() {
      return photo(this.markup);
    },
  });
  liquid.registerTag("player", {
    parse(token) {
      [this.id, this.title] = token.args.trim().split("|");
    },
    render() {
      return `<div data-video='${escapeXml(this.id)}'${this.title ? ` data-title='${escapeXml(this.title)}'` : ""}></div>`;
    },
  });
  for (const name of ["stack", "row", "text", "grid", "single"]) {
    liquid.registerTag(name, {
      parse(token, tokens) {
        this.classes = [name, token.args.trim()].filter(Boolean).join(" ");
        this.templates = [];
        const stream = liquid.parser
          .parseStream(tokens)
          .on(`tag:end${name}`, () => stream.stop())
          .on("template", (template) => this.templates.push(template))
          .on("end", () => {
            throw new Error(`Missing {% end${name} %}`);
          });
        stream.start();
      },
      *render(context, emitter) {
        emitter.write(`<div class="${escapeXml(this.classes)}">`);
        yield liquid.renderer.renderTemplates(this.templates, context, emitter);
        emitter.write("</div>");
      },
    });
  }
  liquid.registerTag("feed_meta", {
    render() {
      return `<link type="application/rss+xml" rel="alternate" href="${settings().url}/feed.xml" title="${escapeXml(settings().title)}">`;
    },
  });
  liquid.registerFilter(
    "relative_url",
    (value) => "/" + String(value || "").replace(/^\/+/, ""),
  );
  liquid.registerFilter(
    "absolute_url",
    (value) => new URL(String(value || ""), settings().url).href,
  );
  liquid.registerFilter("xml_escape", escapeXml);
  liquid.registerFilter("jsonify", (value) => JSON.stringify(value ?? null));
  liquid.registerFilter("normalize_whitespace", (value) =>
    String(value || "").replace(/\s+/g, " "),
  );
  liquid.registerFilter("markdownify", (value) =>
    markdown.render(String(value || "")),
  );
  liquid.registerFilter("slugify", slugify);
  liquid.registerFilter("sort", sortItems);
  liquid.registerFilter("date_to_rfc822", (value) =>
    new Date(value).toUTCString().replace("GMT", "+0000"),
  );
  liquid.registerFilter("date_to_xmlschema", (value) =>
    new Date(value).toISOString(),
  );
  liquid.registerFilter("random_number", (value) =>
    Math.floor(Math.random() * Number(value)),
  );
  liquid.registerFilter("random_number_excluding", (value, exclude) => {
    const max = Number(value),
      excluded = Number(exclude);
    if (
      exclude == null ||
      exclude === "" ||
      max <= 1 ||
      excluded < 0 ||
      excluded >= max
    )
      return Math.floor(Math.random() * max);
    const n = Math.floor(Math.random() * (max - 1));
    return n >= excluded ? n + 1 : n;
  });
  liquid.registerFilter("map_range", (value, fromMin, fromMax, toMin, toMax) =>
    Math.round(
      ((Number(value) - Number(fromMin)) /
        (Number(fromMax) - Number(fromMin))) *
        (Number(toMax) - Number(toMin)) +
        Number(toMin),
    ),
  );
  liquid.registerFilter("where_exp", function (items, name, expression) {
    return (items || []).filter((item) => {
      this.context.push({ [name]: item });
      try {
        return liquid.evalValueSync(expression, this.context);
      } finally {
        this.context.pop();
      }
    });
  });
  liquid.registerFilter("group_by_exp", function (items, name, expression) {
    const groups = new Map();
    for (const item of items || []) {
      this.context.push({ [name]: item });
      let key;
      try {
        key = String(liquid.evalValueSync(expression, this.context));
      } finally {
        this.context.pop();
      }
      if (!groups.has(key)) groups.set(key, { name: key, items: [] });
      groups.get(key).items.push(item);
    }
    return [...groups.values()];
  });
  return liquid;
}
