import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import vm from "node:vm";
import { spawnSync } from "node:child_process";
import { test } from "node:test";
import { XMLParser, XMLValidator } from "fast-xml-parser";
import { frontMatter, routeFor } from "./content.mjs";
import { createLiquid, sortItems } from "./liquid.mjs";
import { createMarkdown } from "./markdown.mjs";
import { buildPlaces, placesCsv, placesFeed } from "./places.mjs";

process.env.TZ = "Europe/Madrid";
const markdown = createMarkdown();

test("existing front matter, dated URLs, and accented slugs survive the migration", () => {
  const { data, content } = frontMatter(
    '--- \ntitle: First\ntitle: Last\nlayout: post\ndate: "2024-05-31 23:30:00 +0200"\ntag: photo\ntags: [photo, música]\n--- \nBody',
  );
  assert.equal(data.title, "Last");
  assert.deepEqual(data.tags, ["photo", "música"]);
  assert.equal(content, "Body");
  assert.deepEqual(
    routeFor("content/_posts/2024-05-31-club del disco.md", data),
    {
      url: "/2024/05/31/club-del-disco",
      output: "/2024/05/31/club-del-disco.html",
    },
  );
  assert.deepEqual(routeFor("tags/música.md", {}), {
    url: "/tags/música",
    output: "/tags/música.html",
  });
  assert.deepEqual(
    routeFor("photos/berlin.md", { permalink: "photos/berlin" }),
    { url: "/photos/berlin", output: "/photos/berlin.html" },
  );
  assert.equal(
    frontMatter("---\ntitle: 2017-07-19\n---").data.title,
    "2017-07-19",
  );
  assert.equal(
    frontMatter('---\ndate: "2025-01-03"\n---').data.date.toISOString(),
    "2025-01-02T23:00:00.000Z",
  );
});

test("Liquid photo blocks keep nesting, captions, and following Markdown links", async () => {
  const liquid = createLiquid(markdown, () => ({ url: "https://example.com" }));
  const body = await liquid.parseAndRender(
    '{% stack gap-8 %}{% row %}{% photo berlin DSCF1234 2/3 alt:"A & B" caption:"At home" %}{% endrow %}{% endstack %}\n\n{% photo berlin DSCF5678 -%}\n\nA [working link](https://example.com).',
  );
  const html = markdown.render(body);
  assert.match(html, /class="stack gap-8"><div class="row">/);
  assert.match(html, /alt="A &amp; B"/);
  assert.match(html, /--aspect-ratio: 2\/3/);
  assert.match(html, /<figcaption>At home<\/figcaption>/);
  assert.match(html, /<a href="https:\/\/example.com">working link<\/a>/);
  assert.equal(
    await liquid.parseAndRender(
      '{{ tags | where_exp: "tag", "tag != \'photo\'" | jsonify }}',
      { tags: ["photo", "música"] },
    ),
    '["música"]',
  );
});

test("raw HTML, code blocks, and dates retain their meaning", () => {
  const raw =
    '<div class="outer">\n\n<a\n href="/books"\n>Books</a\n>\n\n</div>\n';
  assert.equal(markdown.render(raw), raw);
  assert.match(
    markdown.render("```sql\nSELECT * FROM books\n```"),
    /class="k">SELECT/,
  );
  assert.match(
    markdown.render("# Hello world\n\n# Hello world"),
    /id="hello-world-1"/,
  );
  assert.deepEqual(
    sortItems(
      [
        { date: "2026-01-01" },
        { date: null },
        { date: new Date("2025-01-01") },
      ],
      "date",
    ).map((item) => item.date),
    [null, new Date("2025-01-01"), "2026-01-01"],
  );
});

test("places, feed dates, tags, CSV escaping, and grouped geotags are rebuilt from content", () => {
  const place = {
    file: "content/_places/cafe.md",
    pid: "cafe",
    location: "berlin",
    title: "A & B",
    address: "Street, 1",
    description: "**Coffee**",
    tags: " Café, café, books ",
    updated_at: "2023-01-01",
    date: new Date("2023-01-01"),
    raw: "---\nupdated_at: 2023-01-01\n---",
    latlng: [52.5, 13.4],
  };
  const post = {
    file: "content/_posts/2024-01-01-visit.md",
    title: "A visit",
    url: "/2024/01/01/visit",
    date: new Date("2024-01-01"),
    location: "berlin",
    latlng: [52.5, 13.4],
    places: ["cafe", "cafe"],
  };
  assert.equal(
    frontMatter("---\ntags: café, books\n---").data.tags,
    "café, books",
  );
  const data = buildPlaces([place, post], markdown);
  const cafe = data.locations.berlin[0];
  assert.deepEqual(cafe.tags, ["café", "books"]);
  assert.equal(cafe.post_references.length, 1);
  assert.equal(cafe.last_updated.toISOString(), "2024-01-01T00:00:00.000Z");
  assert.equal(data.geotagged_posts.berlin[0].posts[0].url, post.url);
  assert.deepEqual(buildPlaces([place], markdown).geotagged_posts, {});
  assert.match(placesCsv([cafe]), /"Street, 1"/);
  const feed = placesFeed(
    [cafe],
    "berlin",
    { url: "https://example.com" },
    { berlin: "Berlín" },
  );
  assert.equal(XMLValidator.validate(feed), true);
  const parsed = new XMLParser().parse(feed);
  assert.equal(parsed.rss.channel.item.title, "A & B");
  assert.match(
    parsed.rss.channel.item.description,
    /https:\/\/example.com\/2024\/01\/01\/visit/,
  );
});

