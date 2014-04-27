
describe("Recompile Tests - ", function() {

    var exec = require('child_process').exec,
         fs = require('fs'),
         testHelper = require('./integration-test-helper.js'),
         testUtility = new testHelper.TestUtility(exec, fs, runs, waitsFor),
         bundle,
         bundleContents,
         testDir = 'recompile-test-suite',
         runType;

    beforeEach(function () {

        bundleContents = "";
        testUtility.CreateDirectory(testDir);
    });

    afterEach(function () {
        testUtility.CleanDirectory(testDir);
    });


    describe("Javascript: ", function () {

        beforeEach(function () {
            runType = '.js';

            givenFileToBundle("file1.js", "var foo = 'asdf';");
            givenFileToBundle("file2.js", "var foo2 = 'bnmf';");
            givenFileToBundle("mustache1.mustache", "<div>{{a}}</div>");

            bundle();

            verifyBundleIs(';var foo="asdf"\n'
                         + ';var foo2="bnmf"\n'
                         + ';window.JST=window.JST||{},JST.mustache1=new Hogan.Template({code:function(a,b,c){var d=this;return d.b(c=c||""),d.b("<div>"),d.b(d.v(d.f("a",a,b,0))),d.b("</div>"),d.fl()},partials:{},subs:{}})\n');

        });

        it("An updated javascript file causes the contents of the bundle to change when re-bundled.", function () {

            givenFileUpdate("file2.js", "var foo2 = 'a new value';");

            bundle();

            verifyBundleIs(';var foo="asdf"\n'
                         + ';var foo2="a new value"\n'
                         + ';window.JST=window.JST||{},JST.mustache1=new Hogan.Template({code:function(a,b,c){var d=this;return d.b(c=c||""),d.b("<div>"),d.b(d.v(d.f("a",a,b,0))),d.b("</div>"),d.fl()},partials:{},subs:{}})\n');

        });

        it("An updated mustache file causes the contents of the bundle to change when re-bundled.", function () {

            givenFileUpdate("mustache1.mustache", "<a>{{b}}</a>");

            bundle();

            verifyBundleIs(';var foo="asdf"\n'
                         + ';var foo2="bnmf"\n'
                         + ';window.JST=window.JST||{},JST.mustache1=new Hogan.Template({code:function(a,b,c){var d=this;return d.b(c=c||""),d.b("<a>"),d.b(d.v(d.f("b",a,b,0))),d.b("</a>"),d.fl()},partials:{},subs:{}})\n');

        });

    });
    describe("Css: ", function () {

        beforeEach(function () {
            runType = '.css';

            givenFileToBundle("file1.css", "style1 { color: red; }");
            givenFileToBundle("file2.css", "style2 { color: blue; }");
            givenFileToBundle("less1.less", "@theColor: white; style3 { color: @theColor; }");

            bundle();

            verifyBundleIs('style1{color:red}\n'
                         + 'style2{color:#00f}\n'
                         + 'style3{color:#fff}\n');

        });

        it("An updated css file causes the contents of the bundle to change when re-bundled.", function () {

            givenFileUpdate("file1.css", "newstyle1 { color: yellow; }");

            bundle();

            verifyBundleIs('newstyle1{color:#ff0}\n'
                         + 'style2{color:#00f}\n'
                         + 'style3{color:#fff}\n');
        });

        it("An updated less file causes the contents of the bundle to change when re-bundled.", function () {

            givenFileUpdate("less1.less", "@theColor: green; style4 { color: @theColor; }");

            bundle();

            verifyBundleIs('style1{color:red}\n'
                         + 'style2{color:#00f}\n'
                         + 'style4{color:green}\n');

        });

    });


    var givenFileUpdate = function (fileName, contents) {
        testUtility.CreateFile(testDir, fileName, contents);
        testUtility.Wait(1000);
        testUtility.RunCommandSync("touch " + testDir + "/" + fileName);
    };

    var verifyBundleIs = function (expectedContents) {
        testUtility.VerifyFileContents(testDir, "test.min" + runType, expectedContents);
    };

    var bundle = function () {
        testUtility.CreateFile(testDir, "test" + runType + ".bundle", bundleContents);
        testUtility.Bundle(testDir);
    };

    var givenFileToBundle = function (fileName, contents) {
        testUtility.CreateFile(testDir, fileName, contents);
        bundleContents = bundleContents + fileName + "\n";
    };

});
