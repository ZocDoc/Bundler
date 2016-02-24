var testDirectory = 'source-maps-option-test-suite';
var integrationTest = require('./helpers/jasmine-wrapper.js');
var test = new integrationTest.Test(integrationTest.TestType.Undecided, testDirectory);

test.describeIntegrationTest("Generating source maps:", function() {

    beforeEach(function() {

        test.given.StagingDirectoryIs('staging-dir');
        test.given.OutputDirectoryIs('output-dir');

        test.given.BundleOption('-sourcemaps');
        test.given.BundleOption('-siterootdirectory:' + test.given.BaseTestDirectory);

    });

    describe("Js files", function () {

        beforeEach(function () {
            test.resetTestType(integrationTest.TestType.Js);
        });

        it("Given source maps option and JSX file, then JSX is compiled with inline source maps.", function () {

            test.given.FileToBundle('file1.jsx',
                'var file1 = React.createClass({'
                + '   render: function() {'
                + '   return <div>file1 {this.props.name}</div>;'
                + '  }'
                + '});');

            test.actions.Bundle();

            test.assert.verifyFileAndContentsAre(
                test.given.StagingDirectory + '/testjs',
                'test-file1.js',
                '"use strict";\n' +
                '\n' +
                'var file1 = React.createClass({\n' +
                '  displayName: "file1",\n' +
                '  render: function render() {\n' +
                '    return React.createElement(\n' +
                '      "div",\n' +
                '      null,\n' +
                '      "file1 ",\n' +
                '      this.props.name\n' +
                '    );\n' +
                '  } });\n' +
                '//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi90ZXN0L2ZpbGUxLmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksS0FBSyxHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUM7O0FBQUksUUFBTSxFQUFFLGtCQUFXO0FBQUksV0FBTzs7OztNQUFZLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSTtLQUFPLENBQUM7R0FBRyxFQUFDLENBQUMsQ0FBQyJ9'
            );

        });

        it("Given source maps option and ES6 file, then ES6 is compiled with inline source maps.", function () {

            test.given.FileToBundle('file1.es6',
                'var odds = evens.map(v => v + 1);');

            test.actions.Bundle();

            test.assert.verifyFileAndContentsAre(
                test.given.StagingDirectory + '/testjs',
                'test-file1.js',
                '"use strict";\n' +
                '\n' +
                'var odds = evens.map(function (v) {\n' +
                '  return v + 1;\n' +
                '});\n' +
                '//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi90ZXN0L2ZpbGUxLmVzNiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksSUFBSSxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsVUFBQSxDQUFDO1NBQUksQ0FBQyxHQUFHLENBQUM7Q0FBQSxDQUFDLENBQUMifQ=='
            );

        });

    });

    describe("Css Files", function () {

        beforeEach(function () {
            test.resetTestType(integrationTest.TestType.Css);
        });

        it("Given source maps option and less file, then less is compiled with inline source maps.", function () {

            test.given.FileToBundle('less1.less',
                '@color: red;\n.less1 { color: @color; }');

            test.actions.Bundle();

            test.assert.verifyFileAndContentsAre(
                test.given.StagingDirectory + '/testcss',
                'test-less1.css',
                '.less1 {\n' +
                '  color: red;\n' +
                '}\n' +
                '\n' +
                '/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi90ZXN0L2xlc3MxLmxlc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0E7RUFBUyxVQUFBIn0= */'
            );

        });

        it("Given source maps option and scss file, then lscssess is compiled with inline source maps.", function () {

            test.given.FileToBundle('scss1.scss',
                '$green: #008000;\n#css-results { #scss { background: $green; } }');

            test.actions.Bundle();

            test.assert.verifyFileAndContentsAre(
                test.given.StagingDirectory + '/testcss',
                'test-scss1.css',
                '#css-results #scss {\n' +
                '  background: #008000; }\n' +
                '\n' +
                '/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi8uLi8uLi90ZXN0L3Njc3MxLnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsWUFBWSxDQUFHLEtBQUssQ0FBQztFQUFFLFVBQVUsRUFEekIsT0FBTyxHQUM4QiJ9 */'
            );

        });

    });
});
