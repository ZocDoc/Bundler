var index = require('../../../../src/concat/requireify/index-files');

describe('index files', function() {

    var files,
        indexedFiles;

    beforeEach(function() {

        files = {};

    });
    
    it('Given files, assigns indexes.', function() {

        givenFile('C:\\foo\\file1.js');
        givenFile('C:\\foo\\file2.es6');
        givenFile('C:\\foo\\file3.jsx');

        indexFiles();

        assertResultIs({
            'C:\\foo\\file1.js': 1,
            'C:\\foo\\file2.es6': 2,
            'C:\\foo\\file3.jsx': 3
        });
    
    });

    var indexFiles = function() {

        indexedFiles = index(files);

    };

    var givenFile = function(file) {

        files[file] = {};

    };

    var assertResultIs = function(expected) {

        expect(indexedFiles).toEqual(expected);

    };

});