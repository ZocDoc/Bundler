var compileCSS = require('./compile-css');
var compileES6 = require('./compile-es6');
var compileJS = require('./compile-js');
var compileJSX = require('./compile-jsx');
var compileLESS = require('./compile-less');
var compileMustache = require('./compile-mustache');
var compileSASS = require('./compile-sass');

module.exports = {
    css: compileCSS,
    es6: compileES6,
    js: compileJS,
    jsx: compileJSX,
    less: compileLESS,
    mustache: compileMustache,
    sass: compileSASS
};