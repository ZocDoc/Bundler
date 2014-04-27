var exec = require('child_process').exec,
      fs = require('fs'),
      fileNameStats = require('../../bundle-stats.js');

describe("fileNameStatsCollector - ", function() {

    var verifyImportsForFile,
        fileName1 = 'fileName1',
        import1 = 'A localized import',
        fileName2 = 'fileName2',
        import2 = 'A different import.',
        fileName3 = 'fileName3',
        import3 = 'A third import.',
        stats;

  beforeEach(function () {

      stats = new fileNameStats.BundleStatsCollector(null);
      stats.LessImports = {};
      verifyImportsForFile = function(file, imports)
      {
          expect(stats.LessImports[file].length).toBe(imports.length);

          for (var i = 0; i < imports.length; i++) {
              expect(stats.LessImports[file][i]).toBe(imports[i]);
          }
      };
  });

 describe("ParseLessForImports: ", function() {

  var getLessImport = function(i) {
      return "@import url('" + i+ '")\n style1 { color1: @importedColor; }';
      },
      ls1 = getLessImport(import1),
      ls2 = getLessImport(import2),
      lessDoubleQuote = '@import url("' + import3 + '")';

  it("Adds imports to the collection.", function() {

      stats.ParseLessForImports(fileName1, ls1);

      verifyImportsForFile(fileName1, [ import1 ]);

      stats.ParseLessForImports(fileName1, ls2);

      verifyImportsForFile(fileName1, [ import1, import2 ]);

      stats.ParseLessForImports(fileName1, lessDoubleQuote);

      verifyImportsForFile(fileName1, [ import1, import2, import3 ]);
  });

    it("Less with multiple imports adds them all.", function() {

        stats.ParseLessForImports(fileName1, ls1 + ls2 + lessDoubleQuote);
        verifyImportsForFile(fileName1, [ import1, import2, import3 ]);
    });

    it("Double quotes are can be used in the import url", function () {

        stats.ParseLessForImports(fileName1, lessDoubleQuote);
        verifyImportsForFile(fileName1, [import3]);
    });

    it("A file with no imports returns an empty array", function () {

        stats.ParseLessForImports(fileName1, '.thisHasNoImports { color: red; }\n');
        expect(stats.GetImportsForFile(fileName1).length).toBe(0);
    });

    it("Clearing a fileName removes all Imports.", function() {

        stats.ParseLessForImports(fileName1, ls1);
        stats.ParseLessForImports(fileName1, ls2);

        verifyImportsForFile(fileName1, [ import1, import2 ]);

        stats.ClearStatsForFile(fileName1);

        verifyImportsForFile(fileName1, [ ]);
    });

    it("Duplicate Imports are not added.", function () {

        stats.ParseLessForImports(fileName1, ls1);

        verifyImportsForFile(fileName1, [ import1 ]);

        stats.ParseLessForImports(fileName1, ls1);

        verifyImportsForFile(fileName1, [ import1 ]);

        stats.ParseLessForImports(fileName1, ls1);

        verifyImportsForFile(fileName1, [ import1 ]);
    });

    it("Imports added are isolated to their collection.", function() {

        stats.ParseLessForImports(fileName1, ls1);
        stats.ParseLessForImports(fileName2, ls2);
        stats.ParseLessForImports(fileName3, lessDoubleQuote);

        verifyImportsForFile(fileName1, [ import1 ]);
        verifyImportsForFile(fileName2, [ import2 ]);
        verifyImportsForFile(fileName3, [ import3 ]);
    });

 });
});