import assert from "node:assert/strict";
import { test } from "node:test";
import { createLiquid, newsletterForFeed } from "./liquid.mjs";
import { XMLParser, XMLValidator } from "fast-xml-parser";
import { createMarkdown } from "./markdown.mjs";

const markdown = createMarkdown();
const liquid = createLiquid(markdown, () => ({ version: "test", url: "https://javier.computer" }));

test("newsletter tag accepts custom copy and escapes it inside Markdown", async () => {
  const html = markdown.render(await liquid.parseAndRender(
    `{% newsletter title:"News & projects" description:page.description %}`,
    { page: { description: '<script>alert("hello")</script>' } },
  ));
  assert.match(html, /<h3 class="newsletter__title">News &amp; projects<\/h3>/);
  assert.match(html, /&lt;script&gt;alert\(&quot;hello&quot;\)&lt;\/script&gt;/);
  assert.match(html, /<div class="js-newsletter-container" data-two-step><\/div>/);
  assert.match(html, /<script type="module" src="\/scripts\/newsletter.js\?version=test"><\/script>/);
  assert.doesNotMatch(html, /<p><div|<script>alert/);
});

test("newsletter copy is optional and multiple embeds share a module URL", async () => {
  const html = await liquid.parseAndRender("{% newsletter %}\n\n{% newsletter %}");
  assert.doesNotMatch(html, /newsletter__title|newsletter__description|Suscríbete/);
  assert.equal((html.match(/js-newsletter-container/g) || []).length, 2);
  assert.equal((html.match(/type="module" src="\/scripts\/newsletter.js\?version=test"/g) || []).length, 2);
});

test("RSS replaces every newsletter form with styled copy and an absolute signup link", async () => {
  const content = markdown.render(await liquid.parseAndRender(
    `{% newsletter title:"News & projects" description:page.description %}\n\n{% newsletter %}`,
    { page: { description: '<script>bad</script> "Hello" & goodbye' } },
  ));
  const feed = newsletterForFeed(content, "https://javier.computer");
  assert.equal((feed.match(/href="https:\/\/javier.computer\/newsletter"/g) || []).length, 2);
  assert.match(feed, /News &amp; projects/);
  assert.match(feed, /&lt;script&gt;bad&lt;\/script&gt; &quot;Hello&quot; &amp; goodbye/);
  assert.match(feed, /border:1px solid currentColor;border-radius:8px;padding:2.5rem 1.5rem/);
  assert.doesNotMatch(feed, /<script|<form|<input|newsletter\.js|js-newsletter|var\(--/);
  assert.match(content, /js-newsletter-container/);
  assert.equal(newsletterForFeed("<p>Unchanged</p>", "https://javier.computer"), "<p>Unchanged</p>");

  const xml = await liquid.parseAndRender(
    '<rss version="2.0"><channel><item><description>{{ content | newsletter_for_feed | xml_escape }}</description></item></channel></rss>',
    { content },
  );
  assert.equal(XMLValidator.validate(xml), true);
  assert.equal(new XMLParser({ trimValues: false }).parse(xml).rss.channel.item.description, feed);
});
