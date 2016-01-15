var testDirectory = 'folder-option-test-suite';
var integrationTest = require('./helpers/jasmine-wrapper.js');
var test = new integrationTest.Test(integrationTest.TestType.Undecided, testDirectory);

test.describeIntegrationTest("Outputting to another directory:", function() {

    describe("Js files", function () {

        beforeEach(function () {
            test.resetTestType(integrationTest.TestType.Js);
        });

        it("Given folder option, then it minifies all files in the top level folder, but does not concatenate into a bundle."
            , function () {

                test.given.BundleOption("-folder");

                test.given.FileNotInBundle('file1.js', 'var file1 = "file1";');
                test.given.FileNotInBundle('file2.js', 'var file2 = "file2";');
                test.given.FileNotInBundle('file3.js', 'var file3 = "file3";');

                test.actions.Bundle();

                test.assert.verifyFileAndContentsAre(test.given.TestDirectory, 'file1.min.js', 'var file1="file1";');
                test.assert.verifyFileAndContentsAre(test.given.TestDirectory, 'file2.min.js', 'var file2="file2";');
                test.assert.verifyFileAndContentsAre(test.given.TestDirectory, 'file3.min.js', 'var file3="file3";');
                test.assert.verifyFileDoesNotExist(test.given.TestDirectory, 'test.min.js');

            });

        it("Given folder and force bundle option, then it minifies all files in the top level folder and concatenates them into a bundle."
            , function () {

                test.given.BundleOption("-folder -forcebundle");

                test.given.FileNotInBundle('file1.js', 'var file1 = "file1";');
                test.given.FileNotInBundle('file2.js', 'var file2 = "file2";');
                test.given.FileNotInBundle('file3.js', 'var file3 = "file3";');

                test.actions.Bundle();

                test.assert.verifyBundleIs(
                    ';var file1="file1";\n' +
                    ';var file2="file2";\n' +
                    ';var file3="file3";\n'
                );

            });

        it("Given the recursive option, then files in sub-directories are included in the bundle.", function () {

            var subDirectory = "sub_dir";
            test.given.BundleOption("-folder:recursive -forcebundle");
            test.given.SubDirectory(subDirectory);

            test.given.FileNotInBundle('file1.js', 'var file1 = "file1";');
            test.given.FileNotInBundleInSubDirectory(subDirectory, 'file2.js', 'var file2 = "file2";');
            test.given.FileNotInBundleInSubDirectory(subDirectory, 'file3.mustache', '<div> {{c}} </div>');

            test.actions.Bundle();

            test.assert.verifyBundleIs(
                ';var file1="file1";\n' +
                ';var file2="file2";\n' +
                ';window.JST=window.JST||{},JST.file3=new Hogan.Template({code:function(i,n,e){var a=this;return a.b(e=e||""),a.b("<div> "),a.b(a.v(a.f("c",i,n,0))),a.b(" </div>"),a.fl()},partials:{},subs:{}});\n'
            );

        });

    });

    describe("Css Files", function () {

        beforeEach(function () {
            test.resetTestType(integrationTest.TestType.Css);
        });

        it("Given folder option, then it minifies all files in the top level folder, but does not concatenate into a bundle."
        , function () {

            test.given.BundleOption("-folder");

            test.given.FileNotInBundle('file1.css', '.file1 { color: red; }');
            test.given.FileNotInBundle('file2.css', '.file2 { color: red; }');
            test.given.FileNotInBundle('file3.css', '.file3 { color: red; }');

            test.actions.Bundle();

            test.assert.verifyFileAndContentsAre(test.given.TestDirectory, 'file1.min.css', '.file1{color:red}');
            test.assert.verifyFileAndContentsAre(test.given.TestDirectory, 'file2.min.css', '.file2{color:red}');
            test.assert.verifyFileAndContentsAre(test.given.TestDirectory, 'file3.min.css', '.file3{color:red}');
            test.assert.verifyFileDoesNotExist(test.given.TestDirectory, 'test.min.css');
        });

        it("Given folder and force bundle option, then it minifies all files in the top level folder and concatenates them into a bundle."
        , function () {

            test.given.BundleOption("-folder -forcebundle");

            test.given.FileNotInBundle('file1.css', '.file1 { color: red; }');
            test.given.FileNotInBundle('file2.css', '.file2 { color: red; }');
            test.given.FileNotInBundle('file3.css', '.file3 { color: red; }');

            test.actions.Bundle();

            test.assert.verifyBundleIs('.file1{color:red}\n'
                         + '.file2{color:red}\n'
                         + '.file3{color:red}\n');
        });

        it("Given a sub directory, then by default the sub-directory is not included with the folder option.", function () {

            var subDirectory = "sub_dir";
            test.given.BundleOption("-folder -forcebundle");
            test.given.SubDirectory(subDirectory);

            test.given.FileNotInBundle('file1.css', '.file1 { color: red; }');
            test.given.FileNotInBundleInSubDirectory(subDirectory, 'file2.css', '.file2 { color: red; }');
            test.given.FileNotInBundleInSubDirectory(subDirectory, 'less1.less', '@color: red;\n.less1 { color: @color; }');

            test.actions.Bundle();

            test.assert.verifyBundleIs('.file1{color:red}\n');
        });

        it("Given the recursive option, then files in sub-directories are included in the bundle.", function () {

            var subDirectory = "sub_dir";
            test.given.BundleOption("-folder:recursive -forcebundle");
            test.given.SubDirectory(subDirectory);

            test.given.FileNotInBundle('file1.css', '.file1 { color: red; }');
            test.given.FileNotInBundleInSubDirectory(subDirectory, 'file2.css', '.file2 { color: red; }');
            test.given.FileNotInBundleInSubDirectory(subDirectory, 'less1.less', '@color: red;\n.less1 { color: @color; }');

            test.actions.Bundle();

            test.assert.verifyBundleIs('.file1{color:red}\n'
                         + '.file2{color:red}\n'
                         + '.less1{color:red}\n');

        });
    });
});
