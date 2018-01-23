var callNextTick = require('call-next-tick');

// Expected from an incoming cell:
// id
// caption
// optional: isVideo
// optional: mediaFilename
function addHTMLFragment(cell, enc, done) {
  var cellDate = new Date(cell.date);
  var formattedDate = cellDate.toISOString();
  var readableDate = cellDate.toLocaleString();

  cell.htmlFragment = `<li class="pane">
  <div class="time-stamp entry-meta">
    <a href="${cell.id}.html">
      <time datetime="${formattedDate}">${readableDate}</time>
    </a>
  </div>`;

  if (cell.mediaFilename) {
    // TODO: Use var for media dir in fragment below.
    if (cell.isVideo) {
      cell.htmlFragment += `<video controls loop="true" preload="metadata"
        src="media/${cell.mediaFilename}"></video>`;
    } else {
      cell.htmlFragment += `<img src="media/${
        cell.mediaFilename
      }" alt="${cell.altText || cell.caption}"></video>`;
    }
    cell.htmlFragment += `<div class="media-caption entry-meta">${
      cell.caption
    }</div>`;
  } else {
    cell.htmlFragment += `<div class="text-caption">${cell.caption}</div>\n`;
  }

  cell.htmlFragment += '</li>';

  this.push(cell);
  callNextTick(done);
}

module.exports = addHTMLFragment;
