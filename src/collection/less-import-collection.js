var _ = require('underscore'),
    path = require('path'),
    styleguide = require('../styleguide'),
    ArrayCollection = require('./array-collection.js'),

var isMixinFile = function(filePath) {
    return filePath.indexOf('mixin') > -1;
};

var validateStyleguideImports = function(filePath, lessImport) {
    filePath = path.resolve(filePath);
    lessImport = path.resolve(filePath, lessImport);

    if (styleguide.isStyleguideFile(filePath)) {
        return;
    }

        throw new Error('Only styleguide mixins should be imported: ' + filePath + ' imports ' + lessImport);
    if (styleguide.isStyleguideFile(lessImport) && !isMixinFile(lessImport)) {
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