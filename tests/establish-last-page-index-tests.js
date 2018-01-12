var test = require('tape');
var config = require('../config');
var request = require('request');
var GitHubFile = require('github-file');
var establishLastPageIndex = require('../establish-last-page-index');
var randomId = require('idmaker').randomId;
var encoders = require('../base-64-encoders');

var assertNoError = require('assert-no-error');

var githubFile = GitHubFile({
  branch: 'master',
  gitRepoOwner: config.githubTest.gitRepoOwner,
  gitToken: config.githubTest.gitToken,
  repo: config.githubTest.repo,
  request: request,
  shouldSetUserAgent: true,
  encodeInBase64: encoders.encodeTextInBase64,
  decodeFromBase64: encoders.decodeFromBase64ToText
});

var indexFileLocation = 'indexes/' + randomId(4);

console.log('indexFileLocation:', indexFileLocation);

test('Get index when no index file exists yet', noIndexYetTest);
test('Get index when index file exists', indexExistsTest);

function noIndexYetTest(t) {
  establishLastPageIndex(githubFile, indexFileLocation, checkResult);

  function checkResult(error, index) {
    assertNoError(t.ok, error, 'No error while establishing index.');
    t.equal(index, 0, 'An index of 0 is established.');
    t.end();
  }
}

function indexExistsTest(t) {
  githubFile.update(
    { filePath: indexFileLocation, content: '4' },
    runEstablish
  );

  function runEstablish(error) {
    assertNoError(t.ok, error, 'No error while updating file.');
    establishLastPageIndex(githubFile, indexFileLocation, checkResult);
  }

  function checkResult(error, index) {
    assertNoError(t.ok, error, 'No error while establishing index.');
    t.equal(index, 4, 'Index is correct.');
    t.end();
  }
}
