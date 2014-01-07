var exec = require('child_process').exec,
      fs = require('fs'),
      bundleHasher = require('../../bundle-hash.js');

describe("Bundle Hashing Save Hashes To Disk: ", function() {

    var getHasher,
      fileSystem,
      objectOnDisk = { bundle1: "hash1", bundle2: "hash2" },
      outputdirectory = 'folder/folder/2',
      expectedContents = JSON.stringify(objectOnDisk),
      expectedFile = outputdirectory + '/' + bundleHasher.FILE_NAME;

  beforeEach(function () {

      fileSystem = {};
      fileSystem.writeFileSync = function () { };

      getHasher = function () {
          spyOn(fileSystem, 'writeFileSync').andCallThrough();
          var hash = new bundleHasher.BundleHasher(fileSystem);
          hash.HashCollection = objectOnDisk;
          return hash;
      };
  });

  it("Saves the file to the correct location.", function() {
      var hasher = getHasher();
      hasher.SaveFileHashesToDisk(outputdirectory);
      expect(fileSystem.writeFileSync).toHaveBeenCalledWith(expectedFile, expectedContents)
  });

  it("Correctly handles trailing slash for output file.", function () {
      var hasher = getHasher();
      hasher.SaveFileHashesToDisk(outputdirectory + '/');
      expect(fileSystem.writeFileSync).toHaveBeenCalledWith(expectedFile, expectedContents)
  });

  it("On file error, the error is thrown", function () {
      var exception = "an exception";
      fileSystem.writeFileSync = function () {
          console.log('throwing')
          throw exception;
      };

      var hasher = getHasher();
      try {
          hasher.SaveFileHashesToDisk(outputdirectory);
          throw "fail";
      }
      catch(err) {
          expect(err).toBe(exception);
      }
  });

});