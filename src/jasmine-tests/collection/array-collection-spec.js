var path = require('path'),
    ArrayCollection = require('../../collection/array-collection.js');

describe('ArrayCollection', function() {

    var fileName = 'foo.css',
        filePath = 'C:/foo/bar/' + fileName,
        collection;

    beforeEach(function() {

        collection = new ArrayCollection();

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
            collection = new ArrayCollection(map);
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

        var item = 'a';
        
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

        var add = function() {
            collection.add(filePath, item);
        };

        var givenDifferentItemsPreviouslyAddedForFile = function() {
            collection.add(filePath, 'b');
        };

        var givenSameItemPreviouslyAddedForFile = function() {
            collection.add(filePath, item);
        };

        var assertItemWasAddedToEmptyFile = function() {
            expect(collection.toJSON()[fileName]).toEqual(['a']);
        };

        var assertItemWasAddedToExistingFile = function() {
            expect(collection.toJSON()[fileName]).toEqual(['b', 'a']);
        };

        var assertItemWasNotReaddedToFile = function() {
            expect(collection.toJSON()[fileName]).toEqual(['a']);
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

        var otherFileName = 'file2.js',
            otherFilePath = '../foo/bar/' + otherFileName;

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
            var expected = {};
            expected[otherFileName] = ['a'];
            expect(collection.toJSON()).toEqual(expected);
        };

    });

});