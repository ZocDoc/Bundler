var testDirectory = 'source-maps-option-test-suite';
var integrationTest = require('./helpers/jasmine-wrapper.js');
var test = new integrationTest.Test(integrationTest.TestType.Undecided, testDirectory);

test.describeIntegrationTest("Generating source maps:", function() {

    describe("Js files", function () {

        beforeEach(function () {
            test.resetTestType(integrationTest.TestType.Js);
        });

        it("Given source maps option and JSX file, then JSX is compiled with inline source maps.", function () {

            test.given.BundleOption('-sourcemaps');
            test.given.BundleOption('-siterootdirectory:' + test.given.BaseTestDirectory);

            test.given.FileToBundle('file1.jsx',
                'var file1 = React.createClass({'
                + '   render: function() {'
                + '   return <div>file1 {this.props.name}</div>;'
                + '  }'
                + '});');

            test.actions.Bundle();

            test.assert.verifyFileAndContentsAre(test.given.TestDirectory, 'file1.js',
                'var file1 = React.createClass({displayName: "file1",   render: function() {   return React.createElement("div", null, "file1 ", this.props.name);  }});\n'
              + '//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL3Rlc3QvZmlsZTEuanN4Iiwic291cmNlcyI6WyIvdGVzdC9maWxlMS5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBSSwyQkFBMkIscUJBQUEsR0FBRyxNQUFNLEVBQUUsV0FBVyxJQUFJLE9BQU8sb0JBQUEsS0FBSSxFQUFBLElBQUMsRUFBQSxRQUFBLEVBQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFXLENBQUEsQ0FBQyxHQUFHLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbInZhciBmaWxlMSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHsgICByZW5kZXI6IGZ1bmN0aW9uKCkgeyAgIHJldHVybiA8ZGl2PmZpbGUxIHt0aGlzLnByb3BzLm5hbWV9PC9kaXY+OyAgfX0pOyJdfQ==');

        });

        it("Given source maps option and ES6 file, then ES6 is compiled with inline source maps.", function () {

            test.given.BundleOption('-sourcemaps');
            test.given.BundleOption('-siterootdirectory:' + test.given.BaseTestDirectory);

            test.given.FileToBundle('file1.es6',
                'var odds = evens.map(v => v + 1);');

            test.actions.Bundle();

            test.assert.verifyFileAndContentsAre(test.given.TestDirectory, 'file1.js',
                '"use strict";\n\n'
              + 'var odds = evens.map(function (v) {\n'
              + '  return v + 1;\n'
              + '});\n'
              + '//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi90ZXN0L2ZpbGUxLmVzNiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksSUFBSSxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsVUFBQSxDQUFDO1NBQUksQ0FBQyxHQUFHLENBQUM7Q0FBQSxDQUFDLENBQUMiLCJmaWxlIjoidW5rbm93biIsInNvdXJjZXNDb250ZW50IjpbInZhciBvZGRzID0gZXZlbnMubWFwKHYgPT4gdiArIDEpOyJdfQ==');

        });

    });

    describe("Css Files", function () {

        beforeEach(function () {
            test.resetTestType(integrationTest.TestType.Css);
        });

        it("Given source maps option and less file, then less is compiled with inline source maps.", function () {

            test.given.BundleOption('-sourcemaps');
            test.given.BundleOption('-siterootdirectory:' + test.given.BaseTestDirectory);

            test.given.FileToBundle('less1.less',
                '@color: red;\n.less1 { color: @color; }');

            test.actions.Bundle();

            test.assert.verifyFileAndContentsAre(test.given.TestDirectory, 'less1.css',
                ".less1 {\n  color: red;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi90ZXN0L2xlc3MxLmxlc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0E7RUFBUyxVQUFBIn0= */");

        });

        it("Given source maps option and scss file, then lscssess is compiled with inline source maps.", function () {

            test.given.BundleOption('-sourcemaps');
            test.given.BundleOption('-siterootdirectory:' + test.given.BaseTestDirectory);

            test.given.FileToBundle('scss1.scss',
                '$green: #008000;\n#css-results { #scss { background: $green; } }');

            test.actions.Bundle();

            test.assert.verifyFileAndContentsAre(test.given.TestDirectory, 'scss1.css',
                "#css-results #scss {\n"
              + "  background: #008000; }\n\n"
              + "/*# sourceMappingURL=data:application/json;base64,ewoJInZlcnNpb24iOiAzLAoJInNvdXJjZVJvb3QiOiAiL3Rlc3QiLAoJImZpbGUiOiAic2NzczEuY3NzIiwKCSJzb3VyY2VzIjogWwoJCSJzY3NzMS5zY3NzIgoJXSwKCSJtYXBwaW5ncyI6ICJBQUNBLFlBQVksQ0FBRyxLQUFLLENBQUM7RUFBRSxVQUFVLEVBRHpCLE9BQU8sR0FDOEIiLAoJIm5hbWVzIjogW10KfQ== */");

        });

    });
});
