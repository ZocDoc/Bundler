var pack = require('../../../../src/concat/requireify/pack-files');

describe('pack files', function() {

    var allFiles,
        deps,
        indices,
        exports,
        sourceMap,
        promise;

    beforeEach(function() {

        allFiles = {};
        deps = {};
        indices = {};
        exports = {};

        sourceMap = false;

    });

    describe('Given files without source maps and no dependencies', function() {

        beforeEach(function() {

            givenFile({
                index: 1,
                originalPath: 'C:\\foo\\bar.js',
                code: 'module.exports = 1;',
                deps: {}
            });
            givenFile({
                index: 2,
                originalPath: 'C:\\foo\\foo.js',
                code: 'module.exports = function(x) { return x * 2; };',
                deps: {}
            });
            givenExport('foo', 'C:\\foo\\foo.js');

        });

        describe('Given source maps disabled', function() {

            beforeEach(function() {

                packFiles();

            });

            it('Combines files.', function(done) {

                assertCodeIs(
                    '(function(){var ir=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module \'"+o+"\'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){\n' +
                    'module.exports = 1;\n' +
                    '},{}],2:[function(require,module,exports){\n' +
                    'module.exports = function(x) { return x * 2; };\n' +
                    '},{}]},{},[])\n' +
                    ';require=function(n){if(n===\'foo\')return ir(2);return ir(n,true)}}).call(this);',
                    done
                );

            });

            it('Does not produce source map.', function(done) {

                assertSourceMapIs(
                    undefined,
                    done
                );

            });

        });

        describe('Given source maps enabled', function() {

            beforeEach(function() {

                givenSourceMapsEnabled();

                packFiles();

            });

            it('Combines files.', function(done) {

                assertCodeIs(
                    '(function(){var ir=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module \'"+o+"\'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){\n' +
                    'module.exports = 1;\n' +
                    '},{}],2:[function(require,module,exports){\n' +
                    'module.exports = function(x) { return x * 2; };\n' +
                    '},{}]},{},[])\n' +
                    ';require=function(n){if(n===\'foo\')return ir(2);return ir(n,true)}}).call(this);',
                    done
                );

            });

            it('Produces source map.', function(done) {

                assertSourceMapIs(
                    {
                        version: 3,
                        sources: [ 'node_modules/browser-pack/_prelude.js', 'C:\\foo\\bar.js', 'C:\\foo\\foo.js' ],
                        names: [  ],
                        mappings: 'AAAA;ACAA;;ACAA',
                        file: 'generated.js',
                        sourceRoot: '',
                        sourcesContent: [
                            '(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module \'"+o+"\'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})',
                            'module.exports = 1;',
                            'module.exports = function(x) { return x * 2; };'
                        ]
                    },
                    done
                );

            });

        });

    });

    describe('Given files with source maps and dependencies', function() {

        beforeEach(function() {

            givenFile({
                index: 1,
                originalPath: 'C:\\foo\\bar.es6',
                code:
                    '"use strict";\n' +
                    '\n' +
                    'var bar = 2;\n' +
                    'module.exports = bar;',
                map: {
                    version: 3,
                    sources: [ 'C:\\foo\\bar.es6' ],
                    names: [  ],
                    mappings: ';;AAAA,IAAM,GAAG,GAAG,CAAC,CAAC;AACd,MAAM,CAAC,OAAO,GAAG,GAAG,CAAC',
                    file: 'unknown',
                    sourcesContent: [
                        'const bar = 2;\nmodule.exports = bar;'
                    ]
                },
                deps: {}
            });
            givenFile({
                index: 2,
                originalPath: 'C:\\foo\\foo.js',
                code: 'var bar = require(\'./bar\'); module.exports = function(x) { return x * bar; }',
                deps: {
                    './bar': {
                        name: 'C:\\foo\\bar.es6',
                        isPath: true
                    }
                }
            });
            givenExport('foo', 'C:\\foo\\foo.js');

        });

        describe('Given source maps disabled', function() {

            beforeEach(function() {

                packFiles();

            });

            it('Combines files.', function(done) {

                assertCodeIs(
                    '(function(){var ir=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module \'"+o+"\'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){\n' +
                    '"use strict";\n' +
                    '\n' +
                    'var bar = 2;\n' +
                    'module.exports = bar;\n' +
                    '},{}],2:[function(require,module,exports){\n' +
                    'var bar = require(\'./bar\'); module.exports = function(x) { return x * bar; }\n' +
                    '},{"./bar":1}]},{},[])\n' +
                    ';require=function(n){if(n===\'foo\')return ir(2);return ir(n,true)}}).call(this);',
                    done
                );

            });

            it('Does not produce source map.', function(done) {

                assertSourceMapIs(
                    undefined,
                    done
                );

            });

        });

        describe('Given source maps enabled', function() {

            beforeEach(function() {

                givenSourceMapsEnabled();

                packFiles();

            });

            it('Combines files.', function(done) {

                assertCodeIs(
                    '(function(){var ir=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module \'"+o+"\'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){\n' +
                    '"use strict";\n' +
                    '\n' +
                    'var bar = 2;\n' +
                    'module.exports = bar;\n' +
                    '\n' +
                    '},{}],2:[function(require,module,exports){\n' +
                    'var bar = require(\'./bar\'); module.exports = function(x) { return x * bar; }\n' +
                    '},{"./bar":1}]},{},[])\n' +
                    ';require=function(n){if(n===\'foo\')return ir(2);return ir(n,true)}}).call(this);',
                    done
                );

            });

            it('Produces source map.', function(done) {

                assertSourceMapIs(
                    {
                        version: 3,
                        sources: [ 'node_modules/browser-pack/_prelude.js', 'C:\\foo\\bar.es6', 'C:\\foo\\foo.js' ],
                        names: [  ],
                        mappings: 'AAAA;;;ACAA,IAAM,GAAG,GAAG,CAAC,CAAC;AACd,MAAM,CAAC,OAAO,GAAG,GAAG,CAAC;;;ACDrB',
                        file: 'generated.js',
                        sourceRoot: '',
                        sourcesContent: [
                            '(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module \'"+o+"\'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})',
                            'const bar = 2;\nmodule.exports = bar;',
                            'var bar = require(\'./bar\'); module.exports = function(x) { return x * bar; }'
                        ]
                    },
                    done
                );

            });

        });

    });

    it('Files with no exports are immediately invoked when loading the bundle.', function(done) {

        givenFile({
            index: 1,
            originalPath: 'C:\\foo\\file1.js',
            code: 'module.exports = 1;',
            deps: {}
        });
        givenFile({
            index: 2,
            originalPath: 'C:\\foo\\file2.js',
            code: 'exports = 2;',
            deps: {}
        });
        givenFile({
            index: 3,
            originalPath: 'C:\\foo\\file3.js',
            code: 'var x = 1;',
            deps: {}
        });
        givenFile({
            index: 4,
            originalPath: 'C:\\foo\\file4.js',
            code: 'exports.foo = 3;',
            deps: {}
        });
        givenExport('foo', 'C:\\foo\\file2.js');

        packFiles();

        assertCodeIs(
            '(function(){var ir=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module \'"+o+"\'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){\n' +
            'module.exports = 1;\n' +
            '},{}],2:[function(require,module,exports){\n' +
            'exports = 2;\n' +
            '},{}],3:[function(require,module,exports){\n' +
            'var x = 1;\n' +
            '},{}],4:[function(require,module,exports){\n' +
            'exports.foo = 3;\n' +
            '},{}]},{},[3])\n' +
            ';require=function(n){if(n===\'foo\')return ir(2);return ir(n,true)}}).call(this);',
            done
        );

    });

    var packFiles = function() {

        promise = pack({
            allFiles: allFiles,
            deps: deps,
            indices: indices,
            exports: exports,
            sourceMap: sourceMap
        });

    };

    var givenFile = function(file) {

        allFiles[file.originalPath] = {
            originalPath: file.originalPath,
            code: file.code,
            map: file.map
        };

        indices[file.originalPath] = file.index;

        deps[file.originalPath] = file.deps;

    };

    var givenExport = function(moduleName, filePath) {

        exports[moduleName] = filePath;

    };

    var givenSourceMapsEnabled = function() {

        sourceMap = true;

    };

    var assertCodeIs = function(expected, done) {

        promise.then(function(result) {
            expect(result.code).toEqual(expected);
            done();
        });

    };

    var assertSourceMapIs = function(expected, done) {

        promise.then(function(result) {
            expect(result.map).toEqual(expected);
            done();
        });

    };

});