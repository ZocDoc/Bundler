var compileES6 = require('../../../src/compile/compile-es6');
var _ = require('underscore');
var path = require('path');

describe('compile ES6', function() {

    var sourceMap,
        inputPath;

    beforeEach(function() {

        sourceMap = false;
        inputPath = 'C:\\foo\\bar.es6';

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

    it('Given ES6 code with function shorthand, compiles to ES5.', function(done) {

        compile('var x = { foo() { return 1; } };')
            .then(assertResultIs(
                '"use strict";\n' +
                '\n' +
                'var x = {\n' +
                '  foo: function foo() {\n' +
                '    return 1;\n' +
                '  }\n' +
                '};',
                done
            ))
            .catch(throwError);

    });

    it('Given ES6 code with a class, compiles to ES5.', function(done) {

        compile(
            'class Foo {\n' +
            '    constructor() {\n' +
            '        this.x = 2;\n' +
            '    }\n' +
            '    render() {\n' +
            '        return this.x;\n' +
            '    }\n' +
            '}'
        )
            .then(assertResultIs(
                '"use strict";\n' +
                '\n' +
                'function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }\n' +
                '\n' +
                'var Foo = function () {\n' +
                '    function Foo() {\n' +
                '        _classCallCheck(this, Foo);\n' +
                '\n' +
                '        this.x = 2;\n' +
                '    }\n' +
                '\n' +
                '    Foo.prototype.render = function render() {\n' +
                '        return this.x;\n' +
                '    };\n' +
                '\n' +
                '    return Foo;\n' +
                '}();',
                done
            ))
            .catch(throwError);

    });

    it('Given ES6 code with class extension, compiles to ES5.', function(done) {

        compile(
            'class Foo extends Bar {\n' +
            '    constructor() {\n' +
            '        super();\n' +
            '        this.x = 2;\n' +
            '    }\n' +
            '    render() {\n' +
            '        return this.x;\n' +
            '    }\n' +
            '}'
        )
            .then(assertResultIs(
                '"use strict";\n' +
                '\n' +
                'function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }\n' +
                '\n' +
                'function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }\n' +
                '\n' +
                'function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn\'t been initialised - super() hasn\'t been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }\n' +
                '\n' +
                'function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }\n' +
                '\n' +
                'var Foo = function (_Bar) {\n' +
                '    _inherits(Foo, _Bar);\n' +
                '\n' +
                '    function Foo() {\n' +
                '        _classCallCheck(this, Foo);\n' +
                '\n' +
                '        var _this = _possibleConstructorReturn(this, _Bar.call(this));\n' +
                '\n' +
                '        _this.x = 2;\n' +
                '        return _this;\n' +
                '    }\n' +
                '\n' +
                '    Foo.prototype.render = function render() {\n' +
                '        return this.x;\n' +
                '    };\n' +
                '\n' +
                '    return Foo;\n' +
                '}(Bar);',
                done
            ))
            .catch(throwError);

    });

    it('Given ES6 code with async/await, compiles to ES5.', function(done) {

        compile(
                'async function foo() {\n' +
                '    return await new Promise(function(resolve, reject) {\n' +
                '        resolve(1);\n' +
                '    });\n' +
                '}'
            )
            .then(assertResultIs(
                '"use strict";\n' +
                '\n' +
                'function foo() {\n' +
                '    return regeneratorRuntime.async(function foo$(_context) {\n' +
                '        while (1) {\n' +
                '            switch (_context.prev = _context.next) {\n' +
                '                case 0:\n' +
                '                    _context.next = 2;\n' +
                '                    return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {\n' +
                '                        resolve(1);\n' +
                '                    }));\n' +
                '\n' +
                '                case 2:\n' +
                '                    return _context.abrupt("return", _context.sent);\n' +
                '\n' +
                '                case 3:\n' +
                '                case "end":\n' +
                '                    return _context.stop();\n' +
                '            }\n' +
                '        }\n' +
                '    }, null, this);\n' +
                '}',
                done
            ))
            .catch(throwError);

    });

    it('Given JSX code, compiles to ES5.', function(done) {

        compile(
            'var file1 = React.createClass({\n' +
            '    render() {\n' +
            '        return <div>file1 {this.props.name}</div>;\n' +
            '    }\n' +
            '});'
        )
            .then(assertResultIs(
                '"use strict";\n' +
                '\n' +
                'var file1 = React.createClass({\n' +
                '    displayName: "file1",\n' +
                '    render: function render() {\n' +
                '        return React.createElement(\n' +
                '            "div",\n' +
                '            null,\n' +
                '            "file1 ",\n' +
                '            this.props.name\n' +
                '        );\n' +
                '    }\n' +
                '});',
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

    it('Given invalid ES6 code, throws error.', function(done) {

        compile('let x =')
            .then(assertResultWasNotReturned)
            .catch(assertErrorIsThrown(done));

    });

    var compile = function(code) {

        return compileES6({
            code: code,
            sourceMap: sourceMap,
            inputPath: inputPath
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

    var assertResultWasNotReturned = function() {

        throw 'Compile should not have succeeded!';

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