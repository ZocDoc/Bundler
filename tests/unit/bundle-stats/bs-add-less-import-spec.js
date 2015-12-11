var fileNameStats = require('../../../src/bundle-stats.js'),
    collection = require('../../../src/collection');

describe("fileNameStatsCollector - ", function() {

    var verifyImportsForFile,
        fileName1 = 'c:\\src\\styles\\area1\\less1.less',
        fullPathImport = 'c:\\src\\styles\\imports\\fullPathImport.less',
        fullPathImport2 = 'c:\\src\\styles\\imports\\fullPathImport2.less',
        fullPathImport3 = 'c:\\src\\styles\\imports\\fullPathImport3.less',
        fileName2 = 'c:\\src\\styles\\area1\\less2.less',
        relativeImport = '..\\imports\\relativeImport.less',
        fullPathOfRelativeImport = 'c:\\src\\styles\\imports\\relativeImport.less',
        fileName3 = 'c:\\src\\styles\\area2\\less3.less',
        importRelativeToImports = './importRelative.less',
        fullPathOfImportRelativeToImports = 'c:\\src\\styles\\imports\\importRelative.less',
        stats,
        fileSystem,
        fileSystemProxy;

  beforeEach(function () {

      fileSystemProxy = {};
      fileSystem = {
          readFileSync: function (path) {
              return fileSystemProxy[path] || '';
          }
      };

      stats = new fileNameStats.BundleStatsCollector(fileSystem);
      stats.LessImports = collection.createLessImports();
      verifyImportsForFile = function(file, imports)
      {
          expect(stats.LessImports.get(file).length).toBe(imports.length);

          for (var i = 0; i < imports.length; i++) {
              expect(stats.LessImports.get(file)[i]).toBe(imports[i]);
          }
      };
  });

 describe("ParseLessForImports: ", function() {

  var getLessImport = function(i) {
      return "@import url('" + i+ '")\n style1 { color1: @importedColor; }';
      },
      fullPathImportLessFile = getLessImport(fullPathImport),
      relativeLessImport = getLessImport(relativeImport),
      lessDoubleQuote = '@import url("' + fullPathImport + '")';

  it("Adds imports to the collection.", function() {

      searchForImports(fileName1, fullPathImportLessFile);

      verifyImportsForFile(fileName1, [ fullPathImport ]);
  });

    it("Less with multiple imports adds them all.", function() {

        searchForImports(fileName1, fullPathImportLessFile + relativeLessImport);
        verifyImportsForFile(fileName1, [fullPathImport, fullPathOfRelativeImport]);
    });

    it("Checks for imports multiple levels deep.", function () {

        givenImportedFileHasImport(fullPathImport, fullPathImport2);
        givenImportedFileHasImport(fullPathImport2, fullPathImport3);
        givenImportedFileHasImport(fullPathOfRelativeImport, fullPathImport2);

        searchForImports(fileName1, fullPathImportLessFile + relativeLessImport);

        verifyImportsForFile(fileName1, [fullPathImport, fullPathOfRelativeImport, fullPathImport2, fullPathImport3]);
    });
     
    it("Nested file resolves are relative to the nested import.", function () {

        givenImportedFileHasImport(fullPathImport, importRelativeToImports);

        searchForImports(fileName1, fullPathImportLessFile);

        verifyImportsForFile(fileName1, [fullPathImport, fullPathOfImportRelativeToImports]);
    });
    
    it("Imports with infinite nesting throw",  function () {

        givenImportedFileHasImport(fullPathImport, fullPathImport);

        expect(function () {
            searchForImports(fileName1, fullPathImportLessFile);
        }).toThrow();
    });

    it("Double quotes are can be used in the import url", function () {

        searchForImports(fileName1, lessDoubleQuote);
        verifyImportsForFile(fileName1, [fullPathImport]);
    });

    it("A file with no imports returns an empty array", function () {

        searchForImports(fileName1, '.thisHasNoImports { color: red; }\n');
        expect(stats.GetImportsForFile(fileName1).length).toBe(0);
    });

    it("Duplicate Imports are not added.", function () {

        searchForImports(fileName1, fullPathImportLessFile);

        verifyImportsForFile(fileName1, [ fullPathImport ]);

        searchForImports(fileName1, fullPathImportLessFile);

        verifyImportsForFile(fileName1, [ fullPathImport ]);

        searchForImports(fileName1, fullPathImportLessFile);

        verifyImportsForFile(fileName1, [ fullPathImport ]);
    });

    it("Imports added are isolated to their collection.", function() {

        searchForImports(fileName1, fullPathImportLessFile);
        searchForImports(fileName2, relativeLessImport);
        searchForImports(fileName3, fullPathImportLessFile);

        verifyImportsForFile(fileName1, [ fullPathImport ]);
        verifyImportsForFile(fileName2, [ fullPathOfRelativeImport]);
        verifyImportsForFile(fileName3, [ fullPathImport ]);
    });

    var searchForImports = function (file, text) {
        stats.SearchForLessImports(file, text);
    };

    var givenImportedFileHasImport = function (file, importedFile) {
        fileSystemProxy[file] = getLessImport(importedFile);
    };

 });
});