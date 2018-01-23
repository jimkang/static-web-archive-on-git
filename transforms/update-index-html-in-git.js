var encoders = require('../base-64-encoders');
var defaults = require('lodash.defaults');
var cloneDeep = require('lodash.clonedeep');
var callNextTick = require('call-next-tick');
var GitHubFile = require('github-file');
var waterfall = require('async-waterfall');
var queue = require('d3-queue').queue;
var makeIndexHTMLFromPageSpec = require('../make-index-html-from-page-spec');
var sb = require('standard-bail')();
var template = require('../page-template');

function UpdateIndexHTMLInGit(opts) {
  const htmlDir = opts.htmlDir;
  const title = opts.title;
  const footerHTML = opts.footerHTML;

  var githubFileForText = GitHubFile(
    defaults(cloneDeep(opts), {
      encodeInBase64: encoders.encodeTextInBase64,
      decodeFromBase64: encoders.decodeFromBase64ToText
    })
  );

  return updateIndexHTMLInGit;

  function updateIndexHTMLInGit(cell, enc, updateDone) {
    var stream = this;
    var htmlPackages = cell.updatedPages.map(makeIndexHTMLFromPage);

    var q = queue(1);
    htmlPackages.forEach(queueHTMLUpdate);
    q.awaitAll(sb(passResults, updateDone));

    function makeIndexHTMLFromPage(page) {
      return makeIndexHTMLFromPageSpec({
        mostRecentPageIndex: cell.newLastPageIndex,
        header: template.getHeader(title),
        footer: template.getFooter({
          previousIndexHTML: getPreviousIndexHTML(page),
          footerHTML
        }),
        pageSpec: page
      });
    }

    function queueHTMLUpdate(htmlPackage) {
      q.defer(updateGitWithPackage, htmlPackage);
    }

    function updateGitWithPackage(htmlPackage, done) {
      waterfall([updateFileInGit, addIndexHTMLToCell], done);

      function updateFileInGit(done) {
        var filePath = '';
        if (htmlDir) {
          filePath = htmlDir + '/';
        }
        filePath += htmlPackage.filename;

        githubFileForText.update(
          {
            filePath: filePath,
            content: htmlPackage.content,
            message: 'static-web-archive-on-git posting updating index HTML'
          },
          done
        );
      }

      function addIndexHTMLToCell(content, done) {
        if (!cell.indexesHTML) {
          cell.indexesHTML = [];
        }
        cell.indexesHTML.push(htmlPackage);
        callNextTick(done);
      }
    }

    function passResults() {
      stream.push(cell);
      updateDone();
    }
  }
}

function getPreviousIndexHTML(page) {
  var previousIndexHTML = '';
  for (var i = page.index; i > 0; --i) {
    let previousIndex = i - 1;
    if (previousIndexHTML.length > 0) {
      previousIndexHTML += ' | \n';
    }
    previousIndexHTML += `<a href="${previousIndex}.html">${previousIndex}</a>`;
  }
  return previousIndexHTML;
}

module.exports = UpdateIndexHTMLInGit;
