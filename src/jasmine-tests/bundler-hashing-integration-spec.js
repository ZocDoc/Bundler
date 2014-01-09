
describe("Integration Tests for Bundle Hashing: ", function() {

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
          test.CommandOptions = ' -computefilehashes:true -outputdirectory:test-cases/bundle-hashing/folder-output';
      }

      return test;
    };

  it("No hash is computed if the option is not specified.", function () {
      var test = getTestCase("bundle-hashing", "/folder-output/", false);
      test.SetUpHashTest(false);
      test.RunBundlerAndVerifyOutput();
  });

  it("The hash options computes a hash for all bundles and puts it in the output directory.", function () {
      var test = getTestCase("bundle-hashing", "/folder-output/", true);
      test.SetUpHashTest(true);
      test.RunBundlerAndVerifyOutput();
  });

});
