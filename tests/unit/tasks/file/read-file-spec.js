var rewire = require('rewire');
var read = rewire('../../../../src/tasks/file/read-file');

describe('read file', function() {

    var text,
        extractedCode;

    beforeEach(function() {

        spyOnReadTextFile();
        spyOnSourceMapExtract();

    });

    var spyOnReadTextFile = function() {

        read.__set__('readTextFile', function(filePath, cb) {
            cb(text);
        });

    };

    var spyOnSourceMapExtract = function() {

        read.__set__('sourceMap', {
            extract: function(text) {
                return extractedCode;
            }
        });

    };
    
    it('Returns code from file with source map extracted.', function(done) {

        givenFileContentsIs('var x = 1;\n//# sourceMappingURL=data:application/json;base64,3459g490e5g');

        givenExtractedCodeIs({
            code: 'var x = 1;',
            sourceMap: {
                version: 3,
                sources: ['foo.js']
            }
        });

        readFile('C:\\foo.js')
            .then(function(result) {

                expect(result).toEqual({
                    code: 'var x = 1;',
                    sourceMap: {
                        version: 3,
                        sources: ['foo.js']
                    }
                });

                done();

            })
            .catch(function(err) {

                throw err;

            });
    
    });

    var readFile = function(filePath) {

        return read(filePath);

    };

    var givenFileContentsIs = function(contents) {

        text = contents;

    };

    var givenExtractedCodeIs = function(code) {

        extractedCode = code;

    };

});