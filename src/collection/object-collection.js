var Collection = require('./collection');
var _ = require('underscore');

var ObjectCollection = Collection.extend({

    add: function(filePath, item) {

        var key = this._getKey(filePath);

        if (!this._map[key]) {
            this._map[key] = {};
        }

        _.extend(this._map[key], item);

    },

    get: function(filePath) {

        var key = this._getKey(filePath);

        return this._map[key] || {};

    },

    clear: function(filePath) {

        var key = this._getKey(filePath);

        if (this._map[key]) {
            delete this._map[key];
        }

    }

});

module.exports = ObjectCollection;