var Collection = require('./collection');

var StringCollection = Collection.extend({

    add: function(filePath, value) {
        var key = this._getKey(filePath);

        this._map[key] = value;
    },

    get: function(fileName) {
        var key = this._getKey(fileName);

        return this._map[key];
    },

    clear: function(filePath) {
        var key = this._getKey(filePath);

        if (this._map[key]) {
            delete this._map[key];
        }
    }

});

module.exports = StringCollection;