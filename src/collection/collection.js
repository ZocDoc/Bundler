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

var extend = function(parent) {
    return function(child) {
        var impl = function(map) {
            parent.call(this, map);
        };

        _.extend(impl.prototype, parent.prototype, child);

        impl.extend = extend(impl);

        return impl;
    };
};

Collection.extend = extend(Collection);

module.exports = Collection;