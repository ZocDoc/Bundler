
describe("Css Bundling:", function() {

    var exec = require('child_process').exec,
		fs = require('fs'),
        testHelper = require('./helpers/integration-test-helper.js'),
        givensHelper = require('./helpers/integration-givens.js'),
        actionsHelper = require('./helpers/integration-actions.js'),
        assertsHelper = require('./helpers/integration-asserts.js'),
        testUtility = new testHelper.TestUtility(exec, fs, runs, waitsFor),
        given = new givensHelper.Givens(testUtility),
        actions = new actionsHelper.Actions(testUtility, given, 'css'),
        asserts = new assertsHelper.Asserts(testUtility, given, 'css'),
        testDirBase = 'css-test-suite';

	beforeEach(function () {
        given.CleanTestSpace(testDirBase);
    });

    afterEach(function () {
        testUtility.CleanDirectory(testDirBase);
    });
	
    it("Given an invalid less file, then bundling fails and an error is thrown.", function () {
        given.FileToBundle('less1.less', '@color: red;\n.less1 { color: @color; ');

        actions.Bundle();

        testUtility.VerifyErrorIs("Unrecognised input. Possibly missing something");
    });

    it("Given an invalid scss file, then bundling fails and an error is thrown.", function () {
        given.FileToBundle('scss1.scss', '$green: #008000;\n#css-results { #scss { background: $green; ');

        actions.Bundle();

        testUtility.VerifyErrorIs("error: invalid property name");
    });

	it("Given css files, then they are concatenated into the output bundle.", function() {

	    given.FileToBundle('file1.css', '.file1 { color: red; }');
	    given.FileToBundle('file2.css', '.file2 { color: red; }');
	    given.FileNotInBundle('file3.css', '.file3 { color: red; }');

	    actions.Bundle();
	    
	    asserts.verifyBundleIs(".file1{color:red}\n"
                      + ".file2{color:red}\n");

	});  

	it("Given Less files, then they are compiled and concatenated into the output bundle.", function () {

	    given.FileToBundle('less1.less', '@color: red;\n.less1 { color: @color; }');
	    given.FileNotInBundle('less2.less', '@color: red;\n.less2 { color: @color; }');
	    given.FileToBundle('less3.less', '@color: red;\n.less3 { color: @color; }');

	    actions.Bundle();

	    asserts.verifyBundleIs(".less1{color:red}\n"
                      + ".less3{color:red}\n");
	});

    it("Given .scss files, then they are compiled and concatenated into the output bundle.", function () {

        given.FileToBundle('scss1.scss', '$green: #008000;\n#css-results { #scss { background: $green; } }');
        given.FileNotInBundle('scss2.scss', '$aqua: #088080;\n#css-results2 { #scss2 { background: $aqua; } }');
        given.FileToBundle('scss3.scss', '$blue: #000080;\n#css-results3 { #scss3 { background: $blue; } }');

        actions.Bundle();

        asserts.verifyBundleIs("#css-results #scss{background:green}\n"
                             + "#css-results3 #scss3{background:navy}\n");
    });

	it("Given Css and Less files together, then it compiles and concatenates everything into the output bundle.", function () {
	    
	    given.FileToBundle('file1.css', '.file1 { color: red; }');
	    given.FileToBundle('file2.css', '.file2 { color: red; }');
	    given.FileToBundle('less1.less', '@color: red;\n.less1 { color: @color; }');
	    given.FileToBundle('less3.less', '@color: red;\n.less3 { color: @color; }');
	    given.FileNotInBundle('less2.less', '@color: red;\n.less2 { color: @color; }');
	    given.FileNotInBundle('file3.css', '.file3 { color: red; }');

	    actions.Bundle();

	    asserts.verifyBundleIs(".file1{color:red}\n"
                      + ".file2{color:red}\n"
                      + ".less1{color:red}\n"
                      + ".less3{color:red}\n");
	});

	it("Given rewrite image option, then it versions image urls with a hash of the image contents if the image exists on disk.", function () {

	    givenImages('an-image-there.jpg');

	    given.BundleOption("-rewriteimagefileroot:" + given.TestDirectory + " -rewriteimageoutputroot:combined");


	    given.FileToBundle('file1.css', '.file1 { color: red; }\n'
                                     + '.aa { background: url("img/an-image-there.jpg") center no-repeat; }\n'
                                     + '.bb { background: url("img/an-image-not-there.jpg") center no-repeat; }\n');
	    given.FileToBundle('less1.less', '@color: red;\n'
                                     + '.a { background: url(\'an-image-there.jpg\') center no-repeat; }\n'
                                     + '.b { background: url("an-image-not-there.jpg") center no-repeat; }\n');

	    actions.Bundle();

	    asserts.verifyBundleIs(".file1{color:red}.aa{background:url('combined/version__d30407c38e441f3cb94732074bdfd05f__/img/an-image-there.jpg') center no-repeat}.bb{background:url('img/an-image-not-there.jpg') center no-repeat}\n"
                      + ".a{background:url('combined/version__d30407c38e441f3cb94732074bdfd05f__/an-image-there.jpg') center no-repeat}.b{background:url('an-image-not-there.jpg') center no-repeat}\n");
	})

	var givenImages = function (imgFile) {
	    var imgDir = given.TestDirectory + "/img";
	    testUtility.CreateDirectory(imgDir);

	    testUtility.CreateFile(imgDir, imgFile, 'image contents');
	    testUtility.CreateFile(given.TestDirectory, imgFile, 'image contents');
	};

});
