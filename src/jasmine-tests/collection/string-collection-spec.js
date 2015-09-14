var StringCollection = require('../../collection/string-collection.js');

describe('StringCollection', function() {

    var fileName = 'foo.css',
        filePath = 'C:/foo/bar/' + fileName,
        collection;

    beforeEach(function() {

        collection = new StringCollection();

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
            collection = new StringCollection(map);
        };

        var givenNoMap = function() {
            map = undefined;
        };

        var givenMap = function() {
            map = {
                foo: 'bar'
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

        it('Given file value not previously set, sets file value.', function() {

            add();

            assertValueWasSetForFile();

        });

        it('Given file value previously set, updates file value.', function() {

            givenValuePreviouslySetForFile();

            add();

            assertValueWasSetForFile();

        });

        var add = function() {
            collection.add(filePath, item);
        };

        var givenValuePreviouslySetForFile = function() {
            collection.add(filePath, 'b');
        };

        var assertValueWasSetForFile = function() {
            expect(collection.toJSON()[fileName]).toEqual('a');
        };

    });

    describe('get', function() {

        var value;

        it('Given value not set for file, returns undefined.', function() {

            get();

            assertUndefinedWasReturned();

        });

        it('Given value set for file, returns value for file.', function() {

            givenValueSetForFile();

            get();

            assertValueForFileWasReturned();

        });

        var get = function() {
            value = collection.get(fileName);
        };

        var givenValueSetForFile = function() {
            collection.add(filePath, 'a');
        };

        var assertUndefinedWasReturned = function() {
            expect(value).toBeUndefined();
        };

        var assertValueForFileWasReturned = function() {
            expect(value).toEqual('a');
        };

    });

    describe('clear', function() {

        var otherFileName = 'file2.js.file',
            otherFilePath = 'C:/foo/bar/' + otherFileName;

        beforeEach(function() {

            collection.add(otherFilePath, 'a');

        });

        it('Given value not set for file, does nothing.', function() {

            clear();

            assertNothingWasCleared();

        });

        it('Given value set for file, removes value for file.', function() {

            givenItemsAddedForFile();

            clear();

            assertValueForFileWasRemoved();

        });

        var clear = function() {
            collection.clear(filePath);
        };

        var givenItemsAddedForFile = function() {
            collection.add(filePath, 'a');
        };

        var assertNothingWasCleared = function() {
            assertValueForFileWasRemoved();
        };

        var assertValueForFileWasRemoved = function() {
            expect(collection.toJSON()).toEqual({
                'file2.js.file': 'a'
            });
        };

    });

});