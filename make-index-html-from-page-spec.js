var pluck = require('lodash.pluck');

function makeIndexHTMLFromPageSpec({
  mostRecentPageIndex,
  header,
  footer,
  pageSpec
}) {
  var filename = pageSpec.index + '.html';
  if (pageSpec.index === mostRecentPageIndex) {
    filename = 'index.html';
  }

  var sortedCells = pageSpec.cells.sort(compareCellsByDateDesc);

  return {
    filename: filename,
    content:
      header +
      '\n' +
      pluck(sortedCells, 'htmlFragment').join('\n') +
      '\n' +
      footer +
      '\n'
  };
}

function compareCellsByDateDesc(a, b) {
  return new Date(a.date) > new Date(b.date) ? -1 : 1;
}

module.exports = makeIndexHTMLFromPageSpec;
