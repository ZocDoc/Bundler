
describe("Javascript bundling tests", function() {

  var exec = require('child_process').exec,
    fs = require('fs'),
    testCase = require('./bundler-test-case.js'),
    getTestCase = function(directory) { 
      return  new testCase.BundlerTestCase(
          directory,
          exec,
          runs,
          waitsFor,
          fs
      );
    };

  it("Concatenates individual files in a .bundle file"
     + "into a single minified bundle."
     , function() {

        var testCase = getTestCase(
          "combines-individual-js-files"
         );

        testCase.RunBundlerAndVerifyOutput();
  });  

  it("Compiles and Concatenates .mustache files", function() {
     var testCase = getTestCase("combines-mustache");
     testCase.RunBundlerAndVerifyOutput();
  });

  it("Compiles and Concatenates .mustache files with js files"
     , function() {
     var testCase = getTestCase("combines-mustache-and-js");
     testCase.RunBundlerAndVerifyOutput();
  });

  it("Folder option by default minifies, but does not bundle."
    , function() {

      var directory = "default-folder-option";
      var baseTestFile = "test-cases/" + directory + "/";
      var minShouldExist = false;
      var testCase = getTestCase(directory);

      testCase.VerifySetUp = function() {
	testCase.Console.log("Verify the min files are "
	  + (minShouldExist ? "" : "not ") + "in " + baseTestFile + "."
	);  
	var minFile1 = fs.existsSync(baseTestFile + "file1.min.js");
        expect(minFile1).toBe(minShouldExist);
	var minFile2 = fs.existsSync(baseTestFile + "file2.min.js");
        expect(minFile2).toBe(minShouldExist);
	var minFile3 = fs.existsSync(baseTestFile + "file3.min.js");
        expect(minFile3).toBe(minShouldExist);
      };

      testCase.VerifyBundle = function() { 
	minShouldExist = true;
        testCase.VerifySetUp();
	var bundleFile  = fs.existsSync(directory + "file3.min.js");
        expect(bundleFile).toBe(false);      
      };

      testCase.RunBundlerAndVerifyOutput();
  });
 
});
