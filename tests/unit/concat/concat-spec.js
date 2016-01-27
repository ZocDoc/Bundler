var concatCode = require('../../../src/concat');
var FileType = require('../../../src/file').type;

describe('concat', function() {

    var files,
        fileType,
        code;

    beforeEach(function() {

        files = [];

    });
    
    it('Given JS files, prefixes all lines with semi-colons and adds new lines between files.', function() {
    
        givenFileTypeIs(FileType.JS);
        givenFile({
            code: 'var x = 1;'
        });
        givenFile({
            code: 'var y = 2;'
        });

        concat();

        assertConcatenatedCodeIs(
            ';var x = 1;\n' +
            ';var y = 2;\n'
        );
    
    });

    it('Given CSS files, adds new lines between files.', function() {

        givenFileTypeIs(FileType.CSS);
        givenFile({
            code: '.foo { background: red; }'
        });
        givenFile({
            code: '#bar { font-size: 10px; }'
        });

        concat();

        assertConcatenatedCodeIs(
            '.foo { background: red; }\n' +
            '#bar { font-size: 10px; }\n'
        );

    });

    var concat = function() {

        code = concatCode(files, fileType);

    };

    var givenFile = function(file) {

        files.push(file);

    };

    var givenFileTypeIs = function(type) {

        fileType = type;

    };

    var assertConcatenatedCodeIs = function(expected) {

        expect(code).toEqual(expected);

    };

});