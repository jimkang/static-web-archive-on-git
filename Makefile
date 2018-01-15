test: git-tests
	node tests/add-cells-to-pages-tests.js
	node tests/make-index-html-from-page-spec-tests.js
	node tests/integration/post-through-chain-test.js

git-tests:
	node tests/transforms/buffer-to-git-tests.js
	node tests/transforms/add-cells-to-pages-in-git-tests.js
	node tests/transforms/update-index-html-in-git-tests.js
	node tests/transforms/add-single-page-in-git-tests.js

pushall:
	git push origin master

prettier:
	prettier --single-quote --write "**/*.js"
