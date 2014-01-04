
describe("Javascript bundling tests", function() {

  var exec = require('child_process').exec,
    fs = require('fs'),
    testCase = require('./bundler-test-case.js'),
    getTestCase = function(directory) { 
      return  new testCase.BundlerTestCase(
          directory,
          ".js",
          exec,
          runs,
          waitsFor,
          fs
      );
    },
    runTestCase = function (directory, logToConsole) {
        var testCase = getTestCase(directory);

        if (logToConsole) {
            testCase.Console = console;
        }

        testCase.RunBundlerAndVerifyOutput();
    };

  it("Concatenates individual files in a .bundle file into a single minified bundle.", function() {
         runTestCase("combines-individual-js-files");
  });  

  it("Compiles and Concatenates .mustache files", function() {
      runTestCase("combines-mustache");
  });

  it("Compiles and Concatenates .mustache files with js files", function() {
      runTestCase("combines-mustache-and-js");
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
 
  it("The recursive option on a folder searches sub-directories.", function () {
      runTestCase("recursive-folder-js");
  });

  it("Folder option will bundle with force bundle option", function () {
      runTestCase("combines-folder-with-forcebundle");
  });

});
