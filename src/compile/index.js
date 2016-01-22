var compileES6 = require('./compile-es6');
var compileJSX = require('./compile-jsx');
var compileLESS = require('./compile-less');
var compileMustache = require('./compile-mustache');
var compileSASS = require('./compile-sass');

module.exports = {
    es6: compileES6,
    jsx: compileJSX,
    less: compileLESS,
    mustache: compileMustache,
    sass: compileSASS
};