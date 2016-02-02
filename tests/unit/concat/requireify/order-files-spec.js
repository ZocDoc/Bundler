var orderFiles = require('../../../../src/concat/requireify/order-files');

describe('order files', function() {

    var files,
        deps,
        indexedFiles;

    beforeEach(function() {

        files = {};
        deps = {};

    });
    
    it('Given files with no dependencies, assigns indexes.', function() {

        givenFileWithDependencies('C:\\foo\\file1.js', {});
        givenFileWithDependencies('C:\\foo\\file2.js', {});

        order();

        assertResultIs({
            'C:\\foo\\file1.js': 1,
            'C:\\foo\\file2.js': 2
        });
    
    });

    it('Given file with dependency on another file in bundle, puts dependency first.', function() {

        givenFileWithDependencies('C:\\foo\\file1.js', {
            './file2': {
                name: 'C:\\foo\\file2.js',
                isPath: true
            }
        });
        givenFileWithDependencies('C:\\foo\\file2.js', {});

        order();

        assertResultIs({
            'C:\\foo\\file1.js': 2,
            'C:\\foo\\file2.js': 1
        });

    });

    it('Given multiple files with dependencies on files in bundle, orders correctly.', function() {

        givenFileWithDependencies('C:\\foo\\file1.js', {
            './file3': {
                name: 'C:\\foo\\file3.js',
                isPath: true
            }
        });
        givenFileWithDependencies('C:\\foo\\file2.js', {});
        givenFileWithDependencies('C:\\foo\\file3.js', {
            './file2': {
                name: 'C:\\foo\\file2.js',
                isPath: true
            }
        });

        order();

        assertResultIs({
            'C:\\foo\\file1.js': 3,
            'C:\\foo\\file2.js': 1,
            'C:\\foo\\file3.js': 2
        });

    });

    it('Given file with multiple dependencies on files in bundle, orders correctly.', function() {

        givenFileWithDependencies('C:\\foo\\file1.js', {
            './file2': {
                name: 'C:\\foo\\file2.js',
                isPath: true
            },
            './file3': {
                name: 'C:\\foo\\file3.js',
                isPath: true
            }
        });
        givenFileWithDependencies('C:\\foo\\file2.js', {});
        givenFileWithDependencies('C:\\foo\\file3.js', {});

        order();

        assertResultIs({
            'C:\\foo\\file1.js': 3,
            'C:\\foo\\file2.js': 1,
            'C:\\foo\\file3.js': 2
        });

    });

    var order = function() {

        indexedFiles = orderFiles(files, deps);

    };

    var givenFileWithDependencies = function(file, dep) {

        files[file] = {};
        deps[file] = dep;

    };

    var assertResultIs = function(expected) {

        expect(indexedFiles).toEqual(expected);

    };

});