var parseDeps = require('../../../../src/concat/requireify/parse-dependencies');

describe('parse dependencies', function() {

    var files,
        result;

    beforeEach(function() {

        files = [];

    });
    
    it('Given files with no require statements, no dependencies are parsed', function() {
    
        givenFile({
            path: 'C:\\foo\\file1.js',
            code: 'var x = 1;'
        });
        givenFile({
            path: 'C:\\bar\\file2.js',
            code: 'module.exports = function(x) { return x * 2; };'
        });

        parseDependencies();

        assertFileDependencies('C:\\foo\\file1.js', {});
        assertFileDependencies('C:\\bar\\file2.js', {});
    
    });

    it('Given file with require statement to js file in same directory, dependency is parsed.', function() {

        givenFile({
            path: 'C:\\foo\\file1.js',
            code: 'module.exports = 1;'
        });
        givenFile({
            path: 'C:\\foo\\file2.js',
            code: 'var f = require(\'./file1.js\');'
        });

        parseDependencies();

        assertFileDependencies('C:\\foo\\file1.js', {});
        assertFileDependencies('C:\\foo\\file2.js', {
            './file1.js': {
                dep: 'C:\\foo\\file1.js',
                isPath: true
            }
        });

    });

    it('Given file with extension-less require statement pointing to js file in same directory, dependency is parsed.', function() {

        givenFile({
            path: 'C:\\foo\\file1.js',
            code: 'module.exports = 1;'
        });
        givenFile({
            path: 'C:\\foo\\file2.js',
            code: 'var f = require(\'./file1\');'
        });

        parseDependencies();

        assertFileDependencies('C:\\foo\\file1.js', {});
        assertFileDependencies('C:\\foo\\file2.js', {
            './file1': {
                dep: 'C:\\foo\\file1.js',
                isPath: true
            }
        });

    });

    it('Given file with extension-less require statement pointing to es6 file in same directory, dependency is parsed.', function() {

        givenFile({
            path: 'C:\\foo\\file1.es6',
            code: 'module.exports = 1;'
        });
        givenFile({
            path: 'C:\\foo\\file2.js',
            code: 'var f = require(\'./file1\');'
        });

        parseDependencies();

        assertFileDependencies('C:\\foo\\file1.es6', {});
        assertFileDependencies('C:\\foo\\file2.js', {
            './file1': {
                dep: 'C:\\foo\\file1.es6',
                isPath: true
            }
        });

    });

    it('Given file with extension-less require statement pointing to subdirectory with js index file, dependency is parsed.', function() {

        givenFile({
            path: 'C:\\foo\\bar\\index.js',
            code: 'module.exports = 1;'
        });
        givenFile({
            path: 'C:\\foo\\file2.js',
            code: 'var f = require(\'./bar\');'
        });

        parseDependencies();

        assertFileDependencies('C:\\foo\\bar\\index.js', {});
        assertFileDependencies('C:\\foo\\file2.js', {
            './bar': {
                dep: 'C:\\foo\\bar\\index.js',
                isPath: true
            }
        });

    });

    it('Given file with extension-less require statement pointing to subdirectory with es6 index file, dependency is parsed.', function() {

        givenFile({
            path: 'C:\\foo\\bar\\index.es6',
            code: 'module.exports = 1;'
        });
        givenFile({
            path: 'C:\\foo\\file2.js',
            code: 'var f = require(\'./bar\');'
        });

        parseDependencies();

        assertFileDependencies('C:\\foo\\bar\\index.es6', {});
        assertFileDependencies('C:\\foo\\file2.js', {
            './bar': {
                dep: 'C:\\foo\\bar\\index.es6',
                isPath: true
            }
        });

    });

    it('Given file with require statement to js file in different directory, dependency is parsed.', function() {

        givenFile({
            path: 'C:\\bar\\file1.js',
            code: 'module.exports = 1;'
        });
        givenFile({
            path: 'C:\\foo\\file2.js',
            code: 'var f = require(\'../bar/file1.js\');'
        });

        parseDependencies();

        assertFileDependencies('C:\\bar\\file1.js', {});
        assertFileDependencies('C:\\foo\\file2.js', {
            '../bar/file1.js': {
                dep: 'C:\\bar\\file1.js',
                isPath: true
            }
        });

    });

    it('Given file with require statement to es6 file in different directory, dependency is parsed.', function() {

        givenFile({
            path: 'C:\\bar\\file1.es6',
            code: 'module.exports = 1;'
        });
        givenFile({
            path: 'C:\\foo\\file2.js',
            code: 'var f = require(\'../bar/file1.es6\');'
        });

        parseDependencies();

        assertFileDependencies('C:\\bar\\file1.es6', {});
        assertFileDependencies('C:\\foo\\file2.js', {
            '../bar/file1.es6': {
                dep: 'C:\\bar\\file1.es6',
                isPath: true
            }
        });

    });

    it('Given file with extension-less require statement pointing to js file in different directory, dependency is parsed.', function() {

        givenFile({
            path: 'C:\\bar\\file1.js',
            code: 'module.exports = 1;'
        });
        givenFile({
            path: 'C:\\foo\\file2.js',
            code: 'var f = require(\'../bar/file1\');'
        });

        parseDependencies();

        assertFileDependencies('C:\\bar\\file1.js', {});
        assertFileDependencies('C:\\foo\\file2.js', {
            '../bar/file1': {
                dep: 'C:\\bar\\file1.js',
                isPath: true
            }
        });

    });

    it('Given file with extension-less require statement pointing to es6 file in different directory, dependency is parsed.', function() {

        givenFile({
            path: 'C:\\bar\\file1.es6',
            code: 'module.exports = 1;'
        });
        givenFile({
            path: 'C:\\foo\\file2.js',
            code: 'var f = require(\'../bar/file1\');'
        });

        parseDependencies();

        assertFileDependencies('C:\\bar\\file1.es6', {});
        assertFileDependencies('C:\\foo\\file2.js', {
            '../bar/file1': {
                dep: 'C:\\bar\\file1.es6',
                isPath: true
            }
        });

    });

    it('Given file with extension-less require statement pointing to different directory with js index file, dependency is parsed.', function() {

        givenFile({
            path: 'C:\\bar\\index.js',
            code: 'module.exports = 1;'
        });
        givenFile({
            path: 'C:\\foo\\file2.js',
            code: 'var f = require(\'../bar\');'
        });

        parseDependencies();

        assertFileDependencies('C:\\bar\\index.js', {});
        assertFileDependencies('C:\\foo\\file2.js', {
            '../bar': {
                dep: 'C:\\bar\\index.js',
                isPath: true
            }
        });

    });

    it('Given file with extension-less require statement pointing to different directory with es6 index file, dependency is parsed.', function() {

        givenFile({
            path: 'C:\\bar\\index.es6',
            code: 'module.exports = 1;'
        });
        givenFile({
            path: 'C:\\foo\\file2.js',
            code: 'var f = require(\'../bar\');'
        });

        parseDependencies();

        assertFileDependencies('C:\\bar\\index.es6', {});
        assertFileDependencies('C:\\foo\\file2.js', {
            '../bar': {
                dep: 'C:\\bar\\index.es6',
                isPath: true
            }
        });

    });

    it('Given file with non-relative require statement, dependency is parsed unchanged.', function() {

        givenFile({
            path: 'C:\\bar\\index.js',
            code: 'require(\'foo\');'
        });

        parseDependencies();

        assertFileDependencies('C:\\bar\\index.js', {
            'foo': {
                dep: 'foo',
                isPath: false
            }
        });

    });

    it('Given file with relative require statement to file not in bundle, throws error.', function() {

        givenFile({
            path: 'C:\\bar\\index.js',
            code: 'require(\'./foo.js\');'
        });

        expect(parseDependencies).toThrow();

    });

    var parseDependencies = function() {

        result = parseDeps(files);

    };

    var givenFile = function(file) {

        files.push(file);

    };

    var assertFileDependencies = function(file, expected) {

        expect(result[file]).toEqual(expected);

    };

});