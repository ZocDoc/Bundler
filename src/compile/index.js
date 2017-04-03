var compileES6 = require('./compile-es6');
var compileLESS = require('./compile-less');
var compileMustache = require('./compile-mustache');
var processCode = require('../process-code');
var file = require('../file');

module.exports = {
    es6: processCode.with(file.type.JS, compileES6),
    jsx: processCode.with(file.type.JS, compileES6),
    less: processCode.with(file.type.CSS, compileLESS),
    mustache: processCode.with(file.type.JS, compileMustache)
};
