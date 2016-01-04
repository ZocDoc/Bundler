var BundleFileCollection = require('../../../src/collection/bundle-file-collection.js');

describe('BundleFileCollection', function() {

    describe('addFile', function() {

        var collection,
            file;

        it('Given styleguide bundle and styleguide file, file is added.', function() {

            givenStyleguideBundle();
            givenStyleguideFile();

            addFile();

            assertFileWasAdded();

        });

        it('Given styleguide bundle and non-styleguide file, file is added.', function() {

            givenStyleguideBundle();
            givenNonStyleguideFile();

            addFile();

            assertFileWasAdded();

        });

        it('Given non-styleguide css bundle and styleguide file, error is thrown.', function() {

            givenNonStyleguideBundle('css');
            givenStyleguideFile();

            expect(addFile).toThrow();

        });

        it('Given non-styleguide css bundle and legacy styleguide file, file is added.', function() {

            givenNonStyleguideBundle('css');
            givenLegacyStyleguideFile();

            addFile();

            assertFileWasAdded();

        });

        it('Given non-styleguide css bundle and non-styleguide file, file is added.', function() {

            givenNonStyleguideBundle('css');
            givenNonStyleguideFile();

            addFile();

            assertFileWasAdded();

        });

        it('Given non-styleguide js bundle and styleguide file, file is added.', function() {

            givenNonStyleguideBundle('fs');
            givenStyleguideFile();

            addFile();

            assertFileWasAdded();

        });

        it('Given non-styleguide fs bundle and non-styleguide file, file is added.', function() {

            givenNonStyleguideBundle('fs');
            givenNonStyleguideFile();

            addFile();

            assertFileWasAdded();

        });

        var addFile = function() {
            collection.addFile(file);
        };

        var givenStyleguideBundle = function() {
            collection = new BundleFileCollection('C:/foo/bar/styleguide.css.bundle');
        };

        var givenNonStyleguideBundle = function(type) {
            collection = new BundleFileCollection('C:/foo/bar/baz.' + type + '.bundle');
        };

        var givenStyleguideFile = function() {
            file = '../styleguide/foo.less';
        };

        var givenLegacyStyleguideFile = function() {
            file = '../styleguide/legacy/foo.less';
        };

        var givenNonStyleguideFile = function() {
            file = '../bat/foo.less';
        };

        var assertFileWasAdded = function() {
            expect(collection.toJSON()).toContain(file);
        };

    });

});