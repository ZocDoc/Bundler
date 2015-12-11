
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

});
