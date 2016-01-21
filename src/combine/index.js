var FileCombiner = require('./file-combiner');
var file = require('../file');

module.exports = {
    css: function css() {
        return new FileCombiner(file.type.CSS);
    },
    js: function js() {
        return new FileCombiner(file.type.JS);
    }
};