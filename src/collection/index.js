var ArrayCollection = require('./array-collection.js');
var StringCollection = require('./string-collection.js');

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
        return new ArrayCollection(lessImports);
    },
    createLocalizedStrings: function(localizedStrings) {
        return new ArrayCollection(localizedStrings);
    }
};