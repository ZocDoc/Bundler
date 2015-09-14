var ArrayCollection = require('../../collection/array-collection.js');

describe('ArrayCollection', function() {

    var fileName = 'bundle.js.bundle',
        bundleName = 'C:/foo/bar/' + fileName,
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
        
        it('Given no items previously added for bundle, adds item to bundle.', function() {
        
            add();

            assertItemWasAddedToEmptyBundle();
        
        });

        it('Given different items previously added for bundle, adds item to bundle.', function() {

            givenDifferentItemsPreviouslyAddedForBundle();

            add();

            assertItemWasAddedToExistingBundle();

        });

        it('Given same item previously added for bundle, does not re-add item to bundle.', function() {

            givenSameItemPreviouslyAddedForBundle();

            add();

            assertItemWasNotReaddedToBundle();

        });

        var add = function() {
            collection.add(bundleName, item);
        };

        var givenDifferentItemsPreviouslyAddedForBundle = function() {
            collection.add(bundleName, 'b');
        };

        var givenSameItemPreviouslyAddedForBundle = function() {
            collection.add(bundleName, item);
        };

        var assertItemWasAddedToEmptyBundle = function() {
            expect(collection.toJSON()[fileName]).toEqual(['a']);
        };

        var assertItemWasAddedToExistingBundle = function() {
            expect(collection.toJSON()[fileName]).toEqual(['b', 'a']);
        };

        var assertItemWasNotReaddedToBundle = function() {
            expect(collection.toJSON()[fileName]).toEqual(['a']);
        };

    });

    describe('get', function() {

        var items;

        it('Given no items added for bundle, returns empty array.', function() {

            get();

            assertEmptyArrayWasReturned();

        });

        it('Given items added for bundle, returns items for bundle.', function() {

            givenItemsAddedToBundle();

            get();

            assertItemsForBundleWereReturned();

        });

        var get = function() {
            items = collection.get(fileName);
        };

        var givenItemsAddedToBundle = function() {
            collection.add(bundleName, 'a');
            collection.add(bundleName, 'b');
        };

        var assertEmptyArrayWasReturned = function() {
            expect(items).toEqual([]);
        };

        var assertItemsForBundleWereReturned = function() {
            expect(items).toEqual(['a', 'b']);
        };

    });

    describe('clear', function() {

        var otherFileName = 'bundle2.js.bundle',
            otherBundleName = 'C:/foo/bar/' + otherFileName;

        beforeEach(function() {

            collection.add(otherBundleName, 'a');

        });

        it('Given no items added for bundle, does nothing.', function() {

            clear();

            assertNothingWasCleared();

        });

        it('Given items added for bundle, removes items for bundle.', function() {

            givenItemsAddedForBundle();

            clear();

            assertItemsForBundleWereRemoved();

        });

        var clear = function() {
            collection.clear(bundleName);
        };

        var givenItemsAddedForBundle = function() {
            collection.add(bundleName, 'a');
        };

        var assertNothingWasCleared = function() {
            assertItemsForBundleWereRemoved();
        };

        var assertItemsForBundleWereRemoved = function() {
            expect(collection.toJSON()).toEqual({
                'bundle2.js.bundle': ['a']
            });
        };

    });

});