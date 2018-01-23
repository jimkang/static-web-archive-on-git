/* global process */

var ndjson = require('ndjson');
var through2 = require('through2');
var BufferToGit = require('./transforms/buffer-to-git');
var addHTMLFragment = require('./transforms/add-html-fragment');
var request = require('request');
var AddCellsToPagesInGit = require('./transforms/add-cells-to-pages-in-git');
var UpdateIndexHTMLInGit = require('./transforms/update-index-html-in-git');
var AddSinglePageInGit = require('./transforms/add-single-page-in-git');
var defaults = require('lodash.defaults');

function createPostingStreamChain({
  config,
  title = 'A Static Web Archive',
  footerHTML = '',
  maxEntriesPerPage
}) {
  var gitOpts = {
    branch: 'gh-pages',
    gitRepoOwner: config.gitRepoOwner,
    gitToken: config.gitToken,
    repo: config.repo,
    request: request,
    shouldSetUserAgent: true,
    mediaDir: 'media',
    metaDir: 'meta'
  };

  var bufferToGit = BufferToGit(gitOpts);
  var addCellsToPagesInGit = AddCellsToPagesInGit(
    defaults({ maxEntriesPerPage }, gitOpts)
  );
  var updateIndexHTMLInGit = UpdateIndexHTMLInGit(
    defaults({ title, footerHTML }, gitOpts)
  );
  var addSinglePageInGit = AddSinglePageInGit(
    defaults({ title, footerHTML }, gitOpts)
  );

  var bufferToGitStream = createStreamWithTransform(bufferToGit, logError);
  var addHTMLFragmentStream = createStreamWithTransform(
    addHTMLFragment,
    logError
  );
  var updatePagesStream = createStreamWithTransform(
    addCellsToPagesInGit,
    logError
  );
  var updateIndexHTMLInGitStream = createStreamWithTransform(
    updateIndexHTMLInGit,
    logError
  );
  var addSinglePageInGitStream = createStreamWithTransform(
    addSinglePageInGit,
    logError
  );

  bufferToGitStream
    .pipe(addHTMLFragmentStream)
    .pipe(addSinglePageInGitStream)
    .pipe(updatePagesStream)
    .pipe(updateIndexHTMLInGitStream)
    .pipe(ndjson.stringify())
    .pipe(process.stdout);

  // function updateIndexHTML(updatedPagesInfo) {
  //   console.log('updatedPagesInfo', JSON.stringify(updatedPagesInfo, null, 2));
  // }

  return bufferToGitStream;
}

function createStreamWithTransform(transform, errorCallback) {
  var stream = through2({ objectMode: true }, transform);
  stream.on('error', errorCallback);
  return stream;
}

function logError(error) {
  console.log(error);
}

module.exports = createPostingStreamChain;
