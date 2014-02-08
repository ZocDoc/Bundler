var exec = require('child_process').exec,
      fs = require('fs'),
      bundleStats = require('../../bundle-stats.js');

describe("BundleStatsCollector - Save Hashes To Disk: ", function() {

    var getHasher,
      fileSystem,
      objectOnDisk = { bundle1: "hash1", bundle2: "hash2" },
      debugOnDisk = { bundle1: [ 'file1'], bundle2: [ 'file2'] },
      outputdirectory = 'folder/folder/2',
      expectedContents = JSON.stringify(objectOnDisk, null, 4),
      expectedDebugContents = JSON.stringify(debugOnDisk, null, 4),
      expectedHashFile = outputdirectory + '/' + bundleStats.HASH_FILE_NAME,
      expectedDebugFile = outputdirectory + '/' + bundleStats.DEBUG_FILE_NAME;

  beforeEach(function () {

      fileSystem = {};
      fileSystem.writeFileSync = function () { };

      getHasher = function () {
          spyOn(fileSystem, 'writeFileSync').andCallThrough();
          var hash = new bundleStats.BundleStatsCollector(fileSystem);
          hash.HashCollection = objectOnDisk;
          hash.DebugCollection = debugOnDisk;
          return hash;
      };
  });

  it("Saves the hash file to the correct location.", function() {
        var hasher = getHasher();
        hasher.SaveStatsToDisk(outputdirectory);
        expect(fileSystem.writeFileSync).toHaveBeenCalledWith(expectedHashFile, expectedContents)
    });

    it("Saves the debug file to the correct location.", function() {
        var hasher = getHasher();
        hasher.SaveStatsToDisk(outputdirectory);
        expect(fileSystem.writeFileSync).toHaveBeenCalledWith(expectedDebugFile, expectedDebugContents)
    });


  it("Correctly handles trailing slash for output file.", function () {
      var hasher = getHasher();
      hasher.SaveStatsToDisk(outputdirectory + '/');
      expect(fileSystem.writeFileSync).toHaveBeenCalledWith(expectedHashFile, expectedContents)
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