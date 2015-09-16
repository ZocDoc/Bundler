var _ = require('underscore'),
    path = require('path'),
    ArrayCollection = require('./array-collection.js');

var isStyleguideFile = function(filePath) {
    return filePath.indexOf('styleguide') > -1;
};

var isMixinFile = function(filePath) {
    return filePath.indexOf('mixin') > -1;
};

var validateStyleguideImports = function(filePath, lessImport) {
    filePath = path.resolve(filePath);
    lessImport = path.resolve(filePath, lessImport);

    if (isStyleguideFile(filePath)) {
        return;
    }

    if (isStyleguideFile(lessImport) && !isMixinFile(lessImport)) {
        throw new Error('Only styleguide mixins should be imported: ' + filePath + ' imports ' + lessImport);
    }
};

var LessImportCollection = ArrayCollection.extend({

    _getKey: function(filePath) {
        return path.resolve(filePath);
    },

    add: function(filePath, lessImport) {
        validateStyleguideImports(filePath, lessImport);
        ArrayCollection.prototype.add.call(this, filePath, lessImport);
    }

});

module.exports = LessImportCollection;