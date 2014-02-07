
describe("Integration Tests for Bundle Stats Collecting - ", function() {

  var exec = require('child_process').exec,
    fs = require('fs'),
    testCase = require('./bundler-test-case.js'),
    getTestCase = function(directory, outputDirectory, bundle) { 
      var test =  new testCase.BundlerTestCase(
          directory,
          ".js",
          outputDirectory,
          exec,
          runs,
          waitsFor,
          fs
      );
      if (bundle) {
          test.CommandOptions = ' -outputbundlestats:true -outputdirectory:test-cases/' + directory + '/folder-output';
      }

      return test;
    };

    describe("Hashing: ", function() {

          it(" hashes not computed if the option is not specified.", function () {
              var test = getTestCase("bundle-hashing", "/folder-output/", false);
              test.SetUpHashTest(false);
              test.RunBundlerAndVerifyOutput();
          });

          it("The stats option computes a hash for all bundles and puts it in the output directory.", function () {
              var test = getTestCase("bundle-hashing", "/folder-output/", true);
              test.SetUpHashTest(true);
              test.RunBundlerAndVerifyOutput();
          });
    });

    describe("Debug Files: ", function() {

        it("No debug files are computed if the option is not specified.", function () {
            var test = getTestCase("bundle-debug-files", "/folder-output/", false);
            test.SetUpDebugFileTest(false);
            test.RunBundlerAndVerifyOutput();
        });

        it("The stats option computes a collection of files for all bundles and puts it in the output directory.", function () {
            var test = getTestCase("bundle-debug-files", "/folder-output/", true);
            test.SetUpDebugFileTest(true);
            test.RunBundlerAndVerifyOutput();
        });
    });

});
