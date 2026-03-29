<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="3.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <title><xsl:value-of select="/rss/channel/title"/></title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"/>
        <meta charset="UTF-8"/>
        <link rel="stylesheet" href="/feed.css"/>
      </head>
      <body>
        <header>
          <h1><xsl:value-of select="/rss/channel/title"/></h1>
          <div class="aboutfeeds">
            <p>This is a feed of places I like. Subscribe by copying
<a hreflang="en"><xsl:attribute name="href"><xsl:value-of select="/rss/channel/link"/></xsl:attribute>the URL</a>
            into your RSS reader.</p>
          </div>
        </header>
        <main>
          <h2><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 455.731 455.731" xml:space="preserve"><path style="fill:#f78422" d="M0 0h455.731v455.731H0z"/><path style="fill:#fff" d="M296.208 159.16C234.445 97.397 152.266 63.382 64.81 63.382v64.348c70.268 0 136.288 27.321 185.898 76.931 49.609 49.61 76.931 115.63 76.931 185.898h64.348c-.001-87.456-34.016-169.636-95.779-231.399z"/><path style="fill:#fff" d="M64.143 172.273v64.348c84.881 0 153.938 69.056 153.938 153.939h64.348c0-120.364-97.922-218.287-218.286-218.287z"/><circle style="fill:#fff" cx="109.833" cy="346.26" r="46.088"/></svg> Places</h2>
          <xsl:for-each select="/rss/channel/item">
            <article>
              <h3>
                <a hreflang="en"><xsl:attribute name="href"><xsl:value-of select="link"/></xsl:attribute><xsl:value-of select="title"/></a>
              </h3>
              <xsl:if test="description != ''">
                <div><xsl:value-of select="description" disable-output-escaping="yes"/></div>
              </xsl:if>
            </article>
          </xsl:for-each>
        </main>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
