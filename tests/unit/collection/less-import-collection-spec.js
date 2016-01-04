var path = require('path'),
    LessImportCollection = require('../../../src/collection/less-import-collection.js');

describe('LessImportCollection', function() {

    var filePath = 'C:\\foo\\bar\\foo.css',
        collection;

    beforeEach(function() {

        collection = new LessImportCollection();

    });

    describe('ctor', function() {

        var map;

        it('Given no map, creates empty collection.', function() {

            givenNoMap();

            ctor();

            assertEmptyCollectionWasCreated();

        });

        it('Given map, creates collection with all properties from map.', function() {

            givenMap();

            ctor();

            assertCollectionWasCreatedWithAllPropertiesFromMap();

        });

        var ctor = function() {
            collection = new LessImportCollection(map);
        };

        var givenNoMap = function() {
            map = undefined;
        };

        var givenMap = function() {
            map = {
                foo: ['a', 'b', 'c']
            }
        };

        var assertEmptyCollectionWasCreated = function() {
            expect(collection.toJSON()).toEqual({});
        };

        var assertCollectionWasCreatedWithAllPropertiesFromMap = function() {
            expect(collection.toJSON()).toEqual(map);
        };

    });

    describe('add', function() {

        var lessFile,
            lessImport;

        beforeEach(function() {

            lessFile = filePath;
            lessImport = 'a';

        });
        
        it('Given no items previously added for file, adds item to file.', function() {
        
            add();

            assertItemWasAddedToEmptyFile();
        
        });

        it('Given different items previously added for file, adds item to file.', function() {

            givenDifferentItemsPreviouslyAddedForFile();

            add();

            assertItemWasAddedToExistingFile();

        });

        it('Given same item previously added for file, does not re-add item to file.', function() {

            givenSameItemPreviouslyAddedForFile();

            add();

            assertItemWasNotReaddedToFile();

        });
        
        it('Given styleguide file imports another styleguide file, import is added.', function() {
        
            givenStyleguideFile();
            givenStyleguideImport();

            add();

            assertImportWasAddedForFile();
        
        });

        it('Given styleguide file imports a styleguide mixin, import is added.', function() {

            givenStyleguideFile();
            givenStyleguideMixinImport();

            add();

            assertImportWasAddedForFile();

        });

        it('Given styleguide file imports a styleguide normalize file, import is added.', function() {

            givenStyleguideFile();
            givenStyleguideNormalizeImport();

            add();

            assertImportWasAddedForFile();

        });

        it('Given non-styleguide file imports a styleguide file, error is thrown.', function() {

            givenNonStyleguideFile();
            givenStyleguideImport();

            expect(add).toThrow();

        });

        it('Given non-styleguide file imports a styleguide mixin, import is added.', function() {

            givenNonStyleguideFile();
            givenStyleguideMixinImport();

            add();

            assertImportWasAddedForFile();

        });

        it('Given non-styleguide file imports a non-styleguide file, import is added.', function() {

            givenNonStyleguideFile();
            givenNonStyleguideImport();

            add();

            assertImportWasAddedForFile();

        });

        var add = function() {
            collection.add(lessFile, lessImport);
        };

        var givenStyleguideFile = function() {
            lessFile = 'C:\\foo\\styleguide\\bar.less';
        };

        var givenNonStyleguideFile = function() {
            lessFile = 'C:\\foo\\bar.less';
        };

        var givenStyleguideImport = function() {
            lessImport = '../../styleguide/foo.less';
        };

        var givenStyleguideMixinImport = function() {
            lessImport = '../../styleguide/foo.mixin.less';
        };

        var givenStyleguideNormalizeImport = function() {
            lessImport = '../../styleguide/ui/normalize.less';
        };

        var givenNonStyleguideImport = function() {
            lessImport = '../../foo.less';
        };

        var givenDifferentItemsPreviouslyAddedForFile = function() {
            collection.add(filePath, 'b');
        };

        var givenSameItemPreviouslyAddedForFile = function() {
            collection.add(filePath, lessImport);
        };

        var assertItemWasAddedToEmptyFile = function() {
            expect(collection.toJSON()[filePath]).toEqual(['a']);
        };

        var assertItemWasAddedToExistingFile = function() {
            expect(collection.toJSON()[filePath]).toEqual(['b', 'a']);
        };

        var assertItemWasNotReaddedToFile = function() {
            expect(collection.toJSON()[filePath]).toEqual(['a']);
        };

        var assertImportWasAddedForFile = function() {
            expect(collection.toJSON()[lessFile]).toEqual([lessImport]);
        };

    });

    describe('get', function() {

        var items;

        it('Given no items added for file, returns empty array.', function() {

            get();

            assertEmptyArrayWasReturned();

        });

        it('Given items added for file, returns items for file.', function() {

            givenItemsAddedToFile();

            get();

            assertItemsForFileWereReturned();

        });

        var get = function() {
            items = collection.get(filePath);
        };

        var givenItemsAddedToFile = function() {
            collection.add(filePath, 'a');
            collection.add(filePath, 'b');
        };

        var assertEmptyArrayWasReturned = function() {
            expect(items).toEqual([]);
        };

        var assertItemsForFileWereReturned = function() {
            expect(items).toEqual(['a', 'b']);
        };

    });

    describe('clear', function() {

        var otherFilePath = 'C:\\foo\\bar\\file2.js.file';

        beforeEach(function() {

            collection.add(otherFilePath, 'a');

        });

        it('Given no items added for file, does nothing.', function() {

            clear();

            assertNothingWasCleared();

        });

        it('Given items added for file, removes items for file.', function() {

            givenItemsAddedForFile();

            clear();

            assertItemsForFileWereRemoved();

        });

        var clear = function() {
            collection.clear(filePath);
        };

        var givenItemsAddedForFile = function() {
            collection.add(filePath, 'a');
        };

        var assertNothingWasCleared = function() {
            assertItemsForFileWereRemoved();
        };

        var assertItemsForFileWereRemoved = function() {
            expect(collection.toJSON()).toEqual({
                'C:\\foo\\bar\\file2.js.file': ['a']
            });
        };

    });

});