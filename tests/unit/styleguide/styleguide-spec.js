var styleguide = require('../../../src/styleguide');

describe('Styleguide', function() {

    describe('isStyleguideFile', function() {

        var filePath,
            isSgFile;

        it('Given file directly in styleguide folder, returns true.', function() {

            givenFilePathIs('C:/foo/styleguide/bar.less');

            isStyleguideFile();

            assertTrueWasReturned();

        });

        it('Given file nested in styleguide folder, returns true.', function() {

            givenFilePathIs('C:/foo/styleguide/bar/bar.less');

            isStyleguideFile();

            assertTrueWasReturned();

        });

        it('Given file name contains styleguide, returns true.', function() {

            givenFilePathIs('C:/foo/bar/bar.styleguide.less');

            isStyleguideFile();

            assertTrueWasReturned();

        });

        it('Given file name contains styleguide-documentation, returns false.', function() {

            givenFilePathIs('C:/foo/styleguide-documentation/bar.less');

            isStyleguideFile();

            assertFalseWasReturned();

        });

        it('Given file name contains styleguide-docummentation, returns false.', function() {

            givenFilePathIs('C:/foo/styleguide-docummentation/bar.less');

            isStyleguideFile();

            assertFalseWasReturned();

        });
        
        it('Given file name starts with sg., returns true.', function() {
        
            givenFilePathIs('C:/foo/bar/sg.bar.less');

            isStyleguideFile();

            assertTrueWasReturned();
        
        });

        it('Given file nested in folder starting with sg., returns false.', function() {

            givenFilePathIs('C:/foo/sg.bar/bar.less');

            isStyleguideFile();

            assertFalseWasReturned();

        });
        
        it('Given file not in styleguide folder, returns false.', function() {
        
            givenFilePathIs('C:/foo/bar/bar.less');

            isStyleguideFile();

            assertFalseWasReturned();
        
        });

        var isStyleguideFile = function() {
            isSgFile = styleguide.isStyleguideFile(filePath);
        };

        var givenFilePathIs = function(path) {
            filePath = path;
        };

        var assertFalseWasReturned = function() {
            expect(isSgFile).toBeFalsy();
        };

        var assertTrueWasReturned = function() {
            expect(isSgFile).toBeTruthy();
        };

    });

    describe('isLegacyStyleguideFile', function() {

        var filePath,
            isLegacyFile;

        it('Given file in legacy styleguide folder, returns true.', function() {

            givenFilePathIs('C:/foo/bar/styleguide/legacy/baz.less');

            isLegacyStyleguideFile();

            assertTrueWasReturned();

        });

        it('Given file with legacy in name, returns true.', function() {

            givenFilePathIs('C:/foo/bar/styleguide/styleguide.legacy.less');

            isLegacyStyleguideFile();

            assertTrueWasReturned();

        });

        it('Given legacy not in file path, returns false.', function() {

            givenFilePathIs('C:/foo/bar/styleguide/styleguide.less');

            isLegacyStyleguideFile();

            assertFalseWasReturned();

        });

        var isLegacyStyleguideFile = function() {
            isLegacyFile = styleguide.isLegacyStyleguideFile(filePath);
        };

        var givenFilePathIs = function(path) {
            filePath = path;
        };

        var assertFalseWasReturned = function() {
            expect(isLegacyFile).toBeFalsy();
        };

        var assertTrueWasReturned = function() {
            expect(isLegacyFile).toBeTruthy();
        };

    });

});