var minifyCSS = require('../../../src/minify/minify-css');
var _ = require('underscore');
var path = require('path');

describe('minify CSS', function() {

    var sourceMap,
        inputPath;

    beforeEach(function() {

        sourceMap = false;
        inputPath = 'C:\\foo\\bar.css';

    });

    it('Given code, returns minified code.', function(done) {

        minify(
                '.foo {\n' +
                '   background: red;\n' +
                '}'
            )
            .then(assertResultIs(
                '.foo{background:red}',
                done
            ))
            .catch(throwError);

    });

    it('Given code with no source map and source maps enabled, returns minified code with source map.', function(done) {

        givenSourceMapsEnabled();

        minify(
                '.foo {\n' +
                '   background: red;\n' +
                '}'
            )
            .then(assertResultIs(
                {
                    code:
                        '.foo{background:red}',
                    map: {
                        version: 3,
                        sources: [ 'C:/foo/bar.css' ],
                        names: [  ],
                        mappings: 'AAAA,KACG,WAAY'
                    }
                },
                done
            ))
            .catch(throwError);

    });

    it('Given code with source map and source maps enabled, returns minified code with combined source map.', function(done) {

        givenSourceMapsEnabled();

        minify(
                '.less1 {\n' +
                '  color: red;\n' +
                '}',
                {
                    version: 3,
                    sources: ['/foo/bar.less'],
                    names: [],
                    mappings: 'AACA;EAAS,UAAA'
                }
            )
            .then(assertResultIs(
                {
                    code:
                        '.less1{color:red}',
                    map: {
                        version: 3,
                        sources: [ '../../bar.less' ],
                        names: [  ],
                        mappings: 'AACA,OAAS,MAAA'
                    }
                },
                done
            ))
            .catch(throwError);

    });

    it('Given invalid code, throws error.', function(done) {

        minify('.foo {')
            .then(assertResultWasNotReturned)
            .catch(assertErrorIsThrown(done));

    });

    var minify = function(code, map) {

        return minifyCSS({
            code: code,
            map: map,
            sourceMap: sourceMap,
            inputPath: inputPath,
            siteRoot: 'C:\\'
        });

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