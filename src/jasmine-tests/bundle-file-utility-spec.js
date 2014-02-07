var exec = require('child_process').exec,
    fs = require('fs'),
    bundleFileUtility = require('../bundle-file-utility.js').BundleFileUtility;

describe("BundleFileUtility - ", function() {

    var filePath, _options, bundleName;

    beforeEach(function () {
        filePath = '/folder1/file1.js';
        bundleName = "bundle.js";
        _options = {};
    });

    describe("getOutputFilePath: ", function() {

        var _outputFilePath,
            getOutputFilePath,
            givenOutputDirectory,
            givenFilePath,
            givenNoOutputDirectory,
            verifyOutputFilePath;

        it("Given no output directory, then the filepath is unchanged", function() {

            givenNoOutputDirectory();

            getOutputFilePath();

            verifyOutputFilePath(filePath);
        });

        it("Given an output directory, the file is put in that path.", function() {

            givenFilePath('/folder1/file1.js');
            givenOutputDirectory('output-directory');

            getOutputFilePath();

            verifyOutputFilePath('output-directory/file1.js');
        });

        it("The slash used in the file path is not affected.", function() {

            givenFilePath('\\folder1\\folder2\\file1.js');
            givenOutputDirectory('output-directory');

            getOutputFilePath();

            verifyOutputFilePath('output-directory\\file1.js');
        });

        givenOutputDirectory = function(directory) {
            _options['outputdirectory'] = directory;
        };

        givenFilePath = function(path) {
            filePath = path;
        }

        givenNoOutputDirectory = function() { };

        getOutputFilePath = function() {
            _outputFilePath = bundleFileUtility.getOutputFilePath(bundleName, filePath, _options);
        };

        verifyOutputFilePath = function(expected) {
            expect(_outputFilePath).toBe(expected);
        }
    });

    describe("getMinFileName: ", function() {

        var _path,
            _minPath,
            getMinFileName,
            givenFilePath,
            verifyMinFileName;

        it("Swaps out the extension with min.extension ", function() {

            givenFilePath('/folder1/file1.js');

            getMinFileName();

            verifyMinFileName('/folder1/file1.min.js');
        });

        it("Handles file paths with multiple periods ", function() {

            givenFilePath('/fol.der1/file1.sauce.css');

            getMinFileName();

            verifyMinFileName('/fol.der1/file1.sauce.min.css');
        });

        getMinFileName = function() {
            _minPath = bundleFileUtility.getMinFileName(_path);
        };

        givenFilePath = function(path) {
            _path = path;
        };

        verifyMinFileName = function(expected) {
            expect(_minPath).toBe(expected);
        };

    });
});