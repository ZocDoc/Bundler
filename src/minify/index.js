var minifyCSS = require('./minify-css');
var minifyJS = require('./minify-js');
var processCode = require('../process-code');

module.exports = {
    css: processCode.with(minifyCSS),
    js: processCode.with(minifyJS)
};