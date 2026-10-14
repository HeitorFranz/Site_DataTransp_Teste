<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" encoding="UTF-8"/>
  <xsl:template match="/">
    <html>
      <head>
        <meta charset="UTF-8"/>
        <title>Datatransp Novidades</title>
      </head>
      <body>
        <h1>Datatransp Novidades</h1>
        <xsl:apply-templates select="rss/channel/item"/>
      </body>
    </html>
  </xsl:template>

  <xsl:template match="item">
    <article>
      <h2><xsl:value-of select="title"/></h2>
      <p><xsl:value-of select="description"/></p>
      <a><xsl:attribute name="href"><xsl:value-of select="link"/></xsl:attribute>Ver mais</a>
    </article>
  </xsl:template>
</xsl:stylesheet>
