var ArrayCollection = require('./array-collection.js');
var StringCollection = require('./string-collection.js');
var LessImportCollection = require('./less-import-collection.js');

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
    }
};