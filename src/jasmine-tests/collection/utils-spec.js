var utils = require('../../collection/utils.js');

describe('Utils', function() {

    describe('getFileName', function() {

        var bundleName,
            fileName;

        it('Given file path, returns file name.', function() {

            givenFilePath();

            getFileName();

            assertFileNameWasReturned();

        });

        var getFileName = function() {
            fileName = utils.getFileName(bundleName);
        };

        var givenFilePath = function() {
            bundleName = 'C:/foo/bar/bundle.js.bundle';
        };

        var assertFileNameWasReturned = function() {
            expect(fileName).toEqual('bundle.js.bundle');
        };

    });

});