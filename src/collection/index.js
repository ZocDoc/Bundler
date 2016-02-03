var ArrayCollection = require('./array-collection');
var StringCollection = require('./string-collection');
var ObjectCollection = require('./object-collection');
var LessImportCollection = require('./less-import-collection');
var BundleFileCollection = require('./bundle-file-collection');

module.exports = {
    createAbConfigs: function(abConfigs) {
        return new ArrayCollection(abConfigs);
    },
    createDebug: function(debug) {
        return new ArrayCollection(debug);
    },
    createExports: function(exports) {
        return new ObjectCollection(exports);
    },
    createHash: function(hash) {
        return new StringCollection(hash);
    },
    createLessImports: function(lessImports) {
        return new LessImportCollection(lessImports);
    },
    createLocalizedStrings: function(localizedStrings) {
        return new ArrayCollection(localizedStrings);
    },
    createBundleFiles: function(bundleFile) {
        return new BundleFileCollection(bundleFile);
    }
};