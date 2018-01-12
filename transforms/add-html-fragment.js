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

  if (cell.mediaFilename) {
    // TODO: Use var for media dir in fragment below.
    cell.htmlFragment = `<li class="media-pane">
    <div class="media-time-stamp media-meta">
      <a href="${cell.id}.html">
        <time datetime="${formattedDate}">${readableDate}</time>
      </a>
    </div>`;

    if (cell.isVideo) {
      cell.htmlFragment += `<video controls loop="true" preload="metadata"
        src="media/${cell.mediaFilename}"></video>`;
    } else {
      cell.htmlFragment += `<img src="media/${cell.mediaFilename}" alt="${
        cell.caption
      }"></video>`;
    }
    cell.htmlFragment += `<div class="media-caption media-meta">
      <a href="${cell.id}.html">${cell.caption}</a></div>
    </li>`;
  }

  this.push(cell);
  callNextTick(done);
}

module.exports = addHTMLFragment;
