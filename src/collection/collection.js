var _ = require('underscore'),
    path = require('path');

var Collection = function(map) {
    this._map = _.extend({}, map);
};

Collection.prototype._getKey = function(filePath) {
    return path.basename(filePath);
};

Collection.prototype.toJSON = function() {
    return _.clone(this._map);
};

module.exports = Collection;