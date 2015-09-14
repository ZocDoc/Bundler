var _ = require('underscore'),
    utils = require('./utils.js');

var StringCollection = function(map) {
    this._map = _.extend({}, map);
};

StringCollection.prototype.add = function(bundleName, value) {
    var fileName = utils.getFileName(bundleName);

    this._map[fileName] = value;
};

StringCollection.prototype.get = function(fileName) {
    return this._map[fileName];
};

StringCollection.prototype.clear = function(bundleName) {
    var fileName = utils.getFileName(bundleName);

    if (this._map[fileName]) {
        delete this._map[fileName];
    }
};

StringCollection.prototype.toJSON = function() {
    return _.clone(this._map);
};

module.exports = StringCollection;