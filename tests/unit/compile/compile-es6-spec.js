var compileES6 = require('../../../src/compile/compile-es6');
var _ = require('underscore');
var path = require('path');

describe('compile ES6', function() {

    var sourceMap,
        inputPath;

    beforeEach(function() {

        sourceMap = false;
        inputPath = 'C:\\foo\\bar.js';

    });

    it('Given ES6 code with arrow function, compiles to ES5.', function(done) {

        compile('[1, 2].map(num => num * 2);')
            .then(assertResultIs(
                '"use strict";\n' +
                '\n' +
                '[1, 2].map(function (num) {\n' +
                '  return num * 2;\n' +
                '});',
                done
            ))
            .catch(throwError);

    });

    it('Given ES6 code with template string, compiles to ES5.', function(done) {

        compile('var name = "Bob"; var result = `Hello ${name}`;')
            .then(assertResultIs(
                '"use strict";\n' +
                '\n' +
                'var name = "Bob";var result = "Hello " + name;',
                done
            ))
            .catch(throwError);

    });

    it('Given ES6 code with multi-line template string, compiles to ES5.', function(done) {

        compile('var x = `this is a multi-\nline string`;')
            .then(assertResultIs(
                '"use strict";\n' +
                '\n' +
                'var x = "this is a multi-\\nline string";',
                done
            ))
            .catch(throwError);

    });

    it('Given ES6 code with destructured variable assignment with an array, compiles to ES5.', function(done) {

        compile('var [a, b] = [1,2];')
            .then(assertResultIs(
                '"use strict";\n' +
                '\n' +
                'var a = 1;\n' +
                'var b = 2;',
                done
            ))
            .catch(throwError);

    });

    it('Given ES6 code with destructured variable assignment with default values, compiles to ES5.', function(done) {

        compile('var [a = 1] = [];')
            .then(assertResultIs(
                '"use strict";\n' +
                '\n' +
                'var _ref = [];\n' +
                'var _ref$ = _ref[0];\n' +
                'var a = _ref$ === undefined ? 1 : _ref$;',
                done
            ))
            .catch(throwError);

    });

    it('Given ES6 code with destructured variable assignment skipping array elements, compiles to ES5.', function(done) {

        compile('var [a, , b] = [1,2,3];')
            .then(assertResultIs(
                '"use strict";\n' +
                '\n' +
                'var _ref = [1, 2, 3];\n' +
                'var a = _ref[0];\n' +
                'var b = _ref[2];',
                done
            ))
            .catch(throwError);

    });

    it('Given ES6 code with destructured variable assignment with an object, compiles to ES5.', function(done) {

        compile('var {a, b} = {a:1, b:2};')
            .then(assertResultIs(
                '"use strict";\n' +
                '\n' +
                'var _a$b = { a: 1, b: 2 };\n' +
                'var a = _a$b.a;\n' +
                'var b = _a$b.b;',
                done
            ))
            .catch(throwError);

    });

    it('Given ES6 code with default function parameters, compiles to ES5.', function(done) {

        compile('function f(x = 1) { return x; }')
            .then(assertResultIs(
                '"use strict";\n' +
                '\n' +
                'function f() {\n' +
                '  var x = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];\n' +
                '  return x;\n' +
                '}',
                done
            ))
            .catch(throwError);

    });

    it('Given ES6 code with rest parameter, compiles to ES5.', function(done) {

        compile('function f(x, ...y) { return x + y.length; }')
            .then(assertResultIs(
                '"use strict";\n' +
                '\n' +
                'function f(x) {\n' +
                '  return x + (arguments.length - 1);\n' +
                '}',
                done
            ))
            .catch(throwError);

    });

    it('Given ES6 code with let variables, compiles to ES5.', function(done) {

        compile('let x = 5;')
            .then(assertResultIs(
                '"use strict";\n' +
                '\n' +
                'var x = 5;',
                done
            ))
            .catch(throwError);

    });

    it('Given ES6 code with const variables, compiles to ES5.', function(done) {

        compile('const x = 5;')
            .then(assertResultIs(
                '"use strict";\n' +
                '\n' +
                'var x = 5;',
                done
            ))
            .catch(throwError);

    });

    it('Given ES6 code with source maps enabled, compiles to ES5 with source map.', function(done) {

        givenInputFileIs('C:\\foo\\bar.es6');
        givenSourceMapsEnabled();

        compile('const x = 5;')
            .then(assertResultIs({
                    code:
                        '"use strict";\n' +
                        '\n' +
                        'var x = 5;',
                    map: {
                        version: 3,
                        sources: ['C:\\foo\\bar.es6'],
                        names: [],
                        mappings: ';;AAAA,IAAM,CAAC,GAAG,CAAC,CAAC',
                        file: 'unknown',
                        sourcesContent: ['const x = 5;']
                    }
                },
                done
            ))
            .catch(throwError);

    });

    var compile = function(code) {

        return compileES6({
            code: code,
            sourceMap: sourceMap,
            inputPath: inputPath,
            nodeModulesPath: path.join(__dirname, '..', '..', '..', 'src', 'node_modules')
        });

    };

    var givenInputFileIs = function(filePath) {

        inputPath = filePath;

    };

    var givenSourceMapsEnabled = function() {

        sourceMap = true;

    };

    var assertResultIs = function(expected, done) {

        return function(result) {

            if (_.isString(expected)) {
                expect(result.code).toEqual(expected);
                expect(result.map).toBeNull();
            } else {
                expect(result).toEqual(expected);
            }

            done();

        };

    };

    var throwError = function(err) {

        throw err;

    };

});