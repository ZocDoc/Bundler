var _ = require('underscore'),
    path = require('path'),
    styleguide = require('../styleguide'),
    StyleguideBundleError = require('./styleguide-bundle-error.js');

var BundleFileCollection = function(bundleFile) {
    this._bundleFile = path.resolve(bundleFile);
    this._isStyleguideBundle = styleguide.isStyleguideFile(bundleFile);
    this._files = [];
};

var isAbsolutePath = function(filePath) {
    return path.resolve(filePath) === path.normalize(filePath);
};

var resolvePath = function(bundleFile, filePath) {
    if (isAbsolutePath(filePath)) {
        return filePath;
    }

    return path.resolve(path.dirname(bundleFile), filePath);
};

BundleFileCollection.prototype.addFile = function(filePath) {
    var absolutePath = resolvePath(this._bundleFile, filePath);

    if (!this._isStyleguideBundle && styleguide.isStyleguideFile(absolutePath)) {
        throw new StyleguideBundleError(this._bundleFile, absolutePath);
    }

    this._files.push(filePath);
};

BundleFileCollection.prototype.toJSON = function() {
    return _.clone(this._files);
};

module.exports = BundleFileCollection;