var testDirectory = 'stats-test-suite';
var integrationTest = require('./helpers/jasmine-wrapper.js');
var test = new integrationTest.Test(integrationTest.TestType.Js, testDirectory);

test.describeIntegrationTest("Integration Tests for Bundle Stats Collecting:", function() {

    beforeEach(function () {
        test.given.OutputDirectoryIs('output-dir');
        test.given.FileToBundle('file1.js',    'var file1 = "file1";');
        test.given.FileToBundle('file2.js',    'var file2 = "file2";');
    });

    describe("Hashing: ", function() {

        it(" hashes not computed if the option is not specified.", function () {

            test.actions.Bundle();

            test.assert.verifyFileDoesNotExist(test.given.OutputDirectory, 'bundle-hashes.json');
        });

        it("The stats option computes a hash for all bundles and puts it in the output directory.", function () {

            test.given.BundleOption('-outputbundlestats');

            test.actions.Bundle();


            test.assert.verifyJson(
                test.given.OutputDirectory,
                'bundle-hashes.json',
                function (json) {

                    var properties = Object.getOwnPropertyNames(json);
                    expect(properties.length).toBe(1);
                    expect(properties[0]).toBe('test.js');
                    expect(json['test.js']).toBe("1f293fa2bbd662c1c4ef9780550867a7");
                });
        });
    });

    describe("Debug Files: ", function () {

        it("No debug files are computed if the option is not specified.", function () {

            test.actions.Bundle();

            test.assert.verifyFileDoesNotExist(test.given.OutputDirectory, 'bundle-debug.json');
        });

        it("The stats option computes a collection of files for all bundles and puts it in the output directory.", function () {

            test.given.BundleOption('-outputbundlestats');

            test.actions.Bundle();

            test.assert.verifyJson(
                test.given.OutputDirectory,
                'bundle-debug.json',
                function (json) {
                    validateJsonObject(json, function (b) {
                        expect(b.indexOf('stats-test-suite\\test\\file1.js') >= 0).toBe(true);
                        expect(b.indexOf('stats-test-suite\\test\\file2.js') >= 0).toBe(true);
                    });
                });
        });
    });

    describe("Localization Files: ", function () {

        it("No localization files are computed if the option is not specified.", function () {
            test.actions.Bundle();

            test.assert.verifyFileDoesNotExist(test.given.OutputDirectory, 'bundle-localization-strings.json');
        });

        it("The stats option computes a set of localized strings for all bundles and puts it in the output directory.", function () {

            test.given.BundleOption('-outputbundlestats');

            test.given.FileToBundle('file3.js', "// @localize js1.string\ni18n.t('js2.string');\ni18n.t(\"js3.string\");");
            test.given.FileToBundle('file4.mustache', "{{# i18n }}js4.string{{/ i18n }}");
            test.given.FileToBundle('file5.mustache', "{{# i18n }}js5.string{{/ i18n }}");

            test.actions.Bundle();

            test.assert.verifyJson(
                test.given.OutputDirectory,
                'bundle-localization-strings.json',
                function (json) {
                    validateJsonObject(json, function (b) {
                        expect(b.indexOf('js1.string') >= 0).toBe(true);
                        expect(b.indexOf('js2.string') >= 0).toBe(true);
                        expect(b.indexOf('js3.string') >= 0).toBe(true);
                        expect(b.indexOf('js4.string') >= 0).toBe(true);
                        expect(b.indexOf('js5.string') >= 0).toBe(true);
                    });
                });
        });
    });

    describe("Ab Config Files: ", function () {

        it("No ab config files are computed if the option is not specified.", function () {
            test.actions.Bundle();

            test.assert.verifyFileDoesNotExist(test.given.OutputDirectory, 'bundle-ab-configs.json');
        });

        it("The stats option computes a set of localized strings for all bundles and puts it in the output directory.", function () {
            test.given.BundleOption('-outputbundlestats');

            test.given.FileToBundle('file3.js', "{AB.isOn('ab.config.1');}\nvar x=12;i18n.t('ab.config.2');");
            test.given.FileToBundle('file4.js', "AB.isOn('ab.config.3');");

            test.actions.Bundle();

            test.assert.verifyJson(
                test.given.OutputDirectory,
                'bundle-ab-configs.json',
                function (json) {
                    validateJsonObject(json, function (b) {
                        expect(b.indexOf('ab.config.1') >= 0).toBe(true);
                        expect(b.indexOf('ab.config.3') >= 0).toBe(true);
                        expect(b.indexOf('ab.config.2') >= 0).toBe(false);
                    });
                });
        });
    });

    var validateJsonObject = function (json, validateBundleFunc) {
        var properties = Object.getOwnPropertyNames(json);
        expect(properties.length).toBe(1);
        expect(properties[0]).toBe('test.js.bundle');
        validateBundleFunc(json['test.js.bundle']);
    };

});