test(
  "a production build preserves navigation and feeds, excludes drafts, and does not write source files",
  { timeout: 60000 },
  () => {
    const root = process.cwd();
    const fixture = fs.mkdtempSync(
      path.join(os.tmpdir(), "computer-eleventy-"),
    );
    const write = (file, value) => {
      const target = path.join(fixture, file);
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.writeFileSync(target, value);
    };
    try {
      for (const file of [
        "_build",
        "_includes",
        "_layouts",
        "_sass",
        "_data",
        "_config.yml",
        "eleventy.config.mjs",
        "index.html",
        "index.11tydata.js",
        "feed.xml",
        "search.md",
        "css",
        "pages/photos.html",
        "pages/photos.11tydata.js",
        "pages/archive.html",
        "pages/movies.md",
        "feeds/photos.xml",
      ]) {
        fs.mkdirSync(path.dirname(path.join(fixture, file)), {
          recursive: true,
        });
        fs.cpSync(path.join(root, file), path.join(fixture, file), {
          recursive: true,
        });
      }
      fs.symlinkSync(
        path.join(root, "node_modules"),
        path.join(fixture, "node_modules"),
        "dir",
      );
      write(
        "content/_posts/2024-01-02-new.md",
        '---\nlayout: post\ntitle: New post\ndate: "2024-01-02 12:00:00 +0100"\ntag: migration\nlocation: newcity\nredirect_from: /old-post\n---\nHello [world](https://example.com).<!-- more --> Continued article text.',
      );
      write(
        "content/_posts/2023-01-01-photo.md",
        '---\nlayout: photos/photo\ntitle: Old photo\ndate: "2023-01-01 12:00:00 +0100"\ntag: photo\ncategory: photo\nlocation: newcity\nfilenames:\n  - filename: portrait\n    pair: partner\n    ratio: 2/3\n---\n',
      );
      write(
        "content/_posts/2024-01-01-hidden.md",
        "---\nlayout: post\ntitle: Hidden post\nhidden: true\n---\nHidden from pagination only.",
      );
      write(
        "content/_posts/2024-01-01-unpublished.md",
        "---\nlayout: post\npublished: false\n---\nUnpublished sentinel.",
      );
      write(
        "content/_posts/2099-01-01-future.md",
        "---\nlayout: post\n---\nFuture sentinel.",
      );
      write(
        "_drafts/2024-01-01-preview.md",
        "---\nlayout: reportage\ntitle: Draft sentinel\n---\nPrivate raw content.",
      );
      write(
        "content/_movies/movie.md",
        "---\ntitle: Test film\npermalink: test-film\nwatched_on: 2024-01-01\n---",
      );
      write(
        "content/_places/test-cafe.md",
        "---\ntitle: Test cafe\npid: test-cafe\nlocation: newcity\ndate: 2024-01-01\nlatlng: [41.4, 2.1]\n---",
      );
      for (const [name, date] of [
        ["z-oldest", "2013-01-01"],
        ["a-middle", "2015-01-01"],
        ["m-newest", "2017-01-01"],
      ])
        write(
          `content/_photos/${name}.md`,
          `---\nlayout: photos/photo\ntitle: ${name}\ndate: ${date}\ncategory: photo\n---\nAlbum content.`,
        );
      const build = spawnSync(
        process.execPath,
        [path.join(root, "node_modules/@11ty/eleventy/cmd.cjs"), "--quiet"],
        {
          cwd: fixture,
          env: { ...process.env, ELEVENTY_DRAFTS: "false" },
          encoding: "utf8",
          timeout: 50000,
        },
      );
      assert.equal(build.status, 0, build.stdout + build.stderr);
      const read = (file) =>
        fs.readFileSync(path.join(fixture, "_site", file), "utf8");
      assert.match(read("index.html"), /New post/);
      assert.doesNotMatch(read("index.html"), /Continued article text/);
      assert.match(read("index.html"), /href="\/2024\/01\/02\/new#more"/);
      assert.match(
        read("2024/01/02/new.html"),
        /<span id="more"><\/span> Continued article text/,
      );
      assert.match(read("2023/01/01/photo.html"), /id="more"/);
      assert.doesNotMatch(
        read("index.html"),
        /Hidden from pagination only|Draft sentinel|Future sentinel|Unpublished sentinel/,
      );
      assert.match(
        read("2024/01/02/new.html"),
        /href="\/2024\/01\/01\/hidden"/,
      );
      assert.match(
        read("2024/01/01/hidden.html"),
        /href="\/2024\/01\/02\/new"/,
      );
      assert.match(read("tags/migration.html"), /New post/);
      assert.match(read("in/newcity.html"), /New post/);
      assert.match(read("photos/index.html"), /2 fotos/);
      assert.match(read("2023/01/01/photo.html"), /class="photo__row"/);
      assert.match(read("2023/01/01/photo.html"), /partner_1280.jpg/);
      assert.match(read("2023/01/01/photo.html"), /href="\/in\/newcity"/);
      const pagination = (name) =>
        read(`photos/${name}/index.html`).split(
          '<div class="post__pagination">',
        )[1];
      assert.match(pagination("a-middle"), /href="\/photos\/z-oldest\/"/);
      assert.match(pagination("a-middle"), /href="\/photos\/m-newest\/"/);
      assert.doesNotMatch(pagination("z-oldest"), /post__pagination-prev/);
      assert.match(pagination("z-oldest"), /href="\/photos\/a-middle\/"/);
      assert.doesNotMatch(pagination("m-newest"), /post__pagination-next/);
      assert.match(pagination("m-newest"), /href="\/photos\/a-middle\/"/);
      assert.match(
        read("old-post.html"),
        /https:\/\/javier.computer\/2024\/01\/02\/new/,
      );
      assert.match(read("posts/2023/index.html"), /Old photo/);
      assert.equal(XMLValidator.validate(read("feed.xml")), true);
      assert.equal(XMLValidator.validate(read("feeds/photos.xml")), true);
      const context = { window: {} };
      const search = read("search.html").match(
        /<script>\s*(window.store[\s\S]*?)<\/script>/,
      )[1];
      vm.runInNewContext(search, context);
      assert.ok(
        Object.values(context.window.store).some(
          (item) => item.title === "New post",
        ),
      );
      assert.ok(
        !fs.existsSync(path.join(fixture, "_site/tools/reportages.json")),
      );
      assert.ok(
        !fs.existsSync(path.join(fixture, "_site/2099/01/01/future.html")),
      );
      assert.ok(
        !fs.existsSync(path.join(fixture, "_site/2024/01/01/unpublished.html")),
      );
      assert.ok(!fs.existsSync(path.join(fixture, "tags/migration.md")));
      assert.ok(
        !fs.existsSync(path.join(fixture, "content/_locations/newcity.md")),
      );
      // Rebuilding production into a previous dev output must remove raw sources.
      write("_site/tools/reportages.json", "private sentinel");
      const snapshot = (directory) =>
        Object.fromEntries(
          fs
            .readdirSync(directory, { recursive: true })
            .filter((file) => fs.statSync(path.join(directory, file)).isFile())
            .map((file) => [
              file,
              fs.readFileSync(path.join(directory, file)).toString("base64"),
            ]),
        );
      const preview = snapshot(path.join(fixture, "_site"));
      for (const output of ["_site_release", ".context/review-site"]) {
        write(`${output}/stale.html`, "stale build");
        write(`${output}/tools/reportages.json`, "private sentinel");
        const separate = spawnSync(
          process.execPath,
          [
            path.join(root, "node_modules/@11ty/eleventy/cmd.cjs"),
            "--quiet",
            `--output=${output}`,
          ],
          {
            cwd: fixture,
            env: { ...process.env, ELEVENTY_DRAFTS: "false" },
            encoding: "utf8",
            timeout: 50000,
          },
        );
        assert.equal(separate.status, 0, separate.stdout + separate.stderr);
        for (const file of [
          "index.html",
          "css/style.css",
          "css/style.css.map",
          "feeds/places.xml",
          "feeds/newcity.xml",
          "assets/maps/newcity.csv",
          "old-post.html",
          "redirects.json",
        ])
          assert.ok(
            fs.statSync(path.join(fixture, output, file)).size > 0,
            `${output}/${file}`,
          );
        assert.ok(!fs.existsSync(path.join(fixture, output, "stale.html")));
        assert.ok(
          !fs.existsSync(path.join(fixture, output, "tools/reportages.json")),
        );
        assert.deepEqual(snapshot(path.join(fixture, "_site")), preview);
      }
      const again = spawnSync(
        process.execPath,
        [path.join(root, "node_modules/@11ty/eleventy/cmd.cjs"), "--quiet"],
        {
          cwd: fixture,
          env: { ...process.env, ELEVENTY_DRAFTS: "false" },
          encoding: "utf8",
          timeout: 50000,
        },
      );
      assert.equal(again.status, 0, again.stdout + again.stderr);
      assert.ok(
        !fs.existsSync(path.join(fixture, "_site/tools/reportages.json")),
      );
    } finally {
      fs.rmSync(fixture, { recursive: true, force: true });
    }
  },
);
