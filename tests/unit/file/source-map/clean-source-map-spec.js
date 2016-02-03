var clean = require('../../../../src/file/source-map/clean-source-map');

describe('clean source map', function() {

    var siteRoot,
        cleanedMap;

    beforeEach(function() {

        givenSiteRootIs('');

    });

    it('Given no source map, returns undefined.', function() {

        cleanSourceMap(undefined);

        assertCleanedMapIs(undefined);

    });

    it('Given source map with extra properties, only returns source map with version, sources, names, and mappings.', function() {

        cleanSourceMap({
            version: 3,
            sources: ['/foo.less', '/bar.less'],
            names: ['a', 'b'],
            mappings: ['AAAA', 'BBBB'],
            foo: 'bar',
            baz: true
        });

        assertCleanedMapIs({
            version: 3,
            sources: ['/foo.less', '/bar.less'],
            names: ['a', 'b'],
            mappings: ['AAAA', 'BBBB']
        });

    });
    
    it('Given sources with absolute paths, makes source paths relative to site root.', function() {
    
        givenSiteRootIs('C:\\foo\\bar');

        cleanSourceMap({
            version: 3,
            sources: ['C:\\foo\\bar\\test1.js', 'C:\\foo\\bar\\nested\\test2.js'],
            names: ['a', 'b'],
            mappings: ['AAAA', 'BBBB']
        });

        assertCleanedMapIs({
            version: 3,
            sources: ['/test1.js', '/nested/test2.js'],
            names: ['a', 'b'],
            mappings: ['AAAA', 'BBBB']
        });
    
    });
    
    it('Given source map with browser pack prelude source, does not alter browser pack prelude source path.', function() {

        cleanSourceMap({
            version: 3,
            sources: ['node_modules/browser-pack/_prelude.js', '/foo.js', '/bar.js'],
            names: ['a', 'b'],
            mappings: ['AAAA', 'BBBB']
        });

        assertCleanedMapIs({
            version: 3,
            sources: ['node_modules/browser-pack/_prelude.js', '/foo.js', '/bar.js'],
            names: ['a', 'b'],
            mappings: ['AAAA', 'BBBB']
        });
    
    });

    it('Given source map with browser pack prelude as first source, only includes browser pack prelucde source content.', function() {

        cleanSourceMap({
            version: 3,
            sources: ['node_modules/browser-pack/_prelude.js', '/foo.js', '/bar.js'],
            names: ['a', 'b'],
            mappings: ['AAAA', 'BBBB'],
            sourcesContent: [
                '(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module \'"+o+"\'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})',
                'var x = 1',
                'var y = 2'
            ]
        });

        assertCleanedMapIs({
            version: 3,
            sources: ['node_modules/browser-pack/_prelude.js', '/foo.js', '/bar.js'],
            names: ['a', 'b'],
            mappings: ['AAAA', 'BBBB'],
            sourcesContent: [
                '(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module \'"+o+"\'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})'
            ]
        });

    });

    var cleanSourceMap = function(map) {

        cleanedMap = clean(map, siteRoot);

    };

    var givenSiteRootIs = function(root) {

        siteRoot = root;

    };

    var assertCleanedMapIs = function(expected) {

        expect(cleanedMap).toEqual(expected);

    };

});