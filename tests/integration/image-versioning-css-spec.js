var testDirectory = 'image-versioning-css';
var integrationTest = require('./helpers/jasmine-wrapper.js');
var test = new integrationTest.Test(integrationTest.TestType.Css, testDirectory);

test.describeIntegrationTest("Image Versioning:", function() {

    beforeEach(function () {
        test.given.StagingDirectoryIs('staging-dir');
        test.given.OutputDirectoryIs('output-dir');
        test.given.HashedDirectoryIs('hashing-dir');
        test.given.CommandLineOption("-rewriteimagefileroot:" + test.given.TestDirectory + " -rewriteimageoutputroot:combined");

        givenImages('an-image-there.jpg');

        test.given.FileToBundle('file1.css', '.file1 { color: red; }\n'
                                     + '.aa { background: url("img/an-image-there.jpg") center no-repeat; }\n'
                                     + '.bb { background: url("img/an-image-not-there.jpg") center no-repeat; }\n');
        test.given.FileToBundle('less1.less', '@color: red;\n'
                                     + '.a { background: url(\'an-image-there.jpg\') center no-repeat; }\n'
                                     + '.b { background: url("an-image-not-there.jpg") center no-repeat; }\n');
    });


    it("Given rewrite image option, then it versions image urls with a hash of the image contents if the image exists on disk.", function () {

          test.actions.Bundle();

          test.assert.verifyBundleIs(
              ".file1{color:red}.aa{background:url('combined/version__d30407c38e441f3cb94732074bdfd05f__/img/an-image-there.jpg') center no-repeat}.bb{background:url('img/an-image-not-there.jpg') center no-repeat}\n" +
              ".a{background:url('combined/version__d30407c38e441f3cb94732074bdfd05f__/an-image-there.jpg') center no-repeat}.b{background:url('an-image-not-there.jpg') center no-repeat}\n"
          );
  	});

    it("versions images in the hashed file with the hashed output.", function () {

          test.actions.Bundle();

          test.assert.verifyHashedFileContents(
              "test__e1ce473657dd47c8f736d16575d6e3e6__.min.css",
              ".file1{color:red}.aa{background:url('combined/d30407c38e441f3cb94732074bdfd05fan-image-there.jpg') center no-repeat}.bb{background:url('img/an-image-not-there.jpg') center no-repeat}\n" +
              ".a{background:url('combined/d30407c38e441f3cb94732074bdfd05fan-image-there.jpg') center no-repeat}.b{background:url('an-image-not-there.jpg') center no-repeat}\n"
          );
  	});

    it("outputs a minified image in the hashed directory", function () {

        test.actions.Bundle();

        test.assert.verifyFileExists(test.given.HashedDirectory, 'd30407c38e441f3cb94732074bdfd05fan-image-there.jpg');
    });

    var givenImages = function (imgFile) {
  	    var imgDir = test.given.TestDirectory + "/img";
  	    test.utility.CreateDirectory(imgDir);

          test.utility.CreateFile(imgDir, imgFile, 'image contents');
          test.utility.CreateFile(test.given.TestDirectory, imgFile, 'image contents');
  	};
});
