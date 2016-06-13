var testDirectory = 'webpack-test-suite';
var integrationTest = require('./helpers/jasmine-wrapper.js');
var test = new integrationTest.Test(integrationTest.TestType.Js, testDirectory, console);

test.describeIntegrationTest("Webpack bundles:", function() {

    beforeEach(function() {

        test.given.BundleOption('webpack');

        test.given.StagingDirectoryIs('staging-dir');
        test.given.OutputDirectoryIs('output-dir');

    });

    describe('js', function() {

        beforeEach(function () {
            test.resetTestType(integrationTest.TestType.Js);
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

    });

    describe('css', function() {

        beforeEach(function () {
            test.resetTestType(integrationTest.TestType.Css);
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

    });

});
