var exec = require('child_process').exec,
      fs = require('fs'),
      bundleHasher = require('../../bundle-hash.js');

describe("Bundle Hashing Load Hashes From Disk: ", function() {

    var getHasher,
      fileSystem,
      objectOnDisk = { bundle1: "hash1", bundle2: "hash2" },
      outputdirectory = 'folder/folder/2',
      expectedFile = outputdirectory + '/' + bundleHasher.FILE_NAME;

  beforeEach(function () {

      fileSystem = {};
      fileSystem.readFileSync = function () {
          return JSON.stringify(objectOnDisk);
      };

      getHasher = function () {
          spyOn(fileSystem, 'readFileSync').andCallThrough();
          return new bundleHasher.BundleHasher(fileSystem);
      };
  });

  it("Reads the file from the correct location.", function() {
      var hasher = getHasher();
      hasher.LoadFileHashFromDisk(outputdirectory);
      expect(fileSystem.readFileSync).toHaveBeenCalledWith(expectedFile, 'utf8')
  });

  it("Correctly handles trailing slash for input file.", function () {
      var hasher = getHasher();
      hasher.LoadFileHashFromDisk(outputdirectory + '/');
      expect(fileSystem.readFileSync).toHaveBeenCalledWith(expectedFile, 'utf8')
  });

  it("Parses the input file into json.", function () {
      var hasher = getHasher();
      hasher.LoadFileHashFromDisk(outputdirectory);
      
      expect(hasher.HashCollection.bundle1).toBe(objectOnDisk.bundle1);
      expect(hasher.HashCollection.bundle2).toBe(objectOnDisk.bundle2);
  });

  it("On file error, the hash collection is empty", function () {

      fileSystem.readFileSync = function () {
          throw "an exception";
      };

      var hasher = getHasher();
      hasher.LoadFileHashFromDisk(outputdirectory);

      expect(hasher.HashCollection.bundle1).toBe(undefined);
      expect(hasher.HashCollection.bundle2).toBe(undefined);
  });

});