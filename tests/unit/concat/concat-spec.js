var concat = require('../../../src/concat');
var FileType = require('../../../src/file').type;

describe('concat files', function() {

    var files,
        fileType,
        sourceMap,
        code;

    beforeEach(function() {

        files = [];
        sourceMap = false;

    });

    describe('Given JS files and source maps disabled', function() {

        beforeEach(function() {

            givenFileTypeIs(FileType.JS);
            givenFile({
                originalPath: 'C:\\foo\\file1.js',
                path: 'C:\\foo\\file1.js',
                code: 'var x = 1;'
            });
            givenFile({
                originalPath: 'C:\\foo\\file2.js',
                path: 'C:\\foo\\file2.js',
                code: 'var y = 2;'
            });

            concatFiles();

        });

        it('Prefixes all lines with semi-colons and adds new lines between files.', function() {

            assertConcatenatedCodeIs(
                ';var x = 1;\n' +
                ';var y = 2;\n'
            );

        });

        it('Does not generate a source map.', function() {

            assertConcatenatedSourceMapIs(undefined);

        });

    });

    describe('Given JS files without source maps and source maps enabled', function() {

        beforeEach(function() {

            givenSourceMapsEnabled();
            givenFileTypeIs(FileType.JS);
            givenFile({
                originalPath: 'C:\\foo\\file1.js',
                path: 'C:\\foo\\file1.js',
                code: 'var x = 1;'
            });
            givenFile({
                originalPath: 'C:\\foo\\file2.js',
                path: 'C:\\foo\\file2.js',
                code: 'var y = 2;'
            });

            concatFiles();

        });

        it('Prefixes all lines with semi-colons and adds new lines between files.', function() {

            assertConcatenatedCodeIs(
                ';var x = 1;\n' +
                ';var y = 2;\n'
            );

        });

        it('Generates source map.', function() {

            assertConcatenatedSourceMapIs({
                version: 3,
                sources: [ 'C:\\foo\\file1.js', 'C:\\foo\\file2.js' ],
                names: [  ],
                mappings: 'AAAA;ACAA',
                file: '',
                sourceRoot : ''
            });

        });

    });

    describe('Given JS files with source maps and source maps enabled', function() {

        beforeEach(function() {

            givenSourceMapsEnabled();
            givenFileTypeIs(FileType.JS);
            givenFile({
                originalPath: 'C:\\foo\\file1.es6',
                path: 'C:\\foo\\file1.js',
                code:
                    '"use strict";\n' +
                    '\n' +
                    'var odds = evens.map(function (v) {\n' +
                    '  return v + 1;\n' +
                    '});',
                map: {
                    version: 3,
                    sources: [ '/foo/file1.es6' ],
                    names: [  ],
                    mappings: ';;AAAA,IAAI,IAAI,GAAG,KAAK,CAAC,GAAG,CAAC,UAAA,CAAC;SAAI,CAAC,GAAG,CAAC;CAAA,CAAC,CAAC'
                }
            });
            givenFile({
                originalPath: 'C:\\foo\\file2.jsx',
                path: 'C:\\foo\\file2.js',
                code:
                    'var file1 = React.createClass({\n' +
                    '  displayName: "file1",\n' +
                    '  render: function () {\n' +
                    '    return React.createElement(\n' +
                    '      "div",\n' +
                    '      null,\n' +
                    '      "file1 ",\n' +
                    '      this.props.name\n' +
                    '    );\n' +
                    '  } });\n',
                map: {
                    version: 3,
                    sources: [ '/foo/file2.jsx' ],
                    names: [  ],
                    mappings: 'AAAA,IAAI,KAAK,GAAG,KAAK,CAAC,WAAW,CAAC;;AAAI,QAAM,EAAE,YAAW;AAAI,WAAO;;;;MAAY,IAAI,CAAC,KAAK,CAAC,IAAI;KAAO,CAAC;GAAG,EAAC,CAAC,CAAC'
                }
            });

            concatFiles();

        });

        it('Prefixes all lines with semi-colons and adds new lines between files.', function() {

            assertConcatenatedCodeIs(
                ';"use strict";\n' +
                '\n' +
                'var odds = evens.map(function (v) {\n' +
                '  return v + 1;\n' +
                '});\n' +
                ';var file1 = React.createClass({\n' +
                '  displayName: "file1",\n' +
                '  render: function () {\n' +
                '    return React.createElement(\n' +
                '      "div",\n' +
                '      null,\n' +
                '      "file1 ",\n' +
                '      this.props.name\n' +
                '    );\n' +
                '  } });\n\n'
            );

        });

        it('Generates source map.', function() {

            assertConcatenatedSourceMapIs({
                version: 3,
                sources: [ '/foo/file1.es6', '/foo/file2.jsx' ],
                names: [  ],
                mappings: ';;AAAA,IAAI,IAAI,GAAG,KAAK,CAAC,GAAG,CAAC,UAAA,CAAC;SAAI,CAAC,GAAG,CAAC;CAAA,CAAC,CAAC;ACAjC,IAAI,KAAK,GAAG,KAAK,CAAC,WAAW,CAAC;;AAAI,QAAM,EAAE,YAAW;AAAI,WAAO;;;;MAAY,IAAI,CAAC,KAAK,CAAC,IAAI;KAAO,CAAC;GAAG,EAAC,CAAC,CAAC',
                file: '',
                sourceRoot : ''
            });

        });

    });

    describe('Given some JS files with source maps and some without and source maps enabled', function() {

        beforeEach(function() {

            givenSourceMapsEnabled();
            givenFileTypeIs(FileType.JS);
            givenFile({
                originalPath: 'C:\\foo\\file1.js',
                path: 'C:\\foo\\file1.js',
                code: 'var x = 1;'
            });
            givenFile({
                originalPath: 'C:\\foo\\file2.es6',
                path: 'C:\\foo\\file2.js',
                code:
                    '"use strict";\n' +
                    '\n' +
                    'var odds = evens.map(function (v) {\n' +
                    '  return v + 1;\n' +
                    '});',
                map: {
                    version: 3,
                    sources: [ '/foo/file2.es6' ],
                    names: [  ],
                    mappings: ';;AAAA,IAAI,IAAI,GAAG,KAAK,CAAC,GAAG,CAAC,UAAA,CAAC;SAAI,CAAC,GAAG,CAAC;CAAA,CAAC,CAAC'
                }
            });

            concatFiles();

        });
        
        it('Prefixes all lines with semi-colons and adds new lines between files.', function() {
        
            assertConcatenatedCodeIs(
                ';var x = 1;\n' +
                ';"use strict";\n' +
                '\n' +
                'var odds = evens.map(function (v) {\n' +
                '  return v + 1;\n' +
                '});\n'
            );
        
        });

        it('Generates source map.', function() {

            assertConcatenatedSourceMapIs({
                version: 3,
                sources: [ 'C:\\foo\\file1.js', '/foo/file2.es6' ],
                names: [  ],
                mappings: 'AAAA;;;ACAA,IAAI,IAAI,GAAG,KAAK,CAAC,GAAG,CAAC,UAAA,CAAC;SAAI,CAAC,GAAG,CAAC;CAAA,CAAC,CAAC',
                file: '',
                sourceRoot : ''
            });

        });

    });

    describe('Given minified JS files with source maps and source maps enabled', function() {

        beforeEach(function() {

            givenSourceMapsEnabled();
            givenFileTypeIs(FileType.JS);
            givenFile({
                originalPath: 'C:\\foo\\file1.es6',
                path: 'C:\\foo\\file1.min.js',
                code: '"use strict";var odds=evens.map(function(e){return e+1});',
                map: {
                    version: 3,
                    sources: [ '/foo/file1.es6' ],
                    names: [  ],
                    mappings: 'YAAA,IAAI,MAAO,MAAM,IAAI,SAAA,SAAK,GAAI;;AAA9B,IAAI,IAAI,GAAG,KAAK,CAAC,GAAG,CAAC,UAAA,CAAC;SAAI,CAAC,GAAG,CAAC;CAAA,CAAC,CAAC'
                }
            });
            givenFile({
                originalPath: 'C:\\foo\\file2.jsx',
                path: 'C:\\foo\\file2.min.js',
                code: 'var file1=React.createClass({displayName:"file1",render:function(){return React.createElement("div",null,"file1 ",this.props.name)}});',
                map: {
                    version: 3,
                    sources: [ '/foo/file2.jsx' ],
                    names: [  ],
                    mappings: 'AAAA,GAAI,CAAA,KAAK,CAAG,EAAA,IAAM,CAAD,CAAC,WAAW,CAAC,mBAAI,OAAQ,WAAe,MAAO,OAAA,kCAAY,KAAK,MAAM;;AAArD,QAAM,EAAE,YAAW;AAAI,WAAO;;;;MAAY,IAAI,CAAC,KAAK,CAAC,IAAI;KAAO,CAAC;GAAG,EAAC,CAAC,CAAC'
                }
            });

            concatFiles();

        });

        it('Prefixes all lines with semi-colons and adds new lines between files.', function() {

            assertConcatenatedCodeIs(
                ';"use strict";var odds=evens.map(function(e){return e+1});\n' +
                ';var file1=React.createClass({displayName:"file1",render:function(){return React.createElement("div",null,"file1 ",this.props.name)}});\n'
            );

        });

        it('Generates source map.', function() {

            assertConcatenatedSourceMapIs({
                version: 3,
                sources: [ '/foo/file1.es6', '/foo/file2.jsx' ],
                names: [  ],
                mappings: 'YAAA,IAAI,MAAO,MAAM,IAAI,SAAA,SAAK,GAAI;ACA9B,GAAI,CAAA,KAAK,CAAG,EAAA,IAAM,CAAD,CAAC,WAAW,CAAC,mBAAI,OAAQ,WAAe,MAAO,OAAA,kCAAY,KAAK,MAAM;ADAvF,IAAI,IAAI,GAAG,KAAK,CAAC,GAAG,CAAC,UAAA,CAAC;ACAY,QAAM,CDAd,CAAC,ACAe,GDAZ,CAAC,QCAsB;AAAI,CDA1B,CAAC,CAAC,QCA+B;;;;MAAY,IAAI,CAAC,KAAK,CAAC,IAAI;KAAO,CAAC;GAAG,EAAC,CAAC,CAAC',
                file: '',
                sourceRoot : ''
            });

        });

    });

    describe('Given CSS files and source maps disabled', function() {

        beforeEach(function() {

            givenFileTypeIs(FileType.CSS);
            givenFile({
                originalPath: 'C:\\foo\\file1.css',
                path: 'C:\\foo\\file1.css',
                code: '.foo { background: red; }'
            });
            givenFile({
                originalPath: 'C:\\foo\\file2.css',
                path: 'C:\\foo\\file2.css',
                code: '#bar { font-size: 10px; }'
            });

            concatFiles();

        });

        it('Adds new lines between files.', function() {

            assertConcatenatedCodeIs(
                '.foo { background: red; }\n' +
                '#bar { font-size: 10px; }\n'
            );

        });

        it('Does not generate source map.', function() {

            assertConcatenatedSourceMapIs(undefined);

        });

    });

    describe('Given CSS files without source maps and source maps enabled', function() {

        beforeEach(function() {

            givenSourceMapsEnabled();
            givenFileTypeIs(FileType.CSS);
            givenFile({
                originalPath: 'C:\\foo\\file1.css',
                path: 'C:\\foo\\file1.css',
                code: '.foo { background: red; }'
            });
            givenFile({
                originalPath: 'C:\\foo\\file2.css',
                path: 'C:\\foo\\file2.css',
                code: '#bar { font-size: 10px; }'
            });

            concatFiles();

        });

        it('Adds new lines between files.', function() {

            assertConcatenatedCodeIs(
                '.foo { background: red; }\n' +
                '#bar { font-size: 10px; }\n'
            );

        });

        it('Generates source map.', function() {

            assertConcatenatedSourceMapIs({
                version: 3,
                sources: [ 'C:\\foo\\file1.css', 'C:\\foo\\file2.css' ],
                names: [  ],
                mappings: 'AAAA;ACAA',
                file: '',
                sourceRoot: ''
            });

        });

    });

    describe('Given CSS files with source maps and source maps enabled', function() {

        beforeEach(function() {

            givenSourceMapsEnabled();
            givenFileTypeIs(FileType.CSS);
            givenFile({
                originalPath: 'C:\\foo\\file1.less',
                path: 'C:\\foo\\file1.css',
                code:
                    '.less1 {\n' +
                    '  color: red;\n' +
                    '}\n',
                map: {
                    version: 3,
                    sources: [ '/foo/file1.less' ],
                    names: [  ],
                    mappings: 'AACA;EAAS,UAAA'
                }
            });
            givenFile({
                originalPath: 'C:\\foo\\file2.scss',
                path: 'C:\\foo\\file2.css',
                code:
                    '#css-results #scss {\n' +
                    '  background: #008000; }\n' +
                    '\n',
                map: {
                    version: 3,
                    sources: [ '/foo/file2.scss' ],
                    names: [  ],
                    mappings: 'AACA,YAAY,CAAG,KAAK,CAAC;EAAE,UAAU,EADzB,OAAO,GAC8B'
                }
            });

            concatFiles();

        });

        it('Adds new lines between files.', function() {

            assertConcatenatedCodeIs(
                '.less1 {\n' +
                '  color: red;\n' +
                '}\n\n' +
                '#css-results #scss {\n' +
                '  background: #008000; }\n' +
                '\n\n'
            );

        });

        it('Generates source map.', function() {

            assertConcatenatedSourceMapIs({
                version: 3,
                sources: [ '/foo/file1.less', '/foo/file2.scss' ],
                names: [  ],
                mappings: 'AACA;EAAS,UAAA;;;ACAT,YAAY,CAAG,KAAK,CAAC;EAAE,UAAU,EADzB,OAAO,GAC8B',
                file: '',
                sourceRoot: ''
            });

        });

    });

    describe('Given some CSS files with source maps and some without and source maps enabled', function() {

        beforeEach(function() {

            givenSourceMapsEnabled();
            givenFileTypeIs(FileType.CSS);
            givenFile({
                originalPath: 'C:\\foo\\file1.css',
                path: 'C:\\foo\\file1.css',
                code: '.foo { background: red; }'
            });
            givenFile({
                originalPath: 'C:\\foo\\file2.scss',
                path: 'C:\\foo\\file2.css',
                code:
                    '#css-results #scss {\n' +
                    '  background: #008000; }\n' +
                    '\n',
                map: {
                    version: 3,
                    sources: [ '/foo/file2.scss' ],
                    names: [  ],
                    mappings: 'AACA,YAAY,CAAG,KAAK,CAAC;EAAE,UAAU,EADzB,OAAO,GAC8B'
                }
            });

            concatFiles();

        });

        it('Adds new lines between files.', function() {

            assertConcatenatedCodeIs(
                '.foo { background: red; }\n' +
                '#css-results #scss {\n' +
                '  background: #008000; }\n' +
                '\n\n'
            );

        });

        it('Generates source map.', function() {

            assertConcatenatedSourceMapIs({
                version: 3,
                sources: [ 'C:\\foo\\file1.css', '/foo/file2.scss' ],
                names: [  ],
                mappings: 'AAAA;ACCA,YAAY,CAAG,KAAK,CAAC;EAAE,UAAU,EADzB,OAAO,GAC8B',
                file: '',
                sourceRoot: ''
            });

        });

    });

    describe('Given minified CSS files with source maps and source maps enabled', function() {

        beforeEach(function() {

            givenSourceMapsEnabled();
            givenFileTypeIs(FileType.CSS);
            givenFile({
                originalPath: 'C:\\foo\\file1.less',
                path: 'C:\\foo\\file1.min.css',
                code: '.less1{color:red}',
                map: {
                    version: 3,
                    sources: [ '/foo/file1.less' ],
                    names: [  ],
                    mappings: 'AACA;EAAS,UAAA'
                }
            });
            givenFile({
                originalPath: 'C:\\foo\\file2.scss',
                path: 'C:\\foo\\file2.min.css',
                code: '#css-results #scss{background:#008000}',
                map: {
                    version: 3,
                    sources: [ '/foo/file2.scss' ],
                    names: [  ],
                    mappings: 'AACA,YAAY,CAAG,KAAK,CAAC;EAAE,UAAU,EADzB,OAAO,GAC8B'
                }
            });

            concatFiles();

        });

        it('Adds new lines between files.', function() {

            assertConcatenatedCodeIs(
                '.less1{color:red}\n' +
                '#css-results #scss{background:#008000}\n'
            );

        });

        it('Generates source map.', function() {

            assertConcatenatedSourceMapIs({
                version: 3,
                sources: [ '/foo/file1.less', '/foo/file2.scss' ],
                names: [  ],
                mappings: 'AACA;ACAA,EDAS,UAAA,ACAG,CAAG,KAAK,CAAC;EAAE,UAAU,EADzB,OAAO,GAC8B',
                file: '',
                sourceRoot: ''
            });

        });

    });

    var concatFiles = function() {

        code = concat.files({
            files: files,
            fileType: fileType,
            sourceMap: sourceMap
        });

    };

    var givenFile = function(file) {

        files.push(file);

    };

    var givenFileTypeIs = function(type) {

        fileType = type;

    };

    var givenSourceMapsEnabled = function() {

        sourceMap = true;

    };

    var assertConcatenatedCodeIs = function(expected) {

        expect(code.code).toEqual(expected);

    };

    var assertConcatenatedSourceMapIs = function(expected) {

        expect(code.map).toEqual(expected);

    };

});