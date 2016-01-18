var minifyCSS = require('./minify-css');
var minifyJS = require('./minify-js');
var processCode = require('../process-code');
var file = require('../file');

module.exports = {
    css: processCode.with(file.type.CSS, minifyCSS),
    js: processCode.with(file.type.JS, minifyJS)
};