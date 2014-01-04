
describe("Css bundling tests", function() {

  var exec = require('child_process').exec,
    fs = require('fs'),
    testCase = require('./bundler-test-case.js'),
    getTestCase = function(directory, outputDirectory) { 
      return  new testCase.BundlerTestCase(
          directory,
          ".css",
          outputDirectory,
          exec,
          runs,
          waitsFor,
          fs
      );
    },
    runTestCase = function (
        directory,
        outputDirectory,
        logToConsole
    ) {
        var testCase = getTestCase(directory, outputDirectory);

        if (logToConsole) {
            testCase.Console = console;
        }

        testCase.RunBundlerAndVerifyOutput();
    };

  it("Concatenates individual css files in a .bundle file into a single minified bundle.", function() {
         runTestCase("combines-individual-css-files");
  });  

  it("Compiles and Concatenates .less files", function() {
      runTestCase("combines-less");
  });

  it("Compiles and Concatenates .less files with css files", function() {
      runTestCase("combines-less-and-css");
  });

  it("Folder option by default minifies, but does not bundle."
    , function() {

        var directory = "default-folder-option-css";
        var baseTestFile = "test-cases/" + directory + "/";
        var minShouldExist = false;
        var testCase = getTestCase(directory);

        testCase.VerifySetUp = function() {
            testCase.Console.log("Verify the min files are "
	            + (minShouldExist ? "" : "not ") + "in " + baseTestFile + "."
            );

            var minFile1 = fs.existsSync(baseTestFile + "file1.min.css");
                expect(minFile1).toBe(minShouldExist);
            var minFile2 = fs.existsSync(baseTestFile + "file2.min.css");
                expect(minFile2).toBe(minShouldExist);
            var minFile3 = fs.existsSync(baseTestFile + "file3.min.css");
                expect(minFile3).toBe(minShouldExist);
        };

        testCase.VerifyBundle = function() { 
        minShouldExist = true;
            testCase.VerifySetUp();
            var bundleFile  = fs.existsSync(directory + "file3.min.css");
            expect(bundleFile).toBe(false);      
        };

        testCase.RunBundlerAndVerifyOutput();
  });
 
  it("The recursive option on a folder searches sub-directories", function () {
      runTestCase("recursive-folder-css");
  });

  it("The directory option allows entire subdirectories to be included", function () {
      runTestCase("directory-source-css");
  });

  it("Folder option will bundle with force bundle option", function () {
      runTestCase("combines-css-folder-with-forcebundle");
  });

  it("If an output directory is specified, then the minified bundle is put in it.", function () {
      runTestCase("output-directory-css", "/folder-output/");
  });

});
