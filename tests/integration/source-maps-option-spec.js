var testDirectory = 'source-maps-option-test-suite';
var integrationTest = require('./helpers/jasmine-wrapper.js');
var test = new integrationTest.Test(integrationTest.TestType.Undecided, testDirectory);

test.describeIntegrationTest("Generating source maps:", function() {

    beforeEach(function() {

        test.given.StagingDirectoryIs('staging-dir');
        test.given.OutputDirectoryIs('output-dir');

        test.given.CommandLineOption('-sourcemaps');
        test.given.CommandLineOption('-siterootdirectory:' + test.given.BaseTestDirectory);

    });

    describe("Js files", function () {

        beforeEach(function () {
            test.resetTestType(integrationTest.TestType.Js);
        });

        it("Given source maps option and JSX file, then JSX is compiled with source map file.", function () {

            test.given.FileToBundle('file1.jsx',
                'var file1 = React.createClass({'
                + '   render: function() {'
                + '   return <div>file1 {this.props.name}</div>;'
                + '  }'
                + '});');

            test.actions.Bundle();

            test.assert.verifyFileAndContentsAre(
                test.given.StagingDirectory + '/testjs',
                'test-file1.js',
                '"use strict";\n' +
                '\n' +
                'var file1 = React.createClass({\n' +
                '  displayName: "file1",\n' +
                '  render: function render() {\n' +
                '    return React.createElement(\n' +
                '      "div",\n' +
                '      null,\n' +
                '      "file1 ",\n' +
                '      this.props.name\n' +
                '    );\n' +
                '  } });\n' +
                '//# sourceMappingURL=test-file1.js.map'
            );
			
			test.assert.verifyFileAndContentsAre(
                test.given.StagingDirectory + '/testjs',
                'test-file1.js.map',
				'{"version":3,"sources":["/test/file1.jsx"],"names":["file1","React","createClass","render","props","name"],"mappings":";;AAAA,IAAIA,QAAQC,MAAMC,WAAN,CAAkB;AAAA;AAAIC,UAAQ,kBAAW;AAAI,WAAO;AAAA;AAAA;AAAA;AAAY,WAAKC,KAAL,CAAWC;AAAvB,KAAP;AAA6C,GAAxE,EAAlB,CAAZ"}'
			);

        });

        it("Given source maps option and ES6 file, then ES6 is compiled with source map file.", function () {

            test.given.FileToBundle('file1.es6',
                'var odds = evens.map(v => v + 1);');

            test.actions.Bundle();

            test.assert.verifyFileAndContentsAre(
                test.given.StagingDirectory + '/testjs',
                'test-file1.js',
                '"use strict";\n' +
                '\n' +
                'var odds = evens.map(function (v) {\n' +
                '  return v + 1;\n' +
                '});\n' +
                '//# sourceMappingURL=test-file1.js.map'
            );
			
			test.assert.verifyFileAndContentsAre(
                test.given.StagingDirectory + '/testjs',
                'test-file1.js.map',
				'{"version":3,"sources":["/test/file1.es6"],"names":["odds","evens","map","v"],"mappings":";;AAAA,IAAIA,OAAOC,MAAMC,GAAN,CAAU;AAAA,SAAKC,IAAI,CAAT;AAAA,CAAV,CAAX"}'
			);

        });

        it('Given source maps option and JS files, then combined unminified bundle JS is created with source map file.', function() {

            test.given.FileToBundle(
                'file1.jsx',
                'var file1 = React.createClass({'
                + '   render: function() {'
                + '   return <div>file1 {this.props.name}</div>;'
                + '  }'
                + '});'
            );
            test.given.FileToBundle(
                'file2.js',
                'var x = 1;'
            );

            test.actions.Bundle();

            test.assert.verifyFileAndContentsAre(
                test.given.StagingDirectory + '/testjs',
                'test.js',
                ';"use strict";\n' +
                '\n' +
                'var file1 = React.createClass({\n' +
                '  displayName: "file1",\n' +
                '  render: function render() {\n' +
                '    return React.createElement(\n' +
                '      "div",\n' +
                '      null,\n' +
                '      "file1 ",\n' +
                '      this.props.name\n' +
                '    );\n' +
                '  } });\n' +
                ';var x = 1;\n\n' +
                '//# sourceMappingURL=test.js.map'
            )

			test.assert.verifyFileAndContentsAre(
                test.given.StagingDirectory + '/testjs',
                'test-file1.js.map',
				'{"version":3,"sources":["/test/file1.jsx"],"names":["file1","React","createClass","render","props","name"],"mappings":";;AAAA,IAAIA,QAAQC,MAAMC,WAAN,CAAkB;AAAA;AAAIC,UAAQ,kBAAW;AAAI,WAAO;AAAA;AAAA;AAAA;AAAY,WAAKC,KAAL,CAAWC;AAAvB,KAAP;AAA6C,GAAxE,EAAlB,CAAZ"}'
			);
        });

        it('Given source maps option and JS files, then combined minified bundle JS is created with source map file.', function() {

            test.given.FileToBundle(
                'file1.jsx',
                'var file1 = React.createClass({'
                + '   render: function() {'
                + '   return <div>file1 {this.props.name}</div>;'
                + '  }'
                + '});'
            );
            test.given.FileToBundle(
                'file2.js',
                'var x = 1;'
            );

            test.actions.Bundle();

            test.assert.verifyBundleIs(
                ';"use strict";var file1=React.createClass({displayName:"file1",render:function(){return React.createElement("div",null,"file1 ",this.props.name)}});\n' +
                ';var x=1;\n\n' +
                '//# sourceMappingURL=test.min.js.map'
            )
			
			test.assert.verifyFileAndContentsAre(
                test.given.OutputDirectory,
                '/test.min.js.map',
				'{"version":3,"sources":["/test/file1.jsx","/test/file2.js"],"names":[],"mappings":"YAAA,IAAI,OAAQ,MAAM,aAAY,YAAA,QAAI,OAAQ,WAAe,MAAO,OAAA,cAAA,MAAA,KAAA,SAAY,KAAK,MAAM;ACAvF,GAAI,GAAI;ADAR,IAAI,QAAQ,MAAM,WAAN,CAAkB;AAAA;AAAI,UAAQ,kBAAW;AAAI,WAAO;AAAA;AAAA;AAAA;AAAY,WAAK,KAAL,CAAW;AAAvB,KAAP;AAA6C,GAAxE,EAAlB,CAAZ"}'
			);
        });

    });

    describe("Css Files", function () {

        beforeEach(function () {
            test.resetTestType(integrationTest.TestType.Css);
        });

        it("Given source maps option and less file, then less is compiled with source map file.", function () {

            test.given.FileToBundle('less1.less',
                '@color: red;\n.less1 { color: @color; }');

            test.actions.Bundle();

            test.assert.verifyFileAndContentsAre(
                test.given.StagingDirectory + '/testcss',
                'test-less1.css',
                '.less1 {\n' +
                '  color: red;\n' +
                '}\n' +
                '\n' +
                '/*# sourceMappingURL=test-less1.css.map */'
            );

			test.assert.verifyFileAndContentsAre(
                test.given.StagingDirectory + '/testcss',
                'test-less1.css.map',
				'{"version":3,"sources":["/test/less1.less"],"names":[],"mappings":"AACA;EAAS,UAAA"}'
			);
        });

        it('Given source maps option and CSS files, then combined unminified bundle CSS is created with source map file.', function() {

            test.given.FileToBundle(
                'file1.less',
                '@color: red;\n.less1 { color: @color; }'
            );
            test.given.FileToBundle(
                'file2.css',
                '.foo { background: green; }'
            );

            test.actions.Bundle();

            test.assert.verifyFileAndContentsAre(
                test.given.StagingDirectory + '/testcss',
                'test.css',
                '.less1 {\n' +
                '  color: red;\n' +
                '}\n\n' +
                '.foo { background: green; }\n\n' +
                '/*# sourceMappingURL=test.css.map */'
            )
			
            test.assert.verifyFileAndContentsAre(
                test.given.StagingDirectory + '/testcss',
                'test.css.map',
				'{"version":3,"sources":["/test/file1.less","/test/file2.css"],"names":[],"mappings":"AACA;EAAS,UAAA;;;ACDT"}'
			);

        });

        it('Given source maps option and CSS files, then combined minified bundle CSS is created with inline source map.', function() {

            test.given.FileToBundle(
                'file1.less',
                '@color: red;\n.less1 { color: @color; }'
            );
            test.given.FileToBundle(
                'file2.css',
                '.foo { background: green; }'
            );

            test.actions.Bundle();

            test.assert.verifyBundleIs(
                '.less1{color:red}\n' +
                '.foo{background:green}\n\n' +
                '/*# sourceMappingURL=test.min.css.map */'
            );
			
			test.assert.verifyFileAndContentsAre(
                test.given.OutputDirectory,
                '/test.min.css.map',
				'{"version":3,"sources":["/test/file1.less","/test/file2.css"],"names":[],"mappings":"AACA,OAAS,MAAA;ACDT,KAAO,WAAY"}'
			);

        });

    });
});
