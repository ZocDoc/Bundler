var testDirectory = 'staging-dir-option-test-suite';
var integrationTest = require('./helpers/jasmine-wrapper.js');
var test = new integrationTest.Test(integrationTest.TestType.Undecided, testDirectory);

test.describeIntegrationTest("Outputting processed files into a staging folder:", function() {

    beforeEach(function() {

        test.given.OutputDirectoryIs('output-dir');

    });

    describe("Js files", function () {

        beforeEach(function () {
            test.resetTestType(integrationTest.TestType.Js);

            test.given.FileToBundle('file1.js', 'var file1 = "file1";');
            test.given.FileToBundle('file2.js', 'var file2 = "file2";');
            test.given.FileToBundle('file3.mustache', '<div>{{a}}</div>');

        });

        it("given option is not specified, does not output bundling artificats to a staging directory", function () {

            test.actions.Bundle();

            test.assert.verifyFileExists(test.given.OutputDirectory, 'file1.min.js');
            test.assert.verifyFileExists(test.given.OutputDirectory, 'file2.min.js');
            test.assert.verifyFileExists(test.given.OutputDirectory, 'file3.js');
            test.assert.verifyFileExists(test.given.OutputDirectory, 'file3.min.js');
            test.assert.verifyFileExists(test.given.OutputDirectory, 'test.js');
        });

        it("given option is specified, does not output bundling artificats to the test directory", function () {

            test.given.StagingDirectoryIs('staging-dir');

            test.actions.Bundle();

            test.assert.verifyFileDoesNotExist(test.given.TestDirectory, 'file1.min.js');
            test.assert.verifyFileDoesNotExist(test.given.TestDirectory, 'file2.min.js');
            test.assert.verifyFileDoesNotExist(test.given.TestDirectory, 'file3.js');
            test.assert.verifyFileDoesNotExist(test.given.TestDirectory, 'file3.min.js');
            test.assert.verifyFileDoesNotExist(test.given.TestDirectory, 'test.js');
        });

        it("given option is specified, outputs bundling artificats to the staging directory", function () {

            test.given.StagingDirectoryIs('staging-dir');

            test.actions.Bundle();

            test.assert.verifyFileExists(test.given.StagingDirectory, 'testjs/test-file1.min.js');
            test.assert.verifyFileExists(test.given.StagingDirectory, 'testjs/test-file2.min.js');
            test.assert.verifyFileExists(test.given.StagingDirectory, 'testjs/test-file3.js');
            test.assert.verifyFileExists(test.given.StagingDirectory, 'testjs/test.js');
        });

    });

    describe("Css Files", function () {

        beforeEach(function () {
            test.resetTestType(integrationTest.TestType.Css);

            test.given.FileToBundle('file1.css', '.file1 { color: red; }');
            test.given.FileToBundle('file2.css', '.file2 { color: green; }');
            test.given.FileToBundle('file3.less', '.file3 { color: orange; }');

        });

        it("given option is not specified, does not output bundling artificats to a staging directory", function () {

            test.actions.Bundle();

            test.assert.verifyFileExists(test.given.OutputDirectory, 'file1.min.css');
            test.assert.verifyFileExists(test.given.OutputDirectory, 'file2.min.css');
            test.assert.verifyFileExists(test.given.OutputDirectory, 'file3.css');
            test.assert.verifyFileExists(test.given.OutputDirectory, 'file3.min.css');
            test.assert.verifyFileExists(test.given.OutputDirectory, 'test.css');
        });

        it("given option is specified, does not output bundling artificats to the test directory", function () {

            test.given.StagingDirectoryIs('staging-dir');

            test.actions.Bundle();

            test.assert.verifyFileDoesNotExist(test.given.TestDirectory, 'file1.min.css');
            test.assert.verifyFileDoesNotExist(test.given.TestDirectory, 'file2.min.css');
            test.assert.verifyFileDoesNotExist(test.given.TestDirectory, 'file3.css');
            test.assert.verifyFileDoesNotExist(test.given.TestDirectory, 'file3.min.css');
            test.assert.verifyFileDoesNotExist(test.given.TestDirectory, 'test.css');
        });

        it("given option is specified, outputs bundling artificats to the staging directory", function () {

            test.given.StagingDirectoryIs('staging-dir');

            test.actions.Bundle();

            test.assert.verifyFileExists(test.given.StagingDirectory, 'testcss/test-file1.min.css');
            test.assert.verifyFileExists(test.given.StagingDirectory, 'testcss/test-file2.min.css');
            test.assert.verifyFileExists(test.given.StagingDirectory, 'testcss/test-file3.css');
            test.assert.verifyFileExists(test.given.StagingDirectory, 'testcss/test.css');
        });

    });
});
