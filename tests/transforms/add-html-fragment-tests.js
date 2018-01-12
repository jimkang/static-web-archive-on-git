var test = require('tape');
var StreamTestBed = require('through-stream-testbed');

var addHTMLFragment = require('../../transforms/add-html-fragment');

var cells = [
  {
    id: '849617236574826497',
    caption: 'Tv2',
    date: 'Wed Apr 05 13:38:28 +0000 2017',
    videoBufferInfo: {
      bitrate: 832000,
      content_type: 'video/mp4',
      url:
        'http://jimkang.com/static-web-archive-on-git/tests/fixtures/videos/pbDLD37qZWDBGBHW.mp4'
    },
    postedToGit: true,
    mediaFilename: 'pbDLD37qZWDBGBHW.mp4'
  },
  {
    id: '849617052130213888',
    caption: '',
    date: 'Wed Apr 05 13:37:45 +0000 2017',
    videoBufferInfo: {
      bitrate: 832000,
      content_type: 'video/mp4',
      url:
        'http://jimkang.com/static-web-archive-on-git/tests/fixtures/videos/DPL17ys0-inDTwQW.mp4'
    },
    postedToGit: true,
    mediaFilename: 'DPL17ys0-inDTwQW.mp4'
  }
];

var expectedFragments = [
  `<li class="media-pane">
  <div class="media-time-stamp media-meta">
    <a href="849617236574826497.html">
      <time datetime="2017-04-05T13:38:28.000Z">4/5/2017, 9:38:28 AM</time>
    </a>
  </div>
  <video controls loop="true" preload="metadata" src="videos/pbDLD37qZWDBGBHW.mp4"></video>
  <div class="media-caption media-meta"><a href="849617236574826497.html">Tv2</a></div>
</li>`,
  `<li class="media-pane">
  <div class="media-time-stamp media-meta">
    <a href="849617052130213888.html">
      <time datetime="2017-04-05T13:37:45.000Z">4/5/2017, 9:37:45 AM</time>
    </a>
  </div>
  <video controls loop="true" preload="metadata" src="videos/DPL17ys0-inDTwQW.mp4"></video>
  <div class="media-caption media-meta"><a href="849617052130213888.html"></a></div>
</li>`
];

test(
  'Test addHTMLFragment',
  StreamTestBed({
    transformFn: addHTMLFragment,
    inputItems: cells,
    checkCollectedStreamOutput: checkHTMLFragments,
    checkOutputItem: checkHTMLFragment
  })
);

function checkHTMLFragments(t, resultCells) {
  t.equal(
    resultCells.length,
    cells.length,
    'There is a cell result for each input cell.'
  );
}

function checkHTMLFragment(t, cell, i) {
  t.equal(
    cell.htmlFragment,
    expectedFragments[i],
    'The html fragment is correct.'
  );
}
