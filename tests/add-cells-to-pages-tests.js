var test = require('tape');
var AddCellsToPages = require('../add-cells-to-pages');

var addCellsToPages = AddCellsToPages({});

var testCases = [
  {
    opts: {
      cellsToAdd: [1, 2, 3]
    },
    expected: {
      newLastPageIndex: 0,
      updatedPages: [
        {
          index: 0,
          cells: [1, 2, 3]
        }
      ]
    }
  },

  {
    opts: {
      currentLastPage: {
        index: 0,
        cells: [1, 2, 3, 4, 5, 6, 7, 8]
      },
      cellsToAdd: [9, 10, 11]
    },
    expected: {
      newLastPageIndex: 1,
      updatedPages: [
        {
          index: 0,
          cells: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        },
        {
          index: 1,
          cells: [11]
        }
      ]
    }
  },

  {
    opts: {
      currentLastPage: {
        index: 1,
        cells: [11]
      },
      cellsToAdd: [
        12,
        13,
        14,
        15,
        16,
        17,
        18,
        19,
        20,
        21,
        22,
        23,
        24,
        25,
        26,
        27,
        28,
        29,
        30,
        31,
        32,
        33,
        34,
        35,
        36
      ]
    },
    expected: {
      newLastPageIndex: 3,
      updatedPages: [
        {
          index: 1,
          cells: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
        },
        {
          index: 2,
          cells: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30]
        },
        {
          index: 3,
          cells: [31, 32, 33, 34, 35, 36]
        }
      ]
    }
  }
];

testCases.forEach(runTest);

function runTest(testCase) {
  test('Add cells to pages', addCellsTest);

  function addCellsTest(t) {
    t.deepEqual(
      addCellsToPages(testCase.opts),
      testCase.expected,
      'Result index and updated pages are correct.'
    );
    t.end();
  }
}
