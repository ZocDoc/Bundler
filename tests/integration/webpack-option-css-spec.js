var testDirectory = 'webpack-test-suite-css';
var integrationTest = require('./helpers/jasmine-wrapper.js');
var test = new integrationTest.Test(integrationTest.TestType.Css, testDirectory);

test.describeIntegrationTest("Webpack bundles:", function() {

    beforeEach(function() {
        test.given.BundleOption('webpack');
        test.given.StagingDirectoryIs('staging-dir');
        test.given.OutputDirectoryIs('output-dir');
    });

    it('Given webpack option and non CSS file in the bundle, throws', function() {

        test.given.FileToBundle(
            'file1.css',
            '.foo {\n' +
            '  background: red;\n' +
            '}'
        );
        test.given.FileToBundle(
            'file1.min.css',
            '.foo{background:red}'
        );
        test.given.FileToBundle(
            'file2.less',
            '@red: red;'
        );

        test.actions.Bundle();

        test.assert.verifyErrorOnBundle('Error: Invalid file file2.less - only .css files may be added to webpack bundles.');

    });

    it('Given webpack option and unminified CSS file without a corresponding minified CSS file in the bundle, throws', function() {

        test.given.FileToBundle(
            'file1.css',
            '.foo {\n' +
            '  background: red;\n' +
            '}'
        );

        test.actions.Bundle();

        test.assert.verifyErrorOnBundle('Error: file1.css is missing a corresponding minified file in the bundle.');

    });

    it('Given webpack option and one file pair in bundle grabbed from folder, staging bundle contains only unminified CSS file.', function() {

        test.given.SubDirectory('styles');
        test.given.FileNotInBundleInSubDirectory(
            'styles',
            'file1.css',
            '.foo {\n' +
            '  background: red;\n' +
            '}'
        );
        test.given.FileNotInBundleInSubDirectory(
            'styles',
            'file1.min.css',
            '.foo{background:red}'
        );
        test.given.DirectoryToBundle('styles');

        test.actions.Bundle();

        test.assert.verifyFileAndContentsAre(
            test.given.StagingDirectory + '/testcss',
            'test.css',
            '.foo {\n' +
            '  background: red;\n' +
            '}\n'
        );

    });

    it('Given webpack option and one file pair in bundle, staging bundle contains only unminified CSS file.', function() {

        test.given.FileToBundle(
            'file1.css',
            '.foo {\n' +
            '  background: red;\n' +
            '}'
        );
        test.given.FileToBundle(
            'file1.min.css',
            '.foo{background:red}'
        );

        test.actions.Bundle();

        test.assert.verifyFileAndContentsAre(
            test.given.StagingDirectory + '/testcss',
            'test.css',
            '.foo {\n' +
            '  background: red;\n' +
            '}\n'
        );

    });

    it('Given webpack option and multiple file pairs in bundle, staging bundle contains only unminified JS files.', function() {

        test.given.FileToBundle(
            'file1.css',
            '.foo {\n' +
            '  background: red;\n' +
            '}'
        );
        test.given.FileToBundle(
            'file1.min.css',
            '.foo{background:red}'
        );
        test.given.FileToBundle(
            'file2.css',
            '.bar {\n' +
            '  background: blue;\n' +
            '}'
        );
        test.given.FileToBundle(
            'file2.min.css',
            '.bar{background:blue}'
        );

        test.actions.Bundle();

        test.assert.verifyFileAndContentsAre(
            test.given.StagingDirectory + '/testcss',
            'test.css',
            '.foo {\n' +
            '  background: red;\n' +
            '}\n' +
            '.bar {\n' +
            '  background: blue;\n' +
            '}\n'
        );

    });

    it('Given webpack option and one file pair in bundle grabbed from folder, output bundle contains only minified CSS file.', function() {

        test.given.SubDirectory('styles');
        test.given.FileNotInBundleInSubDirectory(
            'styles',
            'file1.css',
            '.foo {\n' +
            '  background: red;\n' +
            '}'
        );
        test.given.FileNotInBundleInSubDirectory(
            'styles',
            'file1.min.css',
            '.foo{background:red}'
        );
        test.given.DirectoryToBundle('styles');

        test.actions.Bundle();

        test.assert.verifyBundleIs(
            '.foo{background:red}\n'
        );

    });

    it('Given webpack option and one file pair in bundle, output bundle contains only minified CSS file.', function() {

        test.given.FileToBundle(
            'file1.css',
            '.foo {\n' +
            '  background: red;\n' +
            '}'
        );
        test.given.FileToBundle(
            'file1.min.css',
            '.foo{background:red}'
        );

        test.actions.Bundle();

        test.assert.verifyBundleIs(
            '.foo{background:red}\n'
        );

    });

    it('Given webpack option and multiple file pairs in bundle, output bundle contains only minified CSS files.', function() {

        test.given.FileToBundle(
            'file1.css',
            '.foo {\n' +
            '  background: red;\n' +
            '}'
        );
        test.given.FileToBundle(
            'file1.min.css',
            '.foo{background:red}'
        );
        test.given.FileToBundle(
            'file2.css',
            '.bar {\n' +
            '  background: blue;\n' +
            '}'
        );
        test.given.FileToBundle(
            'file2.min.css',
            '.bar{background:blue}'
        );

        test.actions.Bundle();

        test.assert.verifyBundleIs(
            '.foo{background:red}\n' +
            '.bar{background:blue}\n'
        );

    });

    it('Given webpack and sourcemap options and files without source maps, staging bundle does not contain source maps.', function() {

        test.given.CommandLineOption('-sourcemaps');
        test.given.FileToBundle(
            'file1.css',
            '.foo {\n' +
            '  background: red;\n' +
            '}'
        );
        test.given.FileToBundle(
            'file1.min.css',
            '.foo{background:red}'
        );

        test.actions.Bundle();

        test.assert.verifyFileAndContentsAre(
            test.given.StagingDirectory + '/testcss',
            'test.css',
            '.foo {\n' +
            '  background: red;\n' +
            '}\n'
        );

    });

    it('Given webpack and sourcemap options and files without source maps, output bundle does not contain source maps.', function() {

        test.given.CommandLineOption('-sourcemaps');
        test.given.FileToBundle(
            'file1.css',
            '.foo {\n' +
            '  background: red;\n' +
            '}'
        );
        test.given.FileToBundle(
            'file1.min.css',
            '.foo{background:red}'
        );

        test.actions.Bundle();

        test.assert.verifyBundleIs(
            '.foo{background:red}\n'
        );

    });

    it('Given webpack and sourcemap options and files with source maps, staging bundle does not contain source maps.', function() {

        test.given.CommandLineOption('-sourcemaps');
        test.given.FileToBundle(
            'file1.css',
            '.foo {\n' +
            '  background: red;\n' +
            '}\n' +
            '//# sourceMappingURL=file1.css.map'
        );
        test.given.FileToBundle(
            'file1.min.css',
            '.foo{background:red}\n' +
            '//# sourceMappingURL=file1.min.css.map'
        );

        test.actions.Bundle();

        test.assert.verifyFileAndContentsAre(
            test.given.StagingDirectory + '/testcss',
            'test.css',
            '.foo {\n' +
            '  background: red;\n' +
            '}\n' +
            '\n'
        );

    });

    it('Given webpack and sourcemap options and files with source maps, output bundle does not contain source maps.', function() {

        test.given.CommandLineOption('-sourcemaps');
        test.given.FileToBundle(
            'file1.css',
            '.foo {\n' +
            '  background: red;\n' +
            '}\n' +
            '//# sourceMappingURL=file1.css.map'
        );
        test.given.FileToBundle(
            'file1.min.css',
            '.foo{background:red}\n' +
            '//# sourceMappingURL=file1.min.css.map'
        );

        test.actions.Bundle();

        test.assert.verifyBundleIs(
            '.foo{background:red}\n' +
            '\n'
        );

    });
});
