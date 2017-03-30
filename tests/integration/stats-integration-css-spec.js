var testDirectory = 'stats-test-suite-css';
var integrationTest = require('./helpers/jasmine-wrapper.js');
var test = new integrationTest.Test(integrationTest.TestType.Css, testDirectory);

test.describeIntegrationTest("Integration Tests for Bundle Stats Collecting Css:", function() {

    beforeEach(function () {
        test.given.StagingDirectoryIs('staging-dir');
        test.given.OutputDirectoryIs('output-dir');
        test.given.FileToBundle('file1.css',    '.css1 { color: red; }');
        test.given.FileToBundle('file2.css',    '.css2 { color: green; }');
        test.given.FileToBundle('file3.less',    '.css3 { color: green; }');
    });

    describe("Hashing: ", function() {

        it("Computes a hash for all bundles and puts it in the output directory.", function () {

            test.actions.Bundle();

            test.assert.verifyJson(
                test.given.OutputDirectory,
                'bundle-hashes.json',
                function (json) {

                    var properties = Object.getOwnPropertyNames(json);
                    expect(properties.length).toBe(1);
                    expect(properties[0]).toBe('test.css');
                    expect(json['test.css']).toBe("ad2983d9c10c124b24c1dda1a9ac3b69");
                });
        });

        it("The stats option outputs the minified file and the minified file with a hash in it", function () {

            test.actions.Bundle();

            test.assert.verifyFileExists(test.given.OutputDirectory, 'test.min.css');
            test.assert.verifyFileExists(test.given.OutputDirectory, 'test__ad2983d9c10c124b24c1dda1a9ac3b69__.min.css');
        });
    });

    describe("Debug Files: ", function () {

        it("Computes a collection of files for all bundles and puts it in the output directory.", function () {

            test.actions.Bundle();

            test.assert.verifyJson(
                test.given.OutputDirectory,
                'bundle-debug.json',
                function (json) {
                    validateJsonObject(json, function (b) {
                        expect(b).toEqual([
                            'stats-test-suite-css\\test\\file1.css',
                            'stats-test-suite-css\\test\\file2.css',
                            './stats-test-suite-css/staging-dir/testcss/test-file3.css'
                        ]);
                    });
                });
        });
    });

    var validateJsonObject = function (json, validateBundleFunc) {
        var properties = Object.getOwnPropertyNames(json);
        expect(properties.length).toBe(1);
        expect(properties[0]).toBe('test.css.bundle');
        validateBundleFunc(json['test.css.bundle']);
    };

});
