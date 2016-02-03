var bundleStats = require('../../../src/bundle-stats.js'),
    collection = require('../../../src/collection');

describe("BundleStatsCollector - Adds files to the exports collection: ", function() {

    var stats;

    beforeEach(function () {

        stats = new bundleStats.BundleStatsCollector(null);

        stats.ExportsCollection = collection.createExports();

    });

    it('Given JSON file that\'s not package.json.', function() {

        stats.ParseJsonForStats('bundle1', 'C:\\foo\\bar\\baz.json', '{"name":"baz","description":"desc.","main":"foo.js"}');

        assertBundleExports('bundle1', {});

    });

    it('Given package.json file with no name field, doesn\'t add any exports.', function() {

        stats.ParseJsonForStats('bundle1', 'C:\\foo\\bar\\package.json', '{"description":"desc.","main":"foo.js"}');

        assertBundleExports('bundle1', {});

    });

    it('Given package.json file with no main field, doesn\'t add any exports.', function() {

        stats.ParseJsonForStats('bundle1', 'C:\\foo\\bar\\package.json', '{"name":"baz","description":"desc."}');

        assertBundleExports('bundle1', {});

    });

    it('Given package.json file with plain filename in main field, adds export.', function() {

        stats.ParseJsonForStats('bundle1', 'C:\\foo\\bar\\package.json', '{"name":"foo","description":"desc.","main":"foo.js"}');

        assertBundleExports('bundle1', {
            'C:\\foo\\bar\\foo.js': 'foo'
        });

    });

    it('Given package.json file with relative filepath in main field, adds export.', function() {

        stats.ParseJsonForStats('bundle1', 'C:\\foo\\bar\\package.json', '{"name":"foo","description":"desc.","main":"./foo.js"}');

        assertBundleExports('bundle1', {
            'C:\\foo\\bar\\foo.js': 'foo'
        });

    });

    it('Given package.json file with nested plain filename in main field, adds export.', function() {

        stats.ParseJsonForStats('bundle1', 'C:\\foo\\bar\\package.json', '{"name":"foo","description":"desc.","main":"bat/foo.js"}');

        assertBundleExports('bundle1', {
            'C:\\foo\\bar\\bat\\foo.js': 'foo'
        });

    });

    it('Given package.json file with relative nested filepath in main field, adds export.', function() {

        stats.ParseJsonForStats('bundle1', 'C:\\foo\\bar\\package.json', '{"name":"foo","description":"desc.","main":"./bat/foo.js"}');

        assertBundleExports('bundle1', {
            'C:\\foo\\bar\\bat\\foo.js': 'foo'
        });

    });

    it('Given package.json file with filepath in parent directory in main field, adds export.', function() {

        stats.ParseJsonForStats('bundle1', 'C:\\foo\\bar\\package.json', '{"name":"foo","description":"desc.","main":"../foo.js"}');

        assertBundleExports('bundle1', {
            'C:\\foo\\foo.js': 'foo'
        });

    });

    it('Given multiple package.json files, all exports are added.', function() {

        stats.ParseJsonForStats('bundle1', 'C:\\foo\\bar\\package.json', '{"name":"foo","description":"desc.","main":"foo.js"}');
        stats.ParseJsonForStats('bundle1', 'C:\\foo\\baz\\package.json', '{"name":"baz","description":"desc.","main":"blah/index.js"}');

        assertBundleExports('bundle1', {
            'C:\\foo\\bar\\foo.js': 'foo',
            'C:\\foo\\baz\\blah\\index.js': 'baz'
        });

    });

    it('Given multiple bundles with package.json files, all exports are added.', function() {

        stats.ParseJsonForStats('bundle1', 'C:\\foo\\bar\\package.json', '{"name":"foo","description":"desc.","main":"foo.js"}');
        stats.ParseJsonForStats('bundle2', 'C:\\foo\\baz\\package.json', '{"name":"baz","description":"desc.","main":"blah/index.js"}');

        assertBundleExports('bundle1', {
            'C:\\foo\\bar\\foo.js': 'foo'
        });

        assertBundleExports('bundle2', {
            'C:\\foo\\baz\\blah\\index.js': 'baz'
        });

    });

    var assertBundleExports = function(bundle, expected) {

        expect(stats.ExportsCollection.get(bundle)).toEqual(expected);

    };

});