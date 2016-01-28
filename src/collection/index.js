var ArrayCollection = require('./array-collection');
var StringCollection = require('./string-collection');
var LessImportCollection = require('./less-import-collection');
var BundleFileCollection = require('./bundle-file-collection');

module.exports = {
    createAbConfigs: function(abConfigs) {
        return new ArrayCollection(abConfigs);
    },
    createDebug: function(debug) {
        return new ArrayCollection(debug);
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