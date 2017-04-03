var testDirectory = 'output-dir-option-test-suite';
var integrationTest = require('./helpers/jasmine-wrapper.js');
var test = new integrationTest.Test(integrationTest.TestType.Undecided, testDirectory);

test.describeIntegrationTest("Outputting to another directory:", function() {

	beforeEach(function () {
	    test.given.OutputDirectoryIs('output-dir');
    });

    describe("Js files", function () {

        beforeEach(function () {
            test.resetTestType(integrationTest.TestType.Js);
        });

        it("If an output directory is specified, then the minified bundle is put in it.", function () {

            test.given.FileToBundle('file1.js', 'var file1 = "file1";');
            test.given.FileToBundle('file2.js', 'var file2 = "file2";');

            test.actions.Bundle();

            test.assert.verifyFileDoesNotExist(test.given.TestDirectory, 'test.min.css');
            test.assert.verifyFileAndContentsAre(
                testDirectory + '/output-dir',
                'test.min.js',
                ';var file1="file1";\n'
                + ';var file2="file2";\n');
        });

        it("If an output directory is specified, then any minified files are put in it.", function () {
            test.given.FileToBundle('file1.js', 'var file1 = "file1";');
            test.given.FileToBundle('file2.mustache', '<div> {{c}} </div>');

            test.actions.Bundle();

            test.assert.verifyFileDoesNotExist(test.given.TestDirectory, 'file2.min.js');
            test.assert.verifyFileDoesNotExist(test.given.TestDirectory, 'file1.min.js');
            test.assert.verifyFileAndContentsAre(
                testDirectory + '/output-dir',
                'file1.min.js',
                'var file1="file1";');
            test.assert.verifyFileAndContentsAre(
                testDirectory + '/output-dir',
                'file2.min.js',
                '(function(){this.JST=this.JST||{},this.JST.file2=new this.Hogan.Template({code:function(i,t,s){var n=this;return n.b(s=s||""),n.b("<div> "),n.b(n.v(n.f("c",i,t,0))),n.b(" </div>"),n.fl()},partials:{},subs:{}})}).call(this);');
        });

        it("If an output directory is specified, then any computed mustache files are put in it.", function () {
            test.given.FileToBundle('file1.js', 'var file1 = "file1";');
            test.given.FileToBundle('file2.mustache', '<div> {{c}} </div>');

            test.actions.Bundle();

            test.assert.verifyFileDoesNotExist(test.given.TestDirectory, 'file2.js');
            test.assert.verifyFileAndContentsAre(
                testDirectory + '/output-dir',
                'file2.js',
                '(function() {\n' +
                '\n' +
                '    this.JST = this.JST || {};\n' +
                '\n' +
                '    this.JST[\'file2\'] = new this.Hogan.Template({\n' +
                '        code: function(c,p,i){var _=this;_.b(i=i||"");_.b("<div> ");_.b(_.v(_.f("c",c,p,0)));_.b(" </div>");return _.fl();;},\n' +
                '        partials: {},\n' +
                '        subs: {}\n' +
                '    });\n' +
                '\n' +
                '}).call(this);'
            );
        });

        it("If an output directory is specified, then any computed jsx files are put in it.", function () {
            test.given.FileToBundle('file1.js', 'var file1 = "file1";');
            test.given.FileToBundle('file2.jsx',
                    'var file2 = React.createClass({'
                        + '   render: function() {'
                        + '   return <div>file2 {this.props.name}</div>;'
                        + '  }'
                        + '});');

            test.actions.Bundle();

            test.assert.verifyFileDoesNotExist(test.given.TestDirectory, 'file2.js');
            test.assert.verifyFileAndContentsAre(
                testDirectory + '/output-dir',
                'file2.js',
                '"use strict";\n' +
                '\n' +
                'var file2 = React.createClass({\n' +
                '  displayName: "file2",\n' +
                '  render: function render() {\n' +
                '    return React.createElement(\n' +
                '      "div",\n' +
                '      null,\n' +
                '      "file2 ",\n' +
                '      this.props.name\n' +
                '    );\n' +
                '  } });'
            );
        });

        it('If an output directory is specified, then any computed es6 files are put in it.', function() {

            test.given.FileToBundle('file1.js', 'var file1 = "file1";');
            test.given.FileToBundle('file2.es6',
                'var odds = evens.map(v => v + 1);');

            test.actions.Bundle();

            test.assert.verifyFileDoesNotExist(test.given.TestDirectory, 'file2.js');
            test.assert.verifyFileAndContentsAre(
                testDirectory + '/output-dir',
                'file2.js',
                '"use strict";\n\nvar odds = evens.map(function (v) {\n  return v + 1;\n});');

        });
    });

    describe("Css Files", function () {

        beforeEach(function () {
            test.resetTestType(integrationTest.TestType.Css);
        });

        it("If an output directory is specified, then the minified bundle is put in it.", function () {
            test.given.FileToBundle('file1.css', '.file1 { color: red; }');
            test.given.FileToBundle('file2.css', '.file2 { color: green; }');

            test.actions.Bundle();

            test.assert.verifyFileDoesNotExist(test.given.TestDirectory, 'test.min.css');
            test.assert.verifyFileAndContentsAre(
                testDirectory + '/output-dir',
                'test.min.css',
                ".file1{color:red}\n"
                + ".file2{color:green}\n");
        });

        it("If an output directory is specified, then any minified files are put in it.", function () {
            test.given.FileToBundle('file1.css', '.file1 { color: red; }');
            test.given.FileToBundle('file2.less', '.file2 { color: green; }');

            test.actions.Bundle();

            test.assert.verifyFileDoesNotExist(test.given.TestDirectory, 'file2.min.css');
            test.assert.verifyFileDoesNotExist(test.given.TestDirectory, 'file1.min.css');
            test.assert.verifyFileAndContentsAre(
                testDirectory + '/output-dir',
                'file1.min.css',
                ".file1{color:red}");
            test.assert.verifyFileAndContentsAre(
                testDirectory + '/output-dir',
                'file2.min.css',
                ".file2{color:green}");
        });

        it("If an output directory is specified, then any computed less files are put in it.", function () {
            test.given.FileToBundle('file1.css', '.file1 { color: red; }');
            test.given.FileToBundle('file2.less', '.file2 { color: green; }');

            test.actions.Bundle();

            test.assert.verifyFileDoesNotExist(test.given.TestDirectory, 'file2.css');
            test.assert.verifyFileAndContentsAre(
                testDirectory + '/output-dir',
                'file2.css',
                ".file2 {\n" +
                "  color: green;\n" +
                "}\n");
        });
    });
});
