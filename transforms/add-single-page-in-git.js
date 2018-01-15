var encoders = require('../base-64-encoders');
var defaults = require('lodash.defaults');
var cloneDeep = require('lodash.clonedeep');
var GitHubFile = require('github-file');
var template = require('../page-template');
var sb = require('standard-bail')();

function AddSinglePageInGit(opts) {
  const htmlDir = opts.htmlDir;
  const title = opts.title;
  const footerScript = opts.footerScript;

  var githubFileForText = GitHubFile(
    defaults(cloneDeep(opts), {
      encodeInBase64: encoders.encodeTextInBase64,
      decodeFromBase64: encoders.decodeFromBase64ToText
    })
  );

  return addSinglePageInGit;

  function addSinglePageInGit(cellToAdd, enc, addCellsDone) {
    var html =
      template.getHeader(title) +
      '\n' +
      cellToAdd.htmlFragment +
      '\n' +
      template.getFooter({ previousIndexHTML: '', footerScript });

    var filePath = '';
    if (htmlDir) {
      filePath = htmlDir + '/';
    }
    filePath += cellToAdd.id + '.html';

    githubFileForText.update(
      {
        filePath: filePath,
        content: html,
        message: 'static-web-archive-on-git posting single entry HTML'
      },
      sb(passResultsAfterDelay, addCellsDone)
    );

    function passResultsAfterDelay() {
      setTimeout(passResults, 2000);
    }

    function passResults() {
      cellToAdd.postedSingleVideoPage = true;
      addCellsDone(null, cellToAdd);
    }
  }
}

module.exports = AddSinglePageInGit;
