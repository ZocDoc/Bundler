var testDirectory = 'require-test-suite';
var integrationTest = require('./helpers/jasmine-wrapper.js');
var test = new integrationTest.Test(integrationTest.TestType.Js, testDirectory);

test.describeIntegrationTest("Require bundles:", function() {

    beforeEach(function() {

        test.given.BundleOption('require');

        test.given.StagingDirectoryIs('staging-dir');
        test.given.OutputDirectoryIs('output-dir');

    });

    it('Given require option, requireifies js and mustache files in the staging bundle.', function() {

        test.given.FileToBundle('file1.js', 'var x = 2; module.exports = x;');
        test.given.FileToBundle('file2.js', 'var foo = require(\'./file1\'); var template = require(\'./file3\'); module.exports = function(x) { return template.render({ a: x * foo }); };');
        test.given.FileToBundle('file3.mustache', '<div> {{a}} </div>');
        test.given.FileToBundle('package.json', '{"name":"foo","main":"file2.js"}');

        test.actions.Bundle();

        test.assert.verifyFileAndContentsAre(
            test.given.StagingDirectory + '/testjs',
            'test.js',
            '(function(){var ir=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module \'"+o+"\'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){\n' +
            'var x = 2; module.exports = x;\n' +
            '},{}],2:[function(require,module,exports){\n' +
            'var foo = require(\'./file1\'); var template = require(\'./file3\'); module.exports = function(x) { return template.render({ a: x * foo }); };\n' +
            '},{"./file1":1,"./file3":3}],3:[function(require,module,exports){\n' +
            'var Hogan = require(\'hogan\');\n' +
            '\n' +
            'module.exports = new Hogan.Template({\n' +
            '    code: function(c,p,i){var _=this;_.b(i=i||"");_.b("<div> ");_.b(_.v(_.f("a",c,p,0)));_.b(" </div>");return _.fl();;},\n' +
            '    partials: {},\n' +
            '    subs: {}\n' +
            '});\n' +
            '},{"hogan":"hogan"}]},{},[])\n' +
            ';require=function(n){if(n===\'foo\')return ir(2);return ir(n,true)}}).call(this);'
        );

    });

    it('Given require option, requireifies js and mustache files in the bundle.', function() {

        test.given.FileToBundle('file1.js', 'var x = 2; module.exports = x;');
        test.given.FileToBundle('file2.js', 'var foo = require(\'./file1\'); var template = require(\'./file3\'); module.exports = function(x) { return template.render({ a: x * foo }); };');
        test.given.FileToBundle('file3.mustache', '<div> {{a}} </div>');
        test.given.FileToBundle('package.json', '{"name":"foo","main":"file2.js"}');

        test.actions.Bundle();

        test.assert.verifyBundleIs(
            '(function(){var ir=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module \'"+o+"\'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){\n' +
            'var x=2;module.exports=x;\n' +
            '},{}],2:[function(require,module,exports){\n' +
            'var foo=require("./file1"),template=require("./file3");module.exports=function(e){return template.render({a:e*foo})};\n' +
            '},{"./file1":1,"./file3":3}],3:[function(require,module,exports){\n' +
            'var Hogan=require("hogan");module.exports=new Hogan.Template({code:function(a,e,r){var n=this;return n.b(r=r||""),n.b("<div> "),n.b(n.v(n.f("a",a,e,0))),n.b(" </div>"),n.fl()},partials:{},subs:{}});\n' +
            '},{"hogan":"hogan"}]},{},[])\n' +
            ';require=function(n){if(n===\'foo\')return ir(2);return ir(n,true)}}).call(this);'
        );

    });

});
