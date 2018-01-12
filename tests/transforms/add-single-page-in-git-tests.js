var test = require('tape');
var StreamTestBed = require('through-stream-testbed');
var AddSinglePageInGit = require('../../transforms/add-single-page-in-git');
var config = require('../../config');
var request = require('request');
var randomId = require('idmaker').randomId;

var cell = {
  id: randomId(8),
  caption: randomId(8),
  htmlFragment: `<div>test fragment ${randomId(8)}</div>`
};

var addSinglePageInGit = AddSinglePageInGit({
  branch: 'master',
  gitRepoOwner: config.githubTest.gitRepoOwner,
  gitToken: config.githubTest.gitToken,
  repo: config.githubTest.repo,
  request: request,
  shouldSetUserAgent: true,
  htmlDir: 'video'
});

test(
  'Test adding single video page to index in git',
  StreamTestBed({
    transformFn: addSinglePageInGit,
    inputItems: [cell],
    checkCollectedStreamOutput: checkGitResults,
    checkOutputItem: checkGitResult
  })
);

function checkGitResults(t, resultCells) {
  t.equal(resultCells.length, 1, 'There is a git result object for each cell.');
  console.log('Look at the repo to verify the correct updates were committed.');
}

function checkGitResult(t, resultCell) {
  t.ok(resultCell.postedSingleVideoPage, 'postedSingleVideoPage flag is set.');
}
