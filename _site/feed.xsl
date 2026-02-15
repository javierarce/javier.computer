<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="3.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <title><xsl:value-of select="/rss/channel/title"/> Blog RSS Feed</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"/>
        <meta charset="UTF-8"/>
        <link rel="stylesheet" href="/feed.css"/>
      </head>
      <body>
        <header>
          <h1><xsl:value-of select="/rss/channel/title"/></h1>
          <div class="aboutfeeds">
            <p>This is a web feed that can be viewed in the browser. Subscribe to the blog by copying 
<a hreflang="en"><xsl:attribute name="href"><xsl:value-of select="/rss/channel/link"/></xsl:attribute>the URL</a>
            into your RSS reader. If you need to know more, read <a href="https://www.thisdaysportion.com/about/what-is-rss/">the guide by Leon Paternoster</a>.</p>
          </div>
        </header>
        <main>
          <h2><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 455.731 455.731" xml:space="preserve"><path style="fill:#f78422" d="M0 0h455.731v455.731H0z"/><path style="fill:#fff" d="M296.208 159.16C234.445 97.397 152.266 63.382 64.81 63.382v64.348c70.268 0 136.288 27.321 185.898 76.931 49.609 49.61 76.931 115.63 76.931 185.898h64.348c-.001-87.456-34.016-169.636-95.779-231.399z"/><path style="fill:#fff" d="M64.143 172.273v64.348c84.881 0 153.938 69.056 153.938 153.939h64.348c0-120.364-97.922-218.287-218.286-218.287z"/><circle style="fill:#fff" cx="109.833" cy="346.26" r="46.088"/></svg> Latest 20 posts</h2>
          <xsl:for-each select="/rss/channel/item">
            <article>
              <h3>
                <a hreflang="en"><xsl:attribute name="href"><xsl:value-of select="link"/></xsl:attribute><xsl:value-of select="title"/></a>
              </h3>
              <footer>Published: 

<time>
  <xsl:value-of select="substring(pubDate, 6, 2)" />
  <xsl:text> </xsl:text>
  <xsl:choose>
    <xsl:when test="substring(pubDate, 9, 3) = 'Jan'">January</xsl:when>
    <xsl:when test="substring(pubDate, 9, 3) = 'Feb'">February</xsl:when>
    <xsl:when test="substring(pubDate, 9, 3) = 'Mar'">March</xsl:when>
    <xsl:when test="substring(pubDate, 9, 3) = 'Apr'">April</xsl:when>
    <xsl:when test="substring(pubDate, 9, 3) = 'May'">May</xsl:when>
    <xsl:when test="substring(pubDate, 9, 3) = 'Jun'">June</xsl:when>
    <xsl:when test="substring(pubDate, 9, 3) = 'Jul'">July</xsl:when>
    <xsl:when test="substring(pubDate, 9, 3) = 'Aug'">August</xsl:when>
    <xsl:when test="substring(pubDate, 9, 3) = 'Sep'">September</xsl:when>
    <xsl:when test="substring(pubDate, 9, 3) = 'Oct'">October</xsl:when>
    <xsl:when test="substring(pubDate, 9, 3) = 'Nov'">November</xsl:when>
    <xsl:when test="substring(pubDate, 9, 3) = 'Dec'">December</xsl:when>
    <xsl:otherwise><xsl:value-of select="substring(pubDate, 9, 3)" /></xsl:otherwise>
  </xsl:choose>
  <xsl:text> </xsl:text>
  <xsl:value-of select="substring(pubDate, 13, 4)" /> <!-- Year -->
</time>
</footer>
            </article>
          </xsl:for-each>
        </main>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
