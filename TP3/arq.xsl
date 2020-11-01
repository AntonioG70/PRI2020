<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    version="2.0">
    
    <xsl:output method="html" encoding="UTF-8" indent="yes"/>
    
    <xsl:template match="/">
        <xsl:result-document href="arqsite/index.html">
            <html>
                <head>
                    <style>
                        h3 {
                        color: green;
                        }
                        body {
                        background-color: lightblue;
                        }
                    </style>
                    <title>Arqueossítios</title>
                </head>
                <body>
                        <h3>Arqueossítios</h3>
                    <ul>
                        <xsl:apply-templates mode="indice" select="//ARQELEM"> 
                            <xsl:sort select="IDENTI"></xsl:sort>
                        </xsl:apply-templates>
                </ul>
                </body>
            </html>
        </xsl:result-document>
        <xsl:apply-templates/>
    </xsl:template>
    
    <!-- Templates para o índice ............................................-->
    
    <xsl:template match="ARQELEM" mode="indice">
        <li>
            <a name="i{generate-id()}"/>
            <a href="{generate-id()}.html">
                <xsl:value-of select="IDENTI"/>
            </a>
        </li>
    </xsl:template>
    
    <!-- Templates para o conteúdo ............................................-->
    
    <xsl:template match="ARQELEM">
        <xsl:result-document href="arqsite/{generate-id()}.html">
            <html>
                <head>
                    <style>
                        b {
                        color: green;
                        }
                        body {
                        background-color: lightblue;
                        }
                    </style>
                    <title><xsl:value-of select="IDENTI"/></title>
                </head>
                <body>
                    <p><b>Nome</b>: <xsl:value-of select="IDENTI"/></p> 
                    <p><b>Lugar</b>: <xsl:value-of select="LUGAR"/></p>
                    <p><b>Latitude</b>: <xsl:value-of select="LATITU"/></p> 
                    <p><b>Longitude</b>: <xsl:value-of select="LONGIT"/></p> 
                    <p><b>Altitude</b>: <xsl:value-of select="ALTITU"/></p> 
                    <address>[<a href="index.html#i{generate-id()}">Voltar ao índice</a>]</address>
                </body>
            </html>
        </xsl:result-document>
    </xsl:template>
    
</xsl:stylesheet>