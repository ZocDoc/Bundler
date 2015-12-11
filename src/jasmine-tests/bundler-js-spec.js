
describe("Javascript Bundling: ", function() {

  var exec = require('child_process').exec,
    fs = require('fs'),
    testCase = require('./bundler-test-case.js'),
    getTestCase = function(directory, outputDirectory) { 
      return  new testCase.BundlerTestCase(
          directory,
          ".js",
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


  it("Folder option by default minifies, but does not bundle.", function() {
      var testCase = getTestCase("default-folder-option");
      testCase.SetUpCacheFileTest(false);
      testCase.RunBundlerAndVerifyOutput();
  });
 
  it("The recursive option on a folder searches sub-directories.", function () {
      runTestCase("recursive-folder-js");
  });

  it("Folder option will bundle with force bundle option", function () {
      runTestCase("combines-folder-with-forcebundle");
  });

  it("If an output directory is specified, then the minified bundle is put in it.", function () {
      runTestCase("output-directory-js", "/folder-output/");
  });

  it("If an output directory is specified, then any computed files are put in it.", function () {
      var testCase = getTestCase("output-directory-js", "/folder-output/");
      testCase.SetUpCacheFileTest(true, ["file1.min", "file2.min"]);
      testCase.RunBundlerAndVerifyOutput();
  });

  it("If an output directory is specified, then the un-minified mustache files as .js are put in there..", function () {
      var testCase = getTestCase("output-directory-mustache", "/folder-output/");
      testCase.SetUpCacheFileTest(true, ["mustache1.min", "mustache2.min", "mustache1", "mustache2"]);
      testCase.RunBundlerAndVerifyOutput();
  });

});
