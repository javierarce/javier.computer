import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as sass from "sass";
import {
  filesIn,
  frontMatter,
  parseYaml,
  loadData,
  readDocuments,
  routeFor,
  exposeFrontMatter,
  byNewest,
} from "./_build/content.mjs";
import { createLiquid, escapeXml, slugify } from "./_build/liquid.mjs";
import { buildPlaces, writePlaceFiles } from "./_build/places.mjs";
import { createMarkdown } from "./_build/markdown.mjs";
import { mapPlaceResponse } from "./_build/server.mjs";

process.env.TZ = "Europe/Madrid";

export default function (config) {
  const markdown = createMarkdown();
  let site, documents, generatedPlaces, outputDirectory;
  let firstBuild = true;
  let lastOutputs = new Set();
  const routes = new Map();
  const drafts = process.env.ELEVENTY_DRAFTS === "true";
  config.on("eleventy.before", ({ directories, runMode }) => {
    outputDirectory = directories.output;
    if (firstBuild) {
      const output = path.resolve(directories.output);
      const relative = path.relative(process.cwd(), output);
      if (
        !/^_site(?:_[\w-]+)?$/.test(relative) &&
        !relative.startsWith(`.context${path.sep}`)
      )
        throw new Error(
          "Build output must be _site, _site_<name>, or a directory inside .context. Refusing to clear a source directory.",
        );
      fs.rmSync(output, { recursive: true, force: true });
      firstBuild = false;
    }
    routes.clear();
    const settings = parseYaml(fs.readFileSync("_config.yml", "utf8"));
    documents = readDocuments({ drafts });
    const data = loadData("_data");
    generatedPlaces = buildPlaces(documents, markdown);
    data.locations = { ...data.locations, ...generatedPlaces.locations };
    data.geotagged_posts = generatedPlaces.geotagged_posts;
    const posts = documents.filter((doc) =>
      /^(content\/_posts|_drafts)\//.test(doc.file),
    );
    const existingTags = new Set(
      filesIn("tags").map(
        (file) => frontMatter(fs.readFileSync(file, "utf8")).data.tag,
      ),
    );
    const existingLocations = new Set(
      documents
        .filter((doc) => doc.file.startsWith("content/_locations/"))
        .map((doc) => doc.location?.toLowerCase()),
    );
    site = {
      ...settings,
      data,
      time: new Date(),
      development: runMode !== "build",
      generatedTags: [
        ...new Set(posts.flatMap((post) => post.tags || [])),
      ].filter((tag) => tag && !existingTags.has(tag)),
      generatedLocations: [
        ...new Set(
          posts.map((post) =>
            String(post.location || "")
              .trim()
              .toLowerCase(),
          ),
        ),
      ]
        .filter((location) => location && !existingLocations.has(location))
        .map((location) => ({
          location,
          title: location.charAt(0).toUpperCase() + location.slice(1),
        })),
    };
  });
  config.addGlobalData("site", () => site);
  config.setServerOptions({
    onRequest: {
      "/rss": () => ({ status: 302, headers: { Location: "/feed.xml" } }),
      "/me": () => ({ status: 302, headers: { Location: "/about" } }),
      "/maps/:city/:pid": ({ patternGroups }) =>
        mapPlaceResponse(patternGroups, {
          documents,
          locations: site.data.locations,
          outputDirectory,
        }),
    },
  });
  config.setFrontMatterParsingOptions({ engines: { yaml: parseYaml } });
  for (const file of filesIn("_layouts"))
    config.addLayoutAlias(
      path.relative("_layouts", file).replace(/\.html$/, ""),
      path.relative("_layouts", file),
    );
  config.addExtension("xml", { key: "html" });
  config.addExtension("opml", { key: "html" });
  config.setLibrary("md", markdown);
  config.setLibrary(
    "liquid",
    createLiquid(markdown, () => site),
  );
  config.addLiquidFilter("slugify", slugify);
  config.setUseGitIgnore(false);
  for (const ignored of [
    ".context/**",
    ".computer/**",
    ".git/**",
    ".github/**",
    ".obsidian/**",
    ".yarn/**",
    "node_modules/**",
    "vendor/**",
    "_site*/**",
    "_build/**",
    "_scripts/**",
    "_templates/**",
    "README.md",
    "CLAUDE.md",
    "AGENTS.md",
    "binocularshot/**",
  ])
    config.ignores.add(ignored);
  config.watchIgnores.add(".context/**");
  config.watchIgnores.add("_site*/**");
  if (!drafts) config.ignores.add("_drafts/**");
  config.addWatchTarget("_config.yml");
  config.addWatchTarget("_data/");
  config.addWatchTarget("_sass/");
  config.addWatchTarget("_build/");
  config.addWatchTarget("css/style.scss");

  for (const directory of [
    "assets",
    "img",
    "favicons",
    "scripts",
    "js",
    ".well-known",
  ])
    config.addPassthroughCopy(directory);
  config.addPassthroughCopy({ "tools/*.css": "tools", "tools/*.js": "tools" });
  config.addPassthroughCopy("*.{png,ico,txt,xsl,css,webmanifest}");
  config.addPassthroughCopy("CNAME");
  config.addPassthroughCopy("feeds/*.rss");

  config.addUrlTransform(({ url }) => routes.get(url));
  config.addPreprocessor(
    "content-metadata",
    ["md", "html", "xml", "opml", "liquid"],
    function (data) {
      const file = this.inputPath.replace(/^\.\//, "");
      if (data.published === false) return false;
      if (
        /^(content\/_posts|_drafts)\//.test(file) &&
        data.page.date > new Date()
      )
        return false;
      // Eleventy reserves page for file metadata. Mirror authored metadata here
      // too so existing includes can keep receiving photo=page and post=page.
      const reserved = new Set([
        "page",
        "collections",
        "site",
        "pkg",
        "eleventy",
        "eleventyComputed",
        "pagination",
        "permalink",
      ]);
      const authored = fs.existsSync(file)
        ? frontMatter(fs.readFileSync(file, "utf8")).data
        : data;
      data.layoutMeta = {};
      let layout = authored.layout;
      while (layout) {
        const meta = frontMatter(
          fs.readFileSync(
            path.join(
              "_layouts",
              layout.endsWith(".html") ? layout : `${layout}.html`,
            ),
            "utf8",
          ),
        ).data;
        data.layoutMeta = { ...meta, ...data.layoutMeta };
        layout = meta.layout;
      }
      for (const [key, value] of Object.entries(authored))
        if (!reserved.has(key)) data.page[key] = value;
      data.page.permalink =
        typeof data.permalink === "string" ? data.permalink : undefined;
      data.page.path = file;
      data.page.name = path.basename(file);
      data.page.hasDate = Boolean(authored.date);
      if (/^(content\/|_drafts\/)/.test(file)) {
        data.page.slug =
          authored.slug ||
          path
            .basename(file)
            .replace(/\.[^.]+$/, "")
            .replace(/^\d{4}-\d{2}-\d{2}-/, "");
        if (!authored.date && !/^(content\/_posts|_drafts)\//.test(file))
          data.page.date = site.time;
      }
      if (!data.title && /^(content\/_posts|_drafts)\//.test(file))
        data.page.title = path
          .basename(file)
          .replace(/^\d{4}-\d{2}-\d{2}-/, "")
          .replace(/\.[^.]+$/, "")
          .replaceAll("-", " ");
      data.page.tags = Array.isArray(authored.tags)
        ? authored.tags
        : authored.tags
          ? String(authored.tags).split(/\s+/)
          : [];
      if (!data.pagination && typeof data.permalink !== "function") {
        const route = routeFor(file, { ...data, date: data.page.date });
        data.permalink = route.output;
        routes.set(route.output.replace(/\/index\.html$/, "/"), route.url);
      }
      if (data.layout === "archive" || data.layout === "movies") {
        const name = data.layout === "archive" ? "postYears" : "movieYears";
        const key = data.layout === "archive" ? "archive_year" : "movie_year";
        data.eleventyComputed = {
          ...data.eleventyComputed,
          [`page.${key}`]: (values) =>
            values[key] || values.collections[name]?.[0],
          "page.all_years": (values) => values.collections[name],
        };
      }
      if (data.pagination?.alias === "tag")
        data.eleventyComputed = {
          ...data.eleventyComputed,
          "page.tag": (values) => values.tag,
        };
      if (data.pagination?.alias === "newLocation")
        data.eleventyComputed = {
          ...data.eleventyComputed,
          "page.location": (values) => values.newLocation.location,
          "page.title": (values) => values.newLocation.title,
        };
      if (data.pagination && !file.startsWith("generated/"))
        data.eleventyComputed = {
          ...data.eleventyComputed,
          "page.title": (values) =>
            authored.title +
            (values.pagination.pageNumber
              ? ` - page ${values.pagination.pageNumber + 1}`
              : ""),
        };
    },
  );

  const collectionNames = [
    "posts",
    "photos",
    "books",
    "movies",
    "drawings",
    "places",
    "maps",
    "locations",
    "projects",
  ];
  for (const name of collectionNames) {
    config.addCollection(name, (api) => {
      const entries = api
        .getFilteredByGlob(
          name === "posts"
            ? [
                "content/_posts/**/*.{md,html}",
                ...(drafts ? ["_drafts/**/*.{md,html}"] : []),
              ]
            : `content/_${name}/**/*.{md,html}`,
        )
        .map(exposeFrontMatter);
      if (name === "posts") {
        entries.sort(byNewest);
      } else {
        entries.sort(
          (a, b) =>
            a.date - b.date ||
            (a.inputPath < b.inputPath
              ? -1
              : a.inputPath > b.inputPath
                ? 1
                : 0),
        );
      }
      if (name === "posts" || name === "photos") {
        const direction = name === "posts" ? -1 : 1;
        const link = (item) =>
          item && {
            url: item.url,
            title: item.title,
            category: item.category,
            date: item.date,
          };
        entries.forEach((item, index) => {
          item.next = item.data.page.next = link(entries[index + direction]);
          item.previous = item.data.page.previous = link(
            entries[index - direction],
          );
        });
      }
      return name === "locations"
        ? [
            ...entries,
            ...site.generatedLocations.map((location) => ({
              ...location,
              url: `/in/${location.location}`,
            })),
          ]
        : entries;
    });
  }
  config.addCollection("pages", (api) =>
    api
      .getAll()
      .filter((item) => !item.inputPath.startsWith("./content/"))
      .sort((a, b) =>
        path.basename(a.inputPath).localeCompare(path.basename(b.inputPath)),
      )
      .map(exposeFrontMatter),
  );
  const posts = (api) =>
    api
      .getFilteredByGlob([
        "content/_posts/**/*.{md,html}",
        ...(drafts ? ["_drafts/**/*.{md,html}"] : []),
      ])
      .map(exposeFrontMatter)
      .sort(byNewest);
  config.addCollection("homePosts", (api) =>
    posts(api).filter((post) => !post.hidden),
  );
  config.addCollection("photoPosts", (api) =>
    posts(api).filter((post) => !post.hidden && post.tags.includes("photo")),
  );
  config.addCollection("postTags", (api) => {
    const groups = {};
    for (const post of posts(api).reverse())
      for (const tag of post.tags) (groups[tag] ||= []).unshift(post);
    return groups;
  });
  config.addCollection("postCategories", (api) => {
    const groups = {};
    for (const post of posts(api))
      for (const category of [post.category, ...(post.categories || [])].filter(
        Boolean,
      ))
        (groups[category] ||= []).push(post);
    return groups;
  });
  config.addCollection("postYears", (api) =>
    [...new Set(posts(api).map((post) => String(post.date.getFullYear())))]
      .sort()
      .reverse(),
  );
  config.addCollection("movieYears", (api) =>
    [
      ...new Set(
        api
          .getFilteredByGlob("content/_movies/**/*.md")
          .map(
            (movie) =>
              movie.data.watched_on &&
              String(new Date(movie.data.watched_on).getFullYear()),
          )
          .filter(Boolean),
      ),
    ]
      .sort()
      .reverse(),
  );
  config.addGlobalData("eleventyComputed", {
    "page.id": (data) =>
      data.page.slug
        ? path.posix.join(
            path.posix.dirname(data.page.url || "/"),
            data.page.slug,
          )
        : undefined,
    paginator: (data) =>
      data.pagination?.pages
        ? {
            page: data.pagination.pageNumber + 1,
            total_pages: data.pagination.pages.length,
            posts: data.pagination.items,
          }
        : undefined,
  });

  for (const [kind, collection, alias] of [
    ["archive", "postYears", "archive_year"],
    ["movies", "movieYears", "movie_year"],
  ]) {
    config.addTemplate(`generated/${kind}.liquid`, "", {
      layout: kind,
      title: kind === "archive" ? "Archivo" : "Movies",
      ...(kind === "archive" ? { category: "posts" } : {}),
      pagination: {
        data: `collections.${collection}`,
        size: 1,
        alias,
        before: (years) => years.slice(1),
      },
      permalink: (data) =>
        `/${kind === "archive" ? "posts" : "movies"}/${data[alias]}/index.html`,
    });
  }
  config.addTemplate("generated/tags.liquid", "", {
    layout: "tag",
    pagination: { data: "site.generatedTags", size: 1, alias: "tag" },
    permalink: (data) => {
      const output = `/tags/${data.tag}.html`;
      routes.set(output, `/tags/${data.tag}`);
      return output;
    },
  });
  config.addTemplate("generated/locations.liquid", "", {
    layout: "location",
    pagination: {
      data: "site.generatedLocations",
      size: 1,
      alias: "newLocation",
    },
    permalink: (data) => {
      const output = `/in/${data.newLocation.location}.html`;
      routes.set(output, `/in/${data.newLocation.location}`);
      return output;
    },
  });
  config.on("eleventy.after", ({ directories, results }) => {
    const outputs = new Set(
      results.map((result) => result.outputPath).filter(Boolean),
    );
    for (const previous of lastOutputs)
      if (!outputs.has(previous)) fs.rmSync(previous, { force: true });
    lastOutputs = outputs;
    fs.mkdirSync(path.join(directories.output, "css"), { recursive: true });
    const styles = fs
      .readFileSync("css/style.scss", "utf8")
      .replace(/^---\n[\s\S]*?\n---\n/, "");
    const css = sass.compileString(styles, {
      loadPaths: ["_sass"],
      style: "compressed",
      quietDeps: true,
      sourceMap: true,
      sourceMapIncludeSources: true,
    });
    css.sourceMap.sources = css.sourceMap.sources.map((source) =>
      source.startsWith("file:")
        ? `../${path.relative(process.cwd(), fileURLToPath(source))}`
        : source,
    );
    fs.writeFileSync(
      path.join(directories.output, "css/style.css"),
      css.css + "\n/*# sourceMappingURL=style.css.map */",
    );
    fs.writeFileSync(
      path.join(directories.output, "css/style.css.map"),
      JSON.stringify(css.sourceMap),
    );
    writePlaceFiles(directories.output, generatedPlaces, site, documents);
    const redirects = {};
    for (const item of results) {
      const source =
        item.inputPath && fs.existsSync(item.inputPath)
          ? frontMatter(fs.readFileSync(item.inputPath, "utf8")).data
          : {};
      for (const from of [source.redirect_from || []].flat()) {
        const route = routeFor("", { permalink: from });
        const output = path.join(directories.output, route.output);
        const target = new URL(item.url, site.url).href;
        fs.mkdirSync(path.dirname(output), { recursive: true });
        fs.writeFileSync(
          output,
          `<!doctype html><html lang="es"><head><meta charset="utf-8"><link rel="canonical" href="${escapeXml(target)}"><meta http-equiv="refresh" content="0; url=${escapeXml(target)}"><title>Redirecting…</title></head><body><a href="${escapeXml(target)}">Continue</a></body></html>`,
        );
        redirects[from] = target;
      }
    }
    fs.writeFileSync(
      path.join(directories.output, "redirects.json"),
      JSON.stringify(redirects),
    );
    if (site.development) {
      fs.mkdirSync(path.join(directories.output, "tools"), { recursive: true });
      fs.writeFileSync(
        path.join(directories.output, "tools/reportages.json"),
        JSON.stringify(
          documents
            .filter((doc) => doc.layout === "reportage")
            .sort((a, b) => b.date - a.date)
            .map((doc) => ({
              title: doc.title,
              date: doc.date.toISOString().slice(0, 10),
              path: doc.file,
              raw: doc.raw,
            })),
        ),
      );
    } else
      fs.rmSync(path.join(directories.output, "tools/reportages.json"), {
        force: true,
      });
  });
  return {
    dir: {
      input: ".",
      output: "_site",
      includes: "_includes",
      layouts: "_layouts",
      data: "_build/data",
    },
    templateFormats: ["md", "html", "liquid", "xml", "opml"],
    markdownTemplateEngine: "liquid",
    htmlTemplateEngine: "liquid",
  };
}
