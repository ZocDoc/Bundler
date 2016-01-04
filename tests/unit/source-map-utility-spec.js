var sourceMap = require('../../src/source-map-utility');

describe('SourceMapUtility', function() {

    var siteRoot = 'C:\\src\\zocdoc.web\\zocdoc_web\\ZocDoc.Web';

    describe('getSourceMapRoot', function() {

        var filePath,
            root;

        it('Given file, returns file directory relative to site root.', function() {
        
            givenFilePathIs(siteRoot + '\\foo\\bar\\baz.js');

            getSourceMapRoot();

            assertRootIs('\\foo\\bar');
        
        });
        
        var getSourceMapRoot = function() {
            root = sourceMap.getSourceMapRoot(filePath, siteRoot);
        };

        var givenFilePathIs = function(file) {
            filePath = file;
        };

        var assertRootIs = function(expected) {
            expect(root).toEqual(expected);
        };

    });

    describe('getSourceFilePath', function() {

        var filePath,
            sourceFilePath;

        it('Given file, returns file path relative to site root.', function() {

            givenFilePathIs(siteRoot + '\\foo\\bar\\baz.js');

            getSourceFilePath();

            assertSourceFilePathIs('/foo/bar/baz.js');

        });

        var getSourceFilePath = function() {
            sourceFilePath = sourceMap.getSourceFilePath(filePath, siteRoot);
        };

        var givenFilePathIs = function(file) {
            filePath = file;
        };

        var assertSourceFilePathIs = function(expected) {
            expect(sourceFilePath).toEqual(expected);
        };

    });

});