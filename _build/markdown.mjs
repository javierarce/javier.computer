import MarkdownIt from "markdown-it";
import Prism from "prismjs";
import "prismjs/components/prism-sql.js";
import "prismjs/components/prism-markdown.js";

export function createMarkdown() {
  const markdown = new MarkdownIt({ html: true, typographer: true });
  const tokenClasses = {
    keyword: "k",
    string: "s",
    number: "m",
    comment: "c",
    operator: "o",
    punctuation: "p",
    boolean: "kc",
    function: "nf",
    "code-block": "s",
    title: "gh",
  };
  markdown.renderer.rules.fence = (tokens, index) => {
    const { content, info } = tokens[index];
    const language = info.trim().split(/\s+/)[0] || "plaintext";
    const grammar = Prism.languages[language];
    const code = grammar
      ? Prism.highlight(content, grammar, language).replace(
          /class="token ([^"]+)"/g,
          (_, types) =>
            `class="${types
              .split(" ")
              .map((type) => tokenClasses[type] || type)
              .join(" ")}"`,
        )
      : markdown.utils.escapeHtml(content);
    return `<div class="language-${markdown.utils.escapeHtml(language)} highlighter-rouge"><div class="highlight"><pre class="highlight"><code>${code}</code></pre></div></div>\n`;
  };
  markdown.renderer.rules.code_inline = (tokens, index) =>
    `<code class="language-plaintext highlighter-rouge">${markdown.utils.escapeHtml(tokens[index].content)}</code>`;
  // Authored HTML and Liquid includes use blank lines inside nested blocks.
  // Keep those blocks intact, as Kramdown did, instead of interpreting their
  // contents (including multiline HTML attributes) as Markdown paragraphs.
  markdown.block.ruler.before(
    "html_block",
    "paired-html",
    (state, startLine, endLine, silent) => {
      const start = state.bMarks[startLine] + state.tShift[startLine];
      const match = state.src
        .slice(start)
        .match(
          /^<(div|section|table|p|ul|ol|figure|header|footer|nav|script|style|details)\b[^>]*>/i,
        );
      if (!match) return false;
      const tag = match[1];
      const tags = new RegExp(`<(/?)${tag}\\b[^>]*>`, "gi");
      tags.lastIndex = start;
      let depth = 0,
        end = -1,
        token;
      while ((token = tags.exec(state.src))) {
        depth += token[1] ? -1 : 1;
        if (depth === 0) {
          end = tags.lastIndex;
          break;
        }
      }
      if (end < 0) return false;
      let nextLine = startLine;
      while (nextLine < endLine && state.bMarks[nextLine] < end) nextLine++;
      if (silent) return true;
      const block = state.push("html_block", "", 0);
      block.map = [startLine, nextLine];
      block.content = state.getLines(
        startLine,
        nextLine,
        state.blkIndent,
        true,
      );
      state.line = nextLine;
      return true;
    },
    { alt: ["paragraph", "reference", "blockquote"] },
  );
  markdown.core.ruler.push("heading-ids", (state) => {
    const seen = new Map();
    state.tokens.forEach((token, index) => {
      if (token.type !== "heading_open") return;
      const base =
        state.tokens[index + 1].content
          .toLowerCase()
          .replace(/^[^a-z]+/, "")
          .replace(/[^\w\s-]/g, "")
          .replace(/\s/g, "-") || "section";
      const count = seen.get(base) || 0;
      seen.set(base, count + 1);
      token.attrSet("id", base + (count ? `-${count}` : ""));
    });
  });
  return markdown;
}
