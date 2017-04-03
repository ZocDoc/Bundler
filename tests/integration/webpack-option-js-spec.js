var testDirectory = 'webpack-test-suite-js';
var integrationTest = require('./helpers/jasmine-wrapper.js');
var test = new integrationTest.Test(integrationTest.TestType.Js, testDirectory);

test.describeIntegrationTest("Webpack JS bundles:", function() {

    beforeEach(function() {
        test.given.BundleOption('webpack');
        test.given.StagingDirectoryIs('staging-dir');
        test.given.OutputDirectoryIs('output-dir');
    });

    it('Given webpack option and non JS file in the bundle, throws', function() {

        test.given.FileToBundle(
            'file1.js',
            'var ZD = ZD || {};\n' +
            'ZD.foo = "bar";'
        );
        test.given.FileToBundle(
            'file1.min.js',
            'var ZD=ZD||{};ZD.foo="bar"'
        );
        test.given.FileToBundle(
            'file2.es6',
            'var ZD=ZD||{};ZD.foo="bar"'
        );

        test.actions.Bundle();

        test.assert.verifyErrorOnBundle('Error: Invalid file file2.es6 - only .js files may be added to webpack bundles.');

    });

    it('Given webpack option and unminified JS file without a corresponding minified JS file in the bundle, throws', function() {

        test.given.FileToBundle(
            'file1.js',
            'var ZD = ZD || {};\n' +
            'ZD.foo = "bar";'
        );

        test.actions.Bundle();

        test.assert.verifyErrorOnBundle('Error: file1.js is missing a corresponding minified file in the bundle.');

    });

    it('Given webpack option and one file pair in bundle grabbed from folder, staging bundle contains only unminified JS file.', function() {

        test.given.SubDirectory('scripts');
        test.given.FileNotInBundleInSubDirectory(
            'scripts',
            'file1.js',
            'var ZD = ZD || {};\n' +
            'ZD.foo = "bar";'
        );
        test.given.FileNotInBundleInSubDirectory(
            'scripts',
            'file1.min.js',
            'var ZD=ZD||{};ZD.foo="bar"'
        );
        test.given.DirectoryToBundle('scripts');

        test.actions.Bundle();

        test.assert.verifyFileAndContentsAre(
            test.given.StagingDirectory + '/testjs',
            'test.js',
            ';var ZD = ZD || {};\n' +
            'ZD.foo = "bar";\n'
        );

    });

    it('Given webpack option and one file pair in bundle, staging bundle contains only unminified JS file.', function() {

        test.given.FileToBundle(
            'file1.js',
            'var ZD = ZD || {};\n' +
            'ZD.foo = "bar";'
        );
        test.given.FileToBundle(
            'file1.min.js',
            'var ZD=ZD||{};ZD.foo="bar"'
        );

        test.actions.Bundle();

        test.assert.verifyFileAndContentsAre(
            test.given.StagingDirectory + '/testjs',
            'test.js',
            ';var ZD = ZD || {};\n' +
            'ZD.foo = "bar";\n'
        );

    });

    it('Given webpack option and multiple file pairs in bundle, staging bundle contains only unminified JS files.', function() {

        test.given.FileToBundle(
            'file1.js',
            'var ZD = ZD || {};\n' +
            'ZD.foo = "bar";'
        );
        test.given.FileToBundle(
            'file1.min.js',
            'var ZD=ZD||{};ZD.foo="bar"'
        );
        test.given.FileToBundle(
            'file2.js',
            'var ZD = ZD || {};\n' +
            'ZD.bar = "foo";'
        );
        test.given.FileToBundle(
            'file2.min.js',
            'var ZD=ZD||{};ZD.bar="foo"'
        );

        test.actions.Bundle();

        test.assert.verifyFileAndContentsAre(
            test.given.StagingDirectory + '/testjs',
            'test.js',
            ';var ZD = ZD || {};\n' +
            'ZD.foo = "bar";\n' +
            ';var ZD = ZD || {};\n' +
            'ZD.bar = "foo";\n'
        );

    });

    it('Given webpack option and one file pair in bundle grabbed from folder, output bundle contains only minified JS file.', function() {

        test.given.SubDirectory('scripts');
        test.given.FileNotInBundleInSubDirectory(
            'scripts',
            'file1.js',
            'var ZD = ZD || {};\n' +
            'ZD.foo = "bar";'
        );
        test.given.FileNotInBundleInSubDirectory(
            'scripts',
            'file1.min.js',
            'var ZD=ZD||{};ZD.foo="bar"'
        );
        test.given.DirectoryToBundle('scripts');

        test.actions.Bundle();

        test.assert.verifyBundleIs(
            ';var ZD=ZD||{};ZD.foo="bar"\n'
        );

    });

    it('Given webpack option and one file pair in bundle, output bundle contains only minified JS file.', function() {

        test.given.FileToBundle(
            'file1.js',
            'var ZD = ZD || {};\n' +
            'ZD.foo = "bar";'
        );
        test.given.FileToBundle(
            'file1.min.js',
            'var ZD=ZD||{};ZD.foo="bar"'
        );

        test.actions.Bundle();

        test.assert.verifyBundleIs(
            ';var ZD=ZD||{};ZD.foo="bar"\n'
        );

    });

    it('Given webpack option and multiple file pairs in bundle, output bundle contains only minified JS files.', function() {

        test.given.FileToBundle(
            'file1.js',
            'var ZD = ZD || {};\n' +
            'ZD.foo = "bar";'
        );
        test.given.FileToBundle(
            'file1.min.js',
            'var ZD=ZD||{};ZD.foo="bar"'
        );
        test.given.FileToBundle(
            'file2.js',
            'var ZD = ZD || {};\n' +
            'ZD.bar = "foo";'
        );
        test.given.FileToBundle(
            'file2.min.js',
            'var ZD=ZD||{};ZD.bar="foo"'
        );

        test.actions.Bundle();

        test.assert.verifyBundleIs(
            ';var ZD=ZD||{};ZD.foo="bar"\n' +
            ';var ZD=ZD||{};ZD.bar="foo"\n'
        );

    });

    it('Given webpack and sourcemap options and files without source maps, staging bundle does not contain source maps.', function() {

        test.given.CommandLineOption('-sourcemaps');
        test.given.FileToBundle(
            'file1.js',
            'var ZD = ZD || {};\n' +
            'ZD.foo = "bar";'
        );
        test.given.FileToBundle(
            'file1.min.js',
            'var ZD=ZD||{};ZD.foo="bar"'
        );

        test.actions.Bundle();

        test.assert.verifyFileAndContentsAre(
            test.given.StagingDirectory + '/testjs',
            'test.js',
            ';var ZD = ZD || {};\n' +
            'ZD.foo = "bar";\n'
        );

    });

    it('Given webpack and sourcemap options and files without source maps, output bundle does not contain source maps.', function() {

        test.given.CommandLineOption('-sourcemaps');
        test.given.FileToBundle(
            'file1.js',
            'var ZD = ZD || {};\n' +
            'ZD.foo = "bar";'
        );
        test.given.FileToBundle(
            'file1.min.js',
            'var ZD=ZD||{};ZD.foo="bar"'
        );

        test.actions.Bundle();

        test.assert.verifyBundleIs(
            ';var ZD=ZD||{};ZD.foo="bar"\n'
        );

    });

    it('Given webpack and sourcemap options and files with source maps, staging bundle does not contain source maps.', function() {

        test.given.CommandLineOption('-sourcemaps');
        test.given.FileToBundle(
            'file1.js',
            'var ZD = ZD || {};\n' +
            'ZD.foo = "bar";\n' +
            '//# sourceMappingURL=file1.js.map'
        );
        test.given.FileToBundle(
            'file1.min.js',
            'var ZD=ZD||{};ZD.foo="bar"\n' +
            '//# sourceMappingURL=file1.min.js.map'
        );

        test.actions.Bundle();

        test.assert.verifyFileAndContentsAre(
            test.given.StagingDirectory + '/testjs',
            'test.js',
            ';var ZD = ZD || {};\n' +
            'ZD.foo = "bar";\n' +
            '\n'
        );

    });

    it('Given webpack and sourcemap options and files with source maps, output bundle does not contain source maps.', function() {

        test.given.CommandLineOption('-sourcemaps');
        test.given.FileToBundle(
            'file1.js',
            'var ZD = ZD || {};\n' +
            'ZD.foo = "bar";\n' +
            '//# sourceMappingURL=file1.js.map'
        );
        test.given.FileToBundle(
            'file1.min.js',
            'var ZD=ZD||{};ZD.foo="bar"\n' +
            '//# sourceMappingURL=file1.min.js.map'
        );

        test.actions.Bundle();

        test.assert.verifyBundleIs(
            ';var ZD=ZD||{};ZD.foo="bar"\n' +
            '\n'
        );

    });
});
