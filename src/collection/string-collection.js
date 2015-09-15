var _ = require('underscore'),
    path = require('path');

var StringCollection = function(map) {
    this._map = _.extend({}, map);
};

StringCollection.prototype.add = function(filePath, value) {
    var fileName = path.resolve(filePath);

    this._map[fileName] = value;
};

StringCollection.prototype.get = function(fileName) {
    return this._map[path.resolve(fileName)];
};

StringCollection.prototype.clear = function(filePath) {
    var fileName = path.resolve(filePath);

    if (this._map[fileName]) {
        delete this._map[fileName];
    }
};

StringCollection.prototype.toJSON = function() {
    return _.clone(this._map);
};

module.exports = StringCollection;