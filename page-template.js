var titleRefRegex = /_TITLE_REF/g;
var footerScriptRegex = /_FOOTER_SCRIPT_REF/g;

function getHeader(title) {
  return `<html>
  <head>
    <title>_TITLE_REF</title>
    <link rel="stylesheet" href="../app.css"></link>
    <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
  </head>
  <body>

  <div class="annotation hidden warning">
  </div>

  <h1>_TITLE_REF</h1>

  <section class="media">
    <ul class="media-list">`.replace(titleRefRegex, title);
}

function getFooter({ previousIndexHTML, footerScript }) {
  return `</ul>
  </section>

  <div class="previous-indexes">${previousIndexHTML}</div>

  _FOOTER_SCRIPT_REF

  </body>
  </html>`.replace(footerScriptRegex, footerScript);
}

module.exports = {
  getHeader: getHeader,
  getFooter: getFooter
};
