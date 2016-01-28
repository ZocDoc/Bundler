var concat = require('../../../src/concat');
var FileType = require('../../../src/file').type;

describe('concat files', function() {

    var files,
        fileType,
        concatType,
        code;

    beforeEach(function() {

        files = [];

    });
    
    it('Given JS files, prefixes all lines with semi-colons and adds new lines between files.', function() {

        givenConcatTypeIs(concat.type.Debug);
        givenFileTypeIs(FileType.JS);
        givenFile({
            code: 'var x = 1;'
        });
        givenFile({
            code: 'var y = 2;'
        });

        concatFiles();

        assertConcatenatedCodeIs(
            ';var x = 1;\n' +
            ';var y = 2;\n'
        );
    
    });

    it('Given CSS files, adds new lines between files.', function() {

        givenConcatTypeIs(concat.type.Debug);
        givenFileTypeIs(FileType.CSS);
        givenFile({
            code: '.foo { background: red; }'
        });
        givenFile({
            code: '#bar { font-size: 10px; }'
        });

        concatFiles();

        assertConcatenatedCodeIs(
            '.foo { background: red; }\n' +
            '#bar { font-size: 10px; }\n'
        );

    });

    var concatFiles = function() {

        code = concat.files({
            files: files,
            fileType: fileType
        });

    };

    var givenFile = function(file) {

        files.push(file);

    };

    var givenFileTypeIs = function(type) {

        fileType = type;

    };

    var givenConcatTypeIs = function(type) {

        concatType = type;

    };

    var assertConcatenatedCodeIs = function(expected) {

        expect(code).toEqual(expected);

    };

});