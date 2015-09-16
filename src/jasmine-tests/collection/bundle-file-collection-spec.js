var BundleFileCollection = require('../../collection/bundle-file-collection.js');

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

        it('Given non-styleguide bundle and styleguide file, error is thrown.', function() {

            givenNonStyleguideBundle();
            givenStyleguideFile();

            expect(addFile).toThrow();

        });

        it('Given non-styleguide bundle and non-styleguide file, file is added.', function() {

            givenNonStyleguideBundle();
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

        var givenNonStyleguideBundle = function() {
            collection = new BundleFileCollection('C:/foo/bar/baz.css.bundle');
        };

        var givenStyleguideFile = function() {
            file = '../styleguide/foo.less';
        };

        var givenNonStyleguideFile = function() {
            file = '../bat/foo.less';
        };

        var assertFileWasAdded = function() {
            expect(collection.toJSON()).toContain(file);
        };

    });

});