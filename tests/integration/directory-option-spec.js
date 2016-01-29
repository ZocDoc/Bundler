var testDirectory = 'directory-option-test-suite';
var integrationTest = require('./helpers/jasmine-wrapper.js');
var test = new integrationTest.Test(integrationTest.TestType.Undecided, testDirectory);

test.describeIntegrationTest("Directory Option:", function() {

    describe("Js files", function () {

        beforeEach(function () {
            test.resetTestType(integrationTest.TestType.Js);
        });

        it("Allows entire subdirectories to be included", function () {
            
            test.given.SubDirectory('folder1');
            test.given.FileNotInBundleInSubDirectory('folder1', 'file1.js', 'var file1 = "file1";');
            test.given.FileNotInBundleInSubDirectory('folder1', 'file2.js', 'var file2 = "file2";');

            test.given.SubDirectory('folder2');
            test.given.FileNotInBundleInSubDirectory('folder2', 'file3.js', 'var file3 = "file3";');

            test.given.DirectoryToBundle('folder1');

            test.actions.Bundle();

            test.assert.verifyBundleIs(';var file1="file1";\n'
                + ';var file2="file2";\n');
        });

        it("Recursively scans directories", function () {
            test.given.SubDirectory('folder1');
            test.given.SubDirectory('folder1/folder2');
            test.given.FileNotInBundleInSubDirectory('folder1', 'file1.js', 'var file1 = "file1";');
            test.given.FileNotInBundleInSubDirectory('folder1/folder2', 'file2.js', 'var file2 = "file2";');

            test.given.DirectoryToBundle('folder1');

            test.actions.Bundle();

            test.assert.verifyBundleIs(';var file1="file1";\n'
                + ';var file2="file2";\n');
        });

        it("Directories can be combined with direct file references", function () {
            test.given.SubDirectory('folder1');
            test.given.FileNotInBundleInSubDirectory('folder1', 'file1.js', 'var file1 = "file1";');
            test.given.FileNotInBundleInSubDirectory('folder1', 'file2.js', 'var file2 = "file2";');

            test.given.DirectoryToBundle('folder1');
            test.given.FileToBundle('file3.js', 'var file3 = "file3";');

            test.actions.Bundle();

            test.assert.verifyBundleIs(';var file1="file1";\n'
                + ';var file2="file2";\n'
                + ';var file3="file3";\n');
        });

        it("Listing items before a directory preferentially orders them", function () {
            test.given.SubDirectory('folder1');
            test.given.FileNotInBundleInSubDirectory('folder1', 'file1.js', 'var file1 = "file1";');
            test.given.FileNotInBundleInSubDirectory('folder1', 'file2.js', 'var file2 = "file2";');
            test.given.FileNotInBundleInSubDirectory('folder1', 'file3.js', 'var file3 = "file3";');

            test.given.ExistingFileToBundle('folder1/file3.js');
            test.given.DirectoryToBundle('folder1');

            test.actions.Bundle();

            test.assert.verifyBundleIs(';var file3="file3";\n'
                + ';var file1="file1";\n'
                + ';var file2="file2";\n');
        });
    });

    describe("Css Files", function () {

        beforeEach(function () {
            test.resetTestType(integrationTest.TestType.Css);
        });

        it("Allows entire subdirectories to be included", function () {
            test.given.SubDirectory('folder1');
            test.given.FileNotInBundleInSubDirectory('folder1', 'file1.css', '.file1 { color: red; }');
            test.given.FileNotInBundleInSubDirectory('folder1', 'file2.less', '.less1 { color: green; }');

            test.given.SubDirectory('folder2');
            test.given.FileNotInBundleInSubDirectory('folder2', 'file3.css', '.file2 { color: blue; }');

            test.given.DirectoryToBundle('folder1');

            test.actions.Bundle();

            test.assert.verifyBundleIs('.file1{color:red}\n'
                         + '.less1{color:green}\n');
        });

        it("Recursively scans directories", function () {
            test.given.SubDirectory('folder1');
            test.given.SubDirectory('folder1/folder2');
            test.given.FileNotInBundleInSubDirectory('folder1', 'file1.css', '.file1 { color: red; }');
            test.given.FileNotInBundleInSubDirectory('folder1/folder2', 'file2.less', '.less1 { color: green; }');

            test.given.DirectoryToBundle('folder1');

            test.actions.Bundle();

            test.assert.verifyBundleIs('.file1{color:red}\n'
                + '.less1{color:green}\n');
        });

        it("Directories can be combined with direct file references", function () {
            test.given.SubDirectory('folder1');
            test.given.FileNotInBundleInSubDirectory('folder1', 'file1.css', '.file1 { color: red; }');
            test.given.FileNotInBundleInSubDirectory('folder1', 'file2.less', '.less1 { color: green; }');

            test.given.DirectoryToBundle('folder1');
            test.given.FileToBundle('file3.css', '.file3 { color: orange; }\n');

            test.actions.Bundle();

            test.assert.verifyBundleIs('.file1{color:red}\n'
                + '.less1{color:green}\n'
                + '.file3{color:orange}\n');
        });

        it("Listing items before a directory preferentially orders them", function () {

            test.given.SubDirectory('folder1');
            test.given.FileNotInBundleInSubDirectory('folder1', 'file1.css', '.file1 { color: red; }');
            test.given.FileNotInBundleInSubDirectory('folder1', 'file2.css', '.file2 { color: green; }');
            test.given.FileNotInBundleInSubDirectory('folder1', 'file3.css', '.file3 { color: orange; }');

            test.given.ExistingFileToBundle('folder1/file3.css');
            test.given.DirectoryToBundle('folder1');

            test.actions.Bundle();

            test.assert.verifyBundleIs('.file3{color:orange}\n'
                + '.file1{color:red}\n'
                + '.file2{color:green}\n');
        });
    });
});
