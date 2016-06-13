var FileType = require('../../../src/file').type;
var webpack = require('../../../src/webpack');

describe('webpack', function() {

    var files,
        fileType;

    it('throws when file type is JS and any non-JS files are in the bundle.', function() {

        givenFileTypeIs(FileType.JS);
        givenFiles(
            'file1.js',
            'file1.min.js',
            'file2.es6'
        );

        expect(validate).toThrow();

    });

    it('throws when file type is CSS and any non-CSS files are in the bundle.', function() {

        givenFileTypeIs(FileType.CSS);
        givenFiles(
            'file1.css',
            'file1.min.css',
            'file2.less'
        );

        expect(validate).toThrow();

    });

    it('throws when file type is JS and any unminified JS files do not have corresponding minified JS file in the bundle.', function() {

        givenFileTypeIs(FileType.JS);
        givenFiles(
            'file1.js',
            'file2.js',
            'file2.min.js'
        );

        expect(validate).toThrow();

    });

    it('throws when file type is CSS and any unminified CSS files do not have corresponding minified CSS file in the bundle.', function() {

        givenFileTypeIs(FileType.CSS);
        givenFiles(
            'file1.css',
            'file2.css',
            'file2.min.css'
        );

        expect(validate).toThrow();

    });

    it('throws when file type is JS and any minified JS files do not have corresponding unminified JS file in the bundle.', function() {

        givenFileTypeIs(FileType.JS);
        givenFiles(
            'file1.js',
            'file1.min.js',
            'file2.min.js'
        );

        expect(validate).toThrow();

    });

    it('throws when file type is CSS and any minified CSS files do not have corresponding unminified CSS file in the bundle.', function() {

        givenFileTypeIs(FileType.CSS);
        givenFiles(
            'file1.css',
            'file1.min.css',
            'file2.min.css'
        );

        expect(validate).toThrow();

    });

    it('does not throw when file type is JS and only pairs of unminified and minified JS files are in the bundle.', function() {

        givenFileTypeIs(FileType.JS);
        givenFiles(
            'file1.js',
            'file1.min.js',
            'file2.js',
            'file2.min.js'
        );

        expect(validate).not.toThrow();

    });

    it('does not throw when file type is CSS and only pairs of unminified and minified CSS files are in the bundle.', function() {

        givenFileTypeIs(FileType.CSS);
        givenFiles(
            'file1.css',
            'file1.min.css',
            'file2.css',
            'file2.min.css'
        );

        expect(validate).not.toThrow();

    });

    function validate() {
        webpack.validate({
            files: files,
            fileType: fileType
        });
    }

    function givenFiles() {
        files = Array.prototype.slice.call(arguments);
    }

    function givenFileTypeIs(type) {
        fileType = type;
    }

});
