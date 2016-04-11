var minifyJS = require('../../../src/minify/minify-js');
var _ = require('underscore');
var path = require('path');

describe('minify JS', function() {

    var sourceMap,
        inputPath;

    beforeEach(function() {

        sourceMap = false;
        inputPath = 'C:\\foo\\bar.js';

    });

    it('Given file is already minified, returns original code.', function(done) {

        givenFilePathIs('C:\\foo\\bar.min.js')

        minify(
                'function foo(x) {\n' +
                '   return x * 2;\n' +
                '}'
            )
            .then(assertResultIs(
                'function foo(x) {\n' +
                '   return x * 2;\n' +
                '}',
                done
            ))
            .catch(throwError);

    });

    it('Given code, returns minified code.', function(done) {

        minify(
                'function foo(x) {\n' +
                '   return x * 2;\n' +
                '}'
            )
            .then(assertResultIs(
                'function foo(n){return 2*n}',
                done
            ))
            .catch(throwError);

    });

    it('Given code with no source map and source maps enabled, returns minified code with source map.', function(done) {

        givenSourceMapsEnabled();

        minify(
                'function foo(x) {\n' +
                '   return x * 2;\n' +
                '}'
            )
            .then(assertResultIs(
                {
                    code:
                        'function foo(n){return 2*n}',
                    map: {
                        version: 3,
                        sources: [ 'C:\\foo\\bar.js' ],
                        names: [ 'foo', 'x' ],
                        mappings: 'AAAA,QAASA,KAAIC,GACV,MAAW,GAAJA'
                    }
                },
                done
            ))
            .catch(throwError);

    });

    it('Given code with source map and source maps enabled, returns minified code with combined source map.', function(done) {

        givenSourceMapsEnabled();

        minify(
                '"use strict";\n' +
                '\n' +
                'var x = 5;',
                {
                    version: 3,
                    sources: ['C:\\foo\\bar.es6'],
                    names: [],
                    mappings: ';;AAAA,IAAM,CAAC,GAAG,CAAC,CAAC',
                    file: 'unknown',
                    sourcesContent: ['const x = 5;']
                }
            )
            .then(assertResultIs(
                {
                    code:
                        '"use strict";var x=5;',
                    map: {
                        version: 3,
                        sources: [ 'C:\\foo\\bar.es6' ],
                        names: [ 'x' ],
                        mappings: 'YAAA,IAAMA,GAAI;;AAAV,IAAM,CAAC,GAAG,CAAC,CAAC',
                        file: 'unknown',
                        sourcesContent: [ 'const x = 5;' ]
                    }
                },
                done
            ))
            .catch(throwError);

    });

    it('Given invalid code, throws error.', function(done) {

        minify('var x =')
            .then(assertResultWasNotReturned)
            .catch(assertErrorIsThrown(done));

    });

    var minify = function(code, map) {

        return minifyJS({
            code: code,
            map: map,
            sourceMap: sourceMap,
            inputPath: inputPath
        });

    };

    var givenFilePathIs = function(filePath) {

        inputPath = filePath;

    };

    var givenSourceMapsEnabled = function() {

        sourceMap = true;

    };

    var assertResultIs = function(expected, done) {

        return function(result) {

            if (_.isString(expected)) {
                expect(result.code).toEqual(expected);
                expect(result.map).toBeUndefined();
            } else {
                expect(result).toEqual(expected);
            }

            done();

        };

    };

    var assertResultWasNotReturned = function() {

        throw 'Minify should not have succeeded!';

    };

    var assertErrorIsThrown = function(done) {

        return function(err) {

            expect(err).not.toBeUndefined();

            done();

        };

    };

    var throwError = function(err) {

        throw err;

    };

});
