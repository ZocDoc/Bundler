var StringCollection = require('../../collection/string-collection.js');

describe('StringCollection', function() {

    var fileName = 'bundle.js.bundle',
        bundleName = 'C:/foo/bar/' + fileName,
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

        it('Given bundle value not previously set, sets bundle value.', function() {

            add();

            assertValueWasSetForBundle();

        });

        it('Given bundle value previously set, updates bundle value.', function() {

            givenValuePreviouslySetForBundle();

            add();

            assertValueWasSetForBundle();

        });

        var add = function() {
            collection.add(bundleName, item);
        };

        var givenValuePreviouslySetForBundle = function() {
            collection.add(bundleName, 'b');
        };

        var assertValueWasSetForBundle = function() {
            expect(collection.toJSON()[fileName]).toEqual('a');
        };

    });

    describe('get', function() {

        var value;

        it('Given value not set for bundle, returns undefined.', function() {

            get();

            assertUndefinedWasReturned();

        });

        it('Given value set for bundle, returns value for bundle.', function() {

            givenValueSetForBundle();

            get();

            assertValueForBundleWasReturned();

        });

        var get = function() {
            value = collection.get(fileName);
        };

        var givenValueSetForBundle = function() {
            collection.add(bundleName, 'a');
        };

        var assertUndefinedWasReturned = function() {
            expect(value).toBeUndefined();
        };

        var assertValueForBundleWasReturned = function() {
            expect(value).toEqual('a');
        };

    });

    describe('clear', function() {

        var otherFileName = 'bundle2.js.bundle',
            otherBundleName = 'C:/foo/bar/' + otherFileName;

        beforeEach(function() {

            collection.add(otherBundleName, 'a');

        });

        it('Given value not set for bundle, does nothing.', function() {

            clear();

            assertNothingWasCleared();

        });

        it('Given value set for bundle, removes value for bundle.', function() {

            givenItemsAddedForBundle();

            clear();

            assertValueForBundleWasRemoved();

        });

        var clear = function() {
            collection.clear(bundleName);
        };

        var givenItemsAddedForBundle = function() {
            collection.add(bundleName, 'a');
        };

        var assertNothingWasCleared = function() {
            assertValueForBundleWasRemoved();
        };

        var assertValueForBundleWasRemoved = function() {
            expect(collection.toJSON()).toEqual({
                'bundle2.js.bundle': 'a'
            });
        };

    });

});