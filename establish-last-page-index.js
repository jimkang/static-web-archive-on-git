var sb = require('standard-bail')();

function establishLastPageIndex(githubFile, indexFileLocation, establishDone) {
  githubFile.get(indexFileLocation, sb(inspectResponse, establishDone));

  function inspectResponse(gitResult) {
    if (gitResult.length < 1) {
      // It doesn't exist, so create it.
      githubFile.update(
        { filePath: indexFileLocation, content: '0' },
        sb(passZero, establishDone)
      );
    } else {
      establishDone(null, parseInt(gitResult.content, 10));
    }
  }

  function passZero() {
    establishDone(null, 0);
  }
}

module.exports = establishLastPageIndex;
