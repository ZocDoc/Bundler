var clean = require('../../../../../src/tasks/file/source-map/clean-source-map');

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