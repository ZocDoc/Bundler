var _ = require('underscore'),
    Collection = require('./collection.js');

var StringCollection = function(map) {
    Collection.call(this, map);
};

_.extend(StringCollection.prototype, Collection.prototype);

StringCollection.prototype.add = function(filePath, value) {
    var key = this._getKey(filePath);

    this._map[key] = value;
};

StringCollection.prototype.get = function(fileName) {
    var key = this._getKey(fileName);

    return this._map[key];
};

StringCollection.prototype.clear = function(filePath) {
    var key = this._getKey(filePath);

    if (this._map[key]) {
        delete this._map[key];
    }
};

module.exports = StringCollection;