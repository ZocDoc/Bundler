var compileES6 = require('./compile-es6');
var compileJSX = require('./compile-jsx');
var compileLESS = require('./compile-less');
var compileMustache = require('./compile-mustache');
var compileSASS = require('./compile-sass');
var processCode = require('../process-code');

module.exports = {
    es6: processCode.with(compileES6),
    jsx: processCode.with(compileJSX),
    less: processCode.with(compileLESS),
    mustache: processCode.with(compileMustache),
    sass: processCode.with(compileSASS)
};