var exec = require('child_process').exec,
    fs = require('fs'),
    bundleStats = require('../../../src/bundle-stats.js'),
    collection = require('../../../src/collection');

describe("BundleStatsCollector - Save Hashes To Disk: ", function() {

    var getStatsCollector,
      fileSystem,
      objectOnDisk = { bundle1: "hash1", bundle2: "hash2" },
      debugOnDisk = { bundle1: [ 'file1'], bundle2: [ 'file2'] },
      exportsOnDisk = { bundle1: { 'C:\\foo.js': 'foo' }, bundle2: { 'C:\\bar.js': 'bar' } },
      localizationOnDisk = { bundle1: [ 'localize1'], bundle2: [ 'localize2'] },
      abConfigOnDisk = { bundle1: ['config1'], bundle2: ['config2'] },
      importsOnDisk = { file1: ['import1'], file2: ['import2'] },
      outputdirectory = 'folder/folder/2',
      expectedContents = JSON.stringify(objectOnDisk, null, 4),
      expectedDebugContents = JSON.stringify(debugOnDisk, null, 4),
      expectedExportsContents = JSON.stringify(exportsOnDisk, null, 4),
      expectedLocalizationContents = JSON.stringify(localizationOnDisk, null, 4),
      expectedAbConfigContents = JSON.stringify(abConfigOnDisk, null, 4),
      expectedLessImportContents = JSON.stringify(importsOnDisk, null, 4),
      expectedHashFile = outputdirectory + '/' + bundleStats.HASH_FILE_NAME,
      expectedDebugFile = outputdirectory + '/' + bundleStats.DEBUG_FILE_NAME,
      expectedExportsFile = outputdirectory + '/' + bundleStats.EXPORTS_FILE_NAME,
      expectedLocalizationFile = outputdirectory + '/' + bundleStats.LOCALIZATION_FILE_NAME,
      expectedAbConfigFile = outputdirectory + '/' + bundleStats.AB_FILE_NAME,
      expectedLessImportFile = outputdirectory + '/' + bundleStats.LESS_IMPORTS_FILE;

  beforeEach(function () {

      fileSystem = {};
      fileSystem.writeFileSync = function () { };

      getStatsCollector = function () {
          spyOn(fileSystem, 'writeFileSync').andCallThrough();
          var hash = new bundleStats.BundleStatsCollector(fileSystem);
          hash.HashCollection = collection.createHash(objectOnDisk);
          hash.DebugCollection = collection.createDebug(debugOnDisk);
          hash.ExportsCollection = collection.createExports(exportsOnDisk);
          hash.LocalizedStrings = collection.createLocalizedStrings(localizationOnDisk);
          hash.AbConfigs = collection.createAbConfigs(abConfigOnDisk);
          hash.LessImports = collection.createLessImports(importsOnDisk);
          return hash;
      };
  });

  it("Saves the hash file to the correct location.", function() {
        var stats = getStatsCollector();
        stats.SaveStatsToDisk(outputdirectory);
        expect(fileSystem.writeFileSync).toHaveBeenCalledWith(expectedHashFile, expectedContents)
    });

    it("Saves the debug file to the correct location.", function() {
        var stats = getStatsCollector();
        stats.SaveStatsToDisk(outputdirectory);
        expect(fileSystem.writeFileSync).toHaveBeenCalledWith(expectedDebugFile, expectedDebugContents)
    });

    it("Saves the exports file to the correct location.", function() {
        var stats = getStatsCollector();
        stats.SaveStatsToDisk(outputdirectory);
        expect(fileSystem.writeFileSync).toHaveBeenCalledWith(expectedExportsFile, expectedExportsContents);
    });

    it("Saves the localization file to the correct location.", function() {
        var stats = getStatsCollector();
        stats.SaveStatsToDisk(outputdirectory);
        expect(fileSystem.writeFileSync).toHaveBeenCalledWith(expectedLocalizationFile, expectedLocalizationContents)
    });

    it("Saves the imports file to the correct location.", function () {
        var stats = getStatsCollector();
        stats.SaveStatsToDisk(outputdirectory);
        expect(fileSystem.writeFileSync).toHaveBeenCalledWith(expectedLessImportFile, expectedLessImportContents)
    });

    it("Saves the ab config file to the correct location.", function() {
        var stats = getStatsCollector();
        stats.SaveStatsToDisk(outputdirectory);
        expect(fileSystem.writeFileSync).toHaveBeenCalledWith(expectedAbConfigFile, expectedAbConfigContents)
    });

  it("Correctly handles trailing slash for output file.", function () {
      var stats = getStatsCollector();
      stats.SaveStatsToDisk(outputdirectory + '/');
      expect(fileSystem.writeFileSync).toHaveBeenCalledWith(expectedHashFile, expectedContents)
  });

  it("On file error, the error is thrown", function () {
      var exception = "an exception";
      fileSystem.writeFileSync = function () {
          throw exception;
      };

      var stats = getStatsCollector();
      try {
          stats.SaveStatsToDisk(outputdirectory);
          throw "fail";
      }
      catch(err) {
          expect(err).toBe(exception);
      }
  });

    describe('given file saving with prefix', function() {

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

        it("Saves the hash file to the correct location.", function() {
            stats.SaveStatsToDisk(outputdirectory);
            expect(fileSystem.writeFileSync).toHaveBeenCalledWith(expectedHashFile, expectedContents)
        });

        it("Saves the debug file to the correct location.", function() {
            stats.SaveStatsToDisk(outputdirectory);
            expect(fileSystem.writeFileSync).toHaveBeenCalledWith(expectedDebugFile, expectedDebugContents)
        });

        it("Saves the exports file to the correct location.", function() {
            stats.SaveStatsToDisk(outputdirectory);
            expect(fileSystem.writeFileSync).toHaveBeenCalledWith(expectedExportsFile, expectedExportsContents);
        });

        it("Saves the localization file to the correct location.", function() {
            stats.SaveStatsToDisk(outputdirectory);
            expect(fileSystem.writeFileSync).toHaveBeenCalledWith(expectedLocalizationFile, expectedLocalizationContents)
        });

        it("Saves the imports file to the correct location.", function () {
            stats.SaveStatsToDisk(outputdirectory);
            expect(fileSystem.writeFileSync).toHaveBeenCalledWith(expectedLessImportFile, expectedLessImportContents)
        });

        it("Saves the ab config file to the correct location.", function() {
            stats.SaveStatsToDisk(outputdirectory);
            expect(fileSystem.writeFileSync).toHaveBeenCalledWith(expectedAbConfigFile, expectedAbConfigContents)
        });

    });

});