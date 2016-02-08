var exec = require('child_process').exec,
    fs = require('fs'),
    bundleStats = require('../../../src/bundle-stats.js');

describe("BundleStatsCollector - Load Hashes From Disk: ", function() {

    var getStatsCollector,
      fileSystem,
      objectOnDisk = { bundle1: "hash1", bundle2: "hash2" },
      outputdirectory = 'folder/folder/2',
      expectedHashFile = outputdirectory + '/' + bundleStats.HASH_FILE_NAME,
      expectedDebugFile = outputdirectory + '/' + bundleStats.DEBUG_FILE_NAME,
      expectedExportsFile = outputdirectory + '/' + bundleStats.EXPORTS_FILE_NAME,
      expectedAbConfigFile = outputdirectory + '/' + bundleStats.AB_FILE_NAME,
      expectedLocalizationFile = outputdirectory + '/' + bundleStats.LOCALIZATION_FILE_NAME,
      expectedLessImportFile = outputdirectory + '/' + bundleStats.LESS_IMPORTS_FILE;

  beforeEach(function () {

      fileSystem = {};
      fileSystem.readFileSync = function () {
          return JSON.stringify(objectOnDisk);
      };

      getStatsCollector = function () {
          spyOn(fileSystem, 'readFileSync').andCallThrough();
          return new bundleStats.BundleStatsCollector(fileSystem);
      };
  });


  it("Reads the hash file from the correct location.", function() {
      var stats = getStatsCollector();
      stats.LoadStatsFromDisk(outputdirectory);
      expect(fileSystem.readFileSync).toHaveBeenCalledWith(expectedHashFile, 'utf8')
  });

    it("Reads the debug file from the correct location.", function() {
        var stats = getStatsCollector();
        stats.LoadStatsFromDisk(outputdirectory);
        expect(fileSystem.readFileSync).toHaveBeenCalledWith(expectedDebugFile, 'utf8')
    });

    it("Reads the exports file from the correct location.", function() {
        var stats = getStatsCollector();
        stats.LoadStatsFromDisk(outputdirectory);
        expect(fileSystem.readFileSync).toHaveBeenCalledWith(expectedExportsFile, 'utf8')
    });

    it("Reads the localization file from the correct location.", function() {
        var stats = getStatsCollector();
        stats.LoadStatsFromDisk(outputdirectory);
        expect(fileSystem.readFileSync).toHaveBeenCalledWith(expectedLocalizationFile, 'utf8')
    });

    it("Reads the less imports file from the correct location.", function () {
        var stats = getStatsCollector();
        stats.LoadStatsFromDisk(outputdirectory);
        expect(fileSystem.readFileSync).toHaveBeenCalledWith(expectedLessImportFile, 'utf8')
    });

    it("Reads the ab config file from the correct location.", function() {
        var stats = getStatsCollector();
        stats.LoadStatsFromDisk(outputdirectory);
        expect(fileSystem.readFileSync).toHaveBeenCalledWith(expectedAbConfigFile, 'utf8')
    });

  it("Correctly handles trailing slash for input file.", function () {
      var stats = getStatsCollector();
      stats.LoadStatsFromDisk(outputdirectory + '/');
      expect(fileSystem.readFileSync).toHaveBeenCalledWith(expectedHashFile, 'utf8')
  });

  it("Parses the input file into json.", function () {
      var stats = getStatsCollector();
      stats.LoadStatsFromDisk(outputdirectory);
      
      expect(stats.HashCollection.get('bundle1')).toBe(objectOnDisk.bundle1);
      expect(stats.HashCollection.get('bundle2')).toBe(objectOnDisk.bundle2);
  });

  it("On file error, the hash collection is empty", function () {

      fileSystem.readFileSync = function () {
          throw "an exception";
      };

      var stats = getStatsCollector();
      stats.LoadStatsFromDisk(outputdirectory);

      expect(stats.HashCollection.get('bundle1')).toBeUndefined();
      expect(stats.HashCollection.get('bundle2')).toBeUndefined();
  });

  describe('given file loading with prefix', function() {

      var prefix = 'a-prefix', stats = null;

      beforeEach(function(){

          stats = getStatsCollector();
          stats.setFilePrefix(prefix);

          expectedHashFile = outputdirectory + '/' + prefix + bundleStats.HASH_FILE_NAME;
          expectedDebugFile = outputdirectory + '/' + prefix + bundleStats.DEBUG_FILE_NAME;
          expectedExportsFile = outputdirectory + '/' + prefix + bundleStats.EXPORTS_FILE_NAME;
          expectedAbConfigFile = outputdirectory + '/' + prefix + bundleStats.AB_FILE_NAME;
          expectedLocalizationFile = outputdirectory + '/' + prefix + bundleStats.LOCALIZATION_FILE_NAME;
          expectedLessImportFile = outputdirectory + '/' + prefix + bundleStats.LESS_IMPORTS_FILE;
      });

      it("Reads the hash file from the correct location.", function() {
          stats.LoadStatsFromDisk(outputdirectory);
          expect(fileSystem.readFileSync).toHaveBeenCalledWith(expectedHashFile, 'utf8')
      });

      it("Reads the debug file from the correct location.", function() {
          stats.LoadStatsFromDisk(outputdirectory);
          expect(fileSystem.readFileSync).toHaveBeenCalledWith(expectedDebugFile, 'utf8')
      });

      it("Reads the exports file from the correct location.", function() {
          stats.LoadStatsFromDisk(outputdirectory);
          expect(fileSystem.readFileSync).toHaveBeenCalledWith(expectedExportsFile, 'utf8')
      });

      it("Reads the localization file from the correct location.", function() {
          stats.LoadStatsFromDisk(outputdirectory);
          expect(fileSystem.readFileSync).toHaveBeenCalledWith(expectedLocalizationFile, 'utf8')
      });

      it("Reads the less imports file from the correct location.", function () {
          stats.LoadStatsFromDisk(outputdirectory);
          expect(fileSystem.readFileSync).toHaveBeenCalledWith(expectedLessImportFile, 'utf8')
      });

      it("Reads the ab config file from the correct location.", function() {
          stats.LoadStatsFromDisk(outputdirectory);
          expect(fileSystem.readFileSync).toHaveBeenCalledWith(expectedAbConfigFile, 'utf8')
      });

  });

});