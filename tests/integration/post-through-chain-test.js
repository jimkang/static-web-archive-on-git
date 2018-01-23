/* global __dirname */

var test = require('tape');
var createPostingStreamChain = require('../../create-posting-stream-chain');
var config = require('../../config');
var fs = require('fs');
var randomId = require('idmaker').randomId;
require('longjohn');

var testPackages = [
  {
    id: 'test-a-' + randomId(4),
    date: new Date().toISOString(),
    mediaFilename: 'smidgeo_headshot.jpg',
    caption: 'Smidgeo!',
    altText: 'A picture of Smidgeo!',
    buffer: fs.readFileSync(
      __dirname + '/../fixtures/images/smidgeo_headshot.jpg'
    )
  },
  {
    id: 'test-b-' + randomId(4),
    date: new Date().toISOString(),
    isVideo: true,
    mediaFilename: 'pbDLD37qZWDBGBHW.mp4',
    caption: 'A window.',
    buffer: fs.readFileSync(
      __dirname + '/../fixtures/videos/pbDLD37qZWDBGBHW.mp4'
    )
  },
  {
    id: 'test-c-' + randomId(4),
    date: new Date().toISOString(),
    caption: 'Just text.'
  }
];

test('Should be able to post to stream and get HTML into git', chainTest);

function chainTest(t) {
  var postingStreamChain = createPostingStreamChain({
    config: config.githubTest
  });
  postingStreamChain.on('error', logError);
  testPackages.forEach(writeToStream);
  postingStreamChain.end(t.end);

  function writeToStream(package) {
    postingStreamChain.write(package);
  }
}

function logError(error) {
  console.log(error);
}
