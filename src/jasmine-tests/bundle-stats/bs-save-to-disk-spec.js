var exec = require('child_process').exec,
      fs = require('fs'),
      bundleStats = require('../../bundle-stats.js');

describe("BundleStatsCollector - Save Hashes To Disk: ", function() {

    var getHasher,
      fileSystem,
      objectOnDisk = { bundle1: "hash1", bundle2: "hash2" },
      outputdirectory = 'folder/folder/2',
      expectedContents = JSON.stringify(objectOnDisk),
      expectedFile = outputdirectory + '/' + bundleStats.HASH_FILE_NAME;

  beforeEach(function () {

      fileSystem = {};
      fileSystem.writeFileSync = function () { };

      getHasher = function () {
          spyOn(fileSystem, 'writeFileSync').andCallThrough();
          var hash = new bundleStats.BundleStatsCollector(fileSystem);
          hash.HashCollection = objectOnDisk;
          return hash;
      };
  });

  it("Saves the file to the correct location.", function() {
      var hasher = getHasher();
      hasher.SaveStatsToDisk(outputdirectory);
      expect(fileSystem.writeFileSync).toHaveBeenCalledWith(expectedFile, expectedContents)
  });

  it("Correctly handles trailing slash for output file.", function () {
      var hasher = getHasher();
      hasher.SaveStatsToDisk(outputdirectory + '/');
      expect(fileSystem.writeFileSync).toHaveBeenCalledWith(expectedFile, expectedContents)
  });

  it("On file error, the error is thrown", function () {
      var exception = "an exception";
      fileSystem.writeFileSync = function () {
          throw exception;
      };

      var hasher = getHasher();
      try {
          hasher.SaveStatsToDisk(outputdirectory);
          throw "fail";
      }
      catch(err) {
          expect(err).toBe(exception);
      }
  });

});