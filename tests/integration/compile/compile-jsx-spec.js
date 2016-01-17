var compileJSX = require('../../../src/compile/compile-jsx');
var _ = require('underscore');
var path = require('path');

describe('compile JSX', function() {

    var sourceMap,
        inputPath;

    beforeEach(function() {

        sourceMap = false;
        inputPath = 'C:\\foo\\bar.jsx';

    });
    
    it('Given JSX code, compiles to JS.', function(done) {
    
        compile(
                'var file1 = React.createClass({\n' +
                '    render: function() {\n' +
                '        return <div>file1 {this.props.name}</div>;\n' +
                '    }\n' +
                '});'
            )
            .then(assertResultIs(
                'var file1 = React.createClass({\n' +
                '    displayName: "file1",\n' +
                '\n' +
                '    render: function () {\n' +
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

    it('Given JSX code with source maps enabled, compiles to JS with source map.', function(done) {

        givenInputFileIs('C:\\foo\\bar.jsx');
        givenSourceMapsEnabled();

        compile(
                'var file1 = React.createClass({\n' +
                '    render: function() {\n' +
                '        return <div>file1 {this.props.name}</div>;\n' +
                '    }\n' +
                '});'
            )
            .then(assertResultIs({
                    code:
                        'var file1 = React.createClass({\n' +
                        '    displayName: "file1",\n' +
                        '\n' +
                        '    render: function () {\n' +
                        '        return React.createElement(\n' +
                        '            "div",\n' +
                        '            null,\n' +
                        '            "file1 ",\n' +
                        '            this.props.name\n' +
                        '        );\n' +
                        '    }\n' +
                        '});',
                    map: {
                        version: 3,
                        sources: ['C:\\foo\\bar.jsx'],
                        names: [],
                        mappings: 'AAAA,IAAI,KAAK,GAAG,KAAK,CAAC,WAAW,CAAC;;;AAC1B,UAAM,EAAE,YAAW;AACf,eAAO;;;;YAAY,IAAI,CAAC,KAAK,CAAC,IAAI;SAAO,CAAC;KAC7C;CACJ,CAAC,CAAC',
                        file: 'unknown',
                        sourcesContent: [
                            'var file1 = React.createClass({\n' +
                            '    render: function() {\n' +
                            '        return <div>file1 {this.props.name}</div>;\n' +
                            '    }\n' +
                            '});'
                        ]
                    }
                },
                done
            ))
            .catch(throwError);

    });

    it('Given invalid JSX code, throws error.', function(done) {

        compile('var file1 = React.createClass({')
            .then(assertResultWasNotReturned)
            .catch(assertErrorIsThrown(done));

    });

    var compile = function(code) {

        return compileJSX({
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