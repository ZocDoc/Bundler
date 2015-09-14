var _ = require('underscore'),
    path = require('path');

var ArrayCollection = function(map) {
    this._map = _.extend({}, map);
};

ArrayCollection.prototype.add = function(filePath, item) {
    var fileName = path.basename(filePath);

    if (!this._map[fileName]) {
        this._map[fileName] = [];
    }

    if (this._map[fileName].indexOf(item) < 0) {
        this._map[fileName].push(item);
    }
};

ArrayCollection.prototype.get = function(fileName) {
    return this._map[fileName] || [];
};

ArrayCollection.prototype.clear = function(filePath) {
    var fileName = path.basename(filePath);

    if (this._map[fileName]) {
        delete this._map[fileName];
    }
};

ArrayCollection.prototype.toJSON = function() {
    return _.clone(this._map);
};

module.exports = ArrayCollection;