var testDirectory = 'css-test-suite';
var integrationTest = require('./helpers/jasmine-wrapper.js');
var test = new integrationTest.Test(integrationTest.TestType.Css, testDirectory);

test.describeIntegrationTest("Css Bundling:", function() {

    beforeEach(function() {

        test.given.OutputDirectoryIs('output-dir');

    });

    it("Given an invalid less file, then bundling fails and an error is thrown.", function () {
        test.given.FileToBundle('less1.less', '@color: red;\n.less1 { color: @color; ');

        test.actions.Bundle();

        test.utility.VerifyErrorIs("Unrecognised input. Possibly missing something");
    });

    it("Given an invalid scss file, then bundling fails and an error is thrown.", function () {
        test.given.FileToBundle('scss1.scss', '$green: #008000;\n#css-results { #scss { background: $green; ');

        test.actions.Bundle();

        test.utility.VerifyErrorIs("Invalid CSS after");
    });

	it("Given css files, then they are concatenated into the output bundle.", function() {

        test.given.FileToBundle('file1.css', '.file1 { color: red; }');
        test.given.FileToBundle('file2.css', '.file2 { color: red; }');
        test.given.FileNotInBundle('file3.css', '.file3 { color: red; }');

        test.actions.Bundle();

	    test.assert.verifyBundleIs(
            ".file1{color:red}\n" +
            ".file2{color:red}\n"
        );

	});

	it("Given Less files, then they are compiled and concatenated into the output bundle.", function () {

        test.given.FileToBundle('less1.less', '@color: red;\n.less1 { color: @color; }');
        test.given.FileNotInBundle('less2.less', '@color: red;\n.less2 { color: @color; }');
        test.given.FileToBundle('less3.less', '@color: red;\n.less3 { color: @color; }');

        test.actions.Bundle();

        test.assert.verifyBundleIs(
            ".less1{color:red}\n" +
            ".less3{color:red}\n"
        );

	});

    it("Given .scss files, then they are compiled and concatenated into the output bundle.", function () {

        test.given.FileToBundle('scss1.scss', '$green: #008000;\n#css-results { #scss { background: $green; } }');
        test.given.FileNotInBundle('scss2.scss', '$aqua: #088080;\n#css-results2 { #scss2 { background: $aqua; } }');
        test.given.FileToBundle('scss3.scss', '$blue: #000080;\n#css-results3 { #scss3 { background: $blue; } }');

        test.actions.Bundle();

        test.assert.verifyBundleIs(
            "#css-results #scss{background:green}\n" +
            "#css-results3 #scss3{background:navy}\n"
        );

    });

	it("Given Css and Less files together, then it compiles and concatenates everything into the output bundle.", function () {

        test.given.FileToBundle('file1.css', '.file1 { color: red; }');
        test.given.FileToBundle('file2.css', '.file2 { color: red; }');
        test.given.FileToBundle('less1.less', '@color: red;\n.less1 { color: @color; }');
        test.given.FileToBundle('less3.less', '@color: red;\n.less3 { color: @color; }');
        test.given.FileNotInBundle('less2.less', '@color: red;\n.less2 { color: @color; }');
        test.given.FileNotInBundle('file3.css', '.file3 { color: red; }');

        test.actions.Bundle();

        test.assert.verifyBundleIs(
            ".file1{color:red}\n" +
            ".file2{color:red}\n" +
            ".less1{color:red}\n" +
            ".less3{color:red}\n"
        );

	});

	it("Given rewrite image option, then it versions image urls with a hash of the image contents if the image exists on disk.", function () {

	    givenImages('an-image-there.jpg');

        test.given.BundleOption("-rewriteimagefileroot:" + test.given.TestDirectory + " -rewriteimageoutputroot:combined");


        test.given.FileToBundle('file1.css', '.file1 { color: red; }\n'
                                     + '.aa { background: url("img/an-image-there.jpg") center no-repeat; }\n'
                                     + '.bb { background: url("img/an-image-not-there.jpg") center no-repeat; }\n');
        test.given.FileToBundle('less1.less', '@color: red;\n'
                                     + '.a { background: url(\'an-image-there.jpg\') center no-repeat; }\n'
                                     + '.b { background: url("an-image-not-there.jpg") center no-repeat; }\n');

        test.actions.Bundle();

        test.assert.verifyBundleIs(
            ".file1{color:red}.aa{background:url('combined/version__d30407c38e441f3cb94732074bdfd05f__/img/an-image-there.jpg') center no-repeat}.bb{background:url('img/an-image-not-there.jpg') center no-repeat}\n" +
            ".a{background:url('combined/version__d30407c38e441f3cb94732074bdfd05f__/an-image-there.jpg') center no-repeat}.b{background:url('an-image-not-there.jpg') center no-repeat}\n"
        );

	});

	var givenImages = function (imgFile) {
	    var imgDir = test.given.TestDirectory + "/img";
	    test.utility.CreateDirectory(imgDir);

        test.utility.CreateFile(imgDir, imgFile, 'image contents');
        test.utility.CreateFile(test.given.TestDirectory, imgFile, 'image contents');
	};

});
