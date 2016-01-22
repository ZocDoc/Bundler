var rewire = require('rewire');
var write = rewire('../../../../src/tasks/file/write-file');
var fileType = require('../../../../src/tasks/file').type;

describe('write file', function() {

    var sourceMapComment,
        writtenText,
        cleanedMap,
        writeFileError;

    beforeEach(function() {

        spyOnWriteFile();
        spyOnSourceMap();

    });

    var spyOnWriteFile = function() {

        writeFileError = undefined;
        writtenText = undefined;

        write.__set__('fs', {
            writeFile: function(filePath, text, encoding, cb) {
                writtenText = text;
                cb(writeFileError);
            }
        })

    };

    var spyOnSourceMap = function() {

        cleanedMap = undefined;
        sourceMapComment = undefined;

        write.__set__('sourceMap', {
            clean: function(map) {
                return cleanedMap || map;
            },
            getComment: function() {
                return sourceMapComment;
            }
        });

    };
    
    it('Given code with no source map fails to write to file, error is returned.', function(done) {

        givenWritingCodeToFileFailsWithError('error!!!!');

        writeFile('var x = 1;')
            .then(function() {

                throw 'Should not have succeeded!';

            })
            .catch(function(err) {

                expect(err).toEqual('error!!!!');

                done();

            });
    
    });

    it('Given code with no source map, code is written to file.', function(done) {

        writeFile('var x = 1;')
            .then(function() {

                assertTextWasWrittenToFile('var x = 1;');

                done();

            })
            .catch(function(err) {

                throw err;

            });

    });

    it('Given code with no source map, returns code.', function(done) {

        writeFile('var x = 1;')
            .then(function(result) {

                expect(result).toEqual({
                    code: 'var x = 1;',
                    map: undefined
                });

                done();

            })
            .catch(function(err) {

                throw err;

            });

    });

    it('Given code with source map fails to write to file, error is returned.', function(done) {

        givenWritingCodeToFileFailsWithError('error!!!!');

        writeFile('var x = 1;', {
                version: 3,
                sources: ['foo.js']
            })
            .then(function() {

                throw 'Should not have succeeded!';

            })
            .catch(function(err) {

                expect(err).toEqual('error!!!!');

                done();

            });

    });

    it('Given code with source map, code with source map comment is written to file.', function(done) {

        givenSourceMapCommentIs('//# sourceMappingURL=data:application/json;base64,3459g490e5g');

        writeFile('var x = 1;', {
                version: 3,
                sources: ['foo.js']
            })
            .then(function() {

                assertTextWasWrittenToFile('var x = 1;\n//# sourceMappingURL=data:application/json;base64,3459g490e5g');

                done();

            })
            .catch(function(err) {

                throw err;

            });

    });

    it('Given code with source map, returns code and cleaned source map.', function(done) {

        givenCleanedSourceMapIs({
            version: 3,
            sources: ['/foo.js']
        });

        writeFile('var x = 1;', {
                version: 3,
                sources: ['foo.js']
            })
            .then(function(result) {

                expect(result).toEqual({
                    code: 'var x = 1;',
                    map: {
                        version: 3,
                        sources: ['/foo.js']
                    }
                });

                done();

            })
            .catch(function(err) {

                throw err;

            });

    });

    var writeFile = function(code, map) {
        
        return write(code, map, fileType.JS, 'foo-output.js', '');

    };

    var givenCleanedSourceMapIs = function(cleaned) {

        cleanedMap = cleaned;

    };

    var givenSourceMapCommentIs = function(comment) {

        sourceMapComment = comment;

    };

    var givenWritingCodeToFileFailsWithError = function(message) {

        writeFileError = message;

    };

    var assertTextWasWrittenToFile = function(expected) {

        expect(writtenText).toEqual(expected);

    };

});