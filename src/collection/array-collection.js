var _ = require('underscore'),
    Collection = require('./collection.js');

var ArrayCollection = function(map) {
    Collection.call(this, map);
};

_.extend(ArrayCollection.prototype, Collection.prototype);

ArrayCollection.prototype.add = function(filePath, item) {
    var key = this._getKey(filePath);

    if (!this._map[key]) {
        this._map[key] = [];
    }

    if (this._map[key].indexOf(item) < 0) {
        this._map[key].push(item);
    }
};

ArrayCollection.prototype.get = function(fileName) {
    var key = this._getKey(fileName);

    return this._map[key] || [];
};

ArrayCollection.prototype.clear = function(filePath) {
    var key = this._getKey(filePath);

    if (this._map[key]) {
        delete this._map[key];
    }
};

module.exports = ArrayCollection;