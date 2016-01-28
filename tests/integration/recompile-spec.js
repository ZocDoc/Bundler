var testDirectory = 'recompile-test-suite';
var integrationTest = require('./helpers/jasmine-wrapper.js');
var test = new integrationTest.Test(integrationTest.TestType.Undecided, testDirectory);

test.describeIntegrationTest("Recompile Tests - ", function() {

    beforeEach(function () {
        test.given.OutputDirectoryIs('output-dir');
    });

    
    describe("Javascript: ", function () {

        beforeEach(function () {
            test.resetTestType(integrationTest.TestType.Js);

            test.given.FileToBundle("file1.js", "var foo = 'asdf';");
            test.given.FileToBundle("file2.js", "var foo2 = 'bnmf';");
            test.given.FileToBundle("mustache1.mustache", "<div>{{a}}</div>");

            test.actions.Bundle();

            test.assert.verifyBundleIs(
                ';var foo="asdf";\n' +
                ';var foo2="bnmf";\n' +
                ';(function(){var e,t,i="undefined"!=typeof module&&module.exports;e=i?require("hogan"):this.Hogan,t=new e.Template({code:function(e,t,i){var o=this;return o.b(i=i||""),o.b("<div>"),o.b(o.v(o.f("a",e,t,0))),o.b("</div>"),o.fl()},partials:{},subs:{}}),i?module.exports=t:(this.JST=this.JST||{},JST.mustache1=t)}).call(this);\n'
            );

        });

        it("An updated javascript file causes the contents of the bundle to change when re-bundled.", function () {

            test.given.UpdatedFile("file2.js", "var foo2 = 'a new value';");

            test.actions.Bundle();

            test.assert.verifyBundleIs(
                ';var foo="asdf";\n' +
                ';var foo2="a new value";\n' +
                ';(function(){var e,t,i="undefined"!=typeof module&&module.exports;e=i?require("hogan"):this.Hogan,t=new e.Template({code:function(e,t,i){var o=this;return o.b(i=i||""),o.b("<div>"),o.b(o.v(o.f("a",e,t,0))),o.b("</div>"),o.fl()},partials:{},subs:{}}),i?module.exports=t:(this.JST=this.JST||{},JST.mustache1=t)}).call(this);\n'
            );

        });

        it("An updated mustache file causes the contents of the bundle to change when re-bundled.", function () {

            test.given.UpdatedFile("mustache1.mustache", "<a>{{b}}</a>");

            test.actions.Bundle();

            test.assert.verifyBundleIs(
                ';var foo="asdf";\n' +
                ';var foo2="bnmf";\n' +
                ';(function(){var e,t,a="undefined"!=typeof module&&module.exports;e=a?require("hogan"):this.Hogan,t=new e.Template({code:function(e,t,a){var o=this;return o.b(a=a||""),o.b("<a>"),o.b(o.v(o.f("b",e,t,0))),o.b("</a>"),o.fl()},partials:{},subs:{}}),a?module.exports=t:(this.JST=this.JST||{},JST.mustache1=t)}).call(this);\n'
            );

        });
    });

    describe("Css: ", function () {

        beforeEach(function () {
            test.resetTestType(integrationTest.TestType.Css);

            test.given.ImportFile("import1.less", "@import url('./import2.less');\n @imported1: black;");
            test.given.ImportFile("import2.less", "@imported2: black;");
            test.given.FileToBundle("file1.css", ".style1 { color: red; }");
            test.given.FileToBundle("file2.css", ".style2 { color: blue; }");
            test.given.FileToBundle("less1.less", "@theColor: white; .style3 { color: @theColor; }");
            test.given.FileToBundle("less2.less", "@import url('../import/import1.less');\n .importColor { color: @imported1; }");
            test.given.FileToBundle("less3.less", "@import url('../import/import1.less');\n .deeperImportColor { color: @imported2; }");

            test.actions.Bundle();

            test.assert.verifyBundleIs(
                '.style1{color:red}\n' +
                '.style2{color:#00f}\n' +
                '.style3{color:#fff}\n' +
                '.importColor{color:#000}\n' +
                '.deeperImportColor{color:#000}\n'
            );

        });
        
        it("An updated css file causes the contents of the bundle to change when re-bundled.", function () {

            test.given.UpdatedFile("file1.css", ".newstyle1 { color: yellow; }");

            test.actions.Bundle();

            test.assert.verifyBundleIs(
                '.newstyle1{color:#ff0}\n' +
                '.style2{color:#00f}\n' +
                '.style3{color:#fff}\n' +
                '.importColor{color:#000}\n' +
                '.deeperImportColor{color:#000}\n'
            );
        });

        it("An updated less file causes the contents of the bundle to change when re-bundled.", function () {

            test.given.UpdatedFile("less1.less", "@theColor: green; .style4 { color: @theColor; }");

            test.actions.Bundle();

            test.assert.verifyBundleIs(
                '.style1{color:red}\n' +
                '.style2{color:#00f}\n' +
                '.style4{color:green}\n' +
                '.importColor{color:#000}\n' +
                '.deeperImportColor{color:#000}\n'
            );

        });
        
        it("An updated import of a less file causes the contents of the bundle to change when re-bundled.", function () {

            test.given.UpdatedImport("import1.less", "@import url('./import2.less');\n @imported1: blue;");

            test.actions.Bundle();

            test.assert.verifyBundleIs(
                '.style1{color:red}\n' +
                '.style2{color:#00f}\n' +
                '.style3{color:#fff}\n' +
                '.importColor{color:#00f}\n' +
                '.deeperImportColor{color:#000}\n'
            );

        });

        it("An updated nested import of a less file causes the contents of the bundle to change when re-bundled.", function () {

            test.given.UpdatedImport("import2.less", "@imported2: blue;");

            test.actions.Bundle();

            test.assert.verifyBundleIs(
                '.style1{color:red}\n' +
                '.style2{color:#00f}\n' +
                '.style3{color:#fff}\n' +
                '.importColor{color:#000}\n' +
                '.deeperImportColor{color:#00f}\n'
            );

        });
    });
});
