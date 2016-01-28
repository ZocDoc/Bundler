var path = require('path');
var styleguide = require('../styleguide');
var ArrayCollection = require('./array-collection');
var LessImportError = require('../errors/less-import-error');

var isMixinFile = function(filePath) {
    return filePath.indexOf('mixin') > -1
        || path.basename(filePath) === 'normalize.less';
};

var validateStyleguideImports = function(filePath, lessImport) {
    filePath = path.resolve(filePath);
    lessImport = path.resolve(filePath, lessImport);

    if (styleguide.isStyleguideFile(filePath)) {
        return;
    }

    if (styleguide.isStyleguideFile(lessImport) && !isMixinFile(lessImport)) {
        throw new LessImportError(filePath, lessImport);
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