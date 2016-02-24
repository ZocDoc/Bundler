var path = require('path'),
    ObjectCollection = require('../../../src/collection/object-collection.js');

describe('ObjectCollection', function() {

    var fileName = 'foo.css',
        filePath = 'C:/foo/bar/' + fileName,
        collection;

    beforeEach(function() {

        collection = new ObjectCollection();

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
            collection = new ObjectCollection(map);
        };

        var givenNoMap = function() {
            map = undefined;
        };

        var givenMap = function() {
            map = {
                foo: {
                    bar: true
                },
                baz: {
                    foo: false
                }
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

        var item = {
            a: true
        };
        
        it('Given no items previously added for file, adds item to file.', function() {
        
            add();

            assertItemWasAddedToEmptyFile();
        
        });

        it('Given different items previously added for file, adds item to file.', function() {

            givenDifferentItemsPreviouslyAddedForFile();

            add();

            assertItemWasAddedToExistingFile();

        });

        var add = function() {
            collection.add(filePath, item);
        };

        var givenDifferentItemsPreviouslyAddedForFile = function() {
            collection.add(filePath, {
                b: false
            });
        };

        var assertItemWasAddedToEmptyFile = function() {
            expect(collection.toJSON()[fileName]).toEqual({
                a: true
            });
        };

        var assertItemWasAddedToExistingFile = function() {
            expect(collection.toJSON()[fileName]).toEqual({
                a: true,
                b: false
            });
        };

    });

    describe('get', function() {

        var items;

        it('Given no items added for file, returns empty object.', function() {

            get();

            assertEmptyObjectWasReturned();

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
            collection.add(filePath, {a: true});
            collection.add(filePath, {b: false});
        };

        var assertEmptyObjectWasReturned = function() {
            expect(items).toEqual({});
        };

        var assertItemsForFileWereReturned = function() {
            expect(items).toEqual({
                a: true,
                b: false
            });
        };

    });

    describe('clear', function() {

        var otherFileName = 'file2.js',
            otherFilePath = '../foo/bar/' + otherFileName;

        beforeEach(function() {

            collection.add(otherFilePath, {
                a: true
            });

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
            collection.add(filePath, {
                a: true
            });
        };

        var assertNothingWasCleared = function() {
            assertItemsForFileWereRemoved();
        };

        var assertItemsForFileWereRemoved = function() {
            var expected = {};
            expected[otherFileName] = {
                a: true
            };
            expect(collection.toJSON()).toEqual(expected);
        };

    });

});