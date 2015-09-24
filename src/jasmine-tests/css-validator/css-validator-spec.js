var cssValidator = require('../../css-validator');
var fs = require('fs');

describe('CssValidator', function() {

    var bundle,
        css;

    it('Given valid CSS, does not throw error.', function(done) {

        givenBundle('foo');
        givenCss('valid');

        assertValidateDoesNotThrowError(done);

    });
    
    it('Given mobile bundle with too many selectors, does not throw error.', function(done) {
    
        givenBundle('patient-mobile');
        givenCss('too-many-selectors');

        assertValidateDoesNotThrowError(done);
    
    });

    it('Given oversized mobile bundle, does not throw error.', function(done) {

        givenBundle('patient-mobile');
        givenCss('too-big');

        assertValidateDoesNotThrowError(done);

    });

    it('Given CSR bundle with too many selectors, does not throw error.', function(done) {

        givenBundle('ondeck-csr');
        givenCss('too-many-selectors');

        assertValidateDoesNotThrowError(done);

    });

    it('Given oversized CSR bundle, does not throw error.', function(done) {

        givenBundle('ondeck-csr');
        givenCss('too-big');

        assertValidateDoesNotThrowError(done);

    });

    it('Given Pulse bundle with too many selectors, does not throw error.', function(done) {

        givenBundle('ondeck-pulse');
        givenCss('too-many-selectors');

        assertValidateDoesNotThrowError(done);

    });

    it('Given oversized Pulse bundle, does not throw error.', function(done) {

        givenBundle('ondeck-pulse');
        givenCss('too-big');

        assertValidateDoesNotThrowError(done);

    });

    it('Given bundle with too many selectors, throws error.', function(done) {

        givenBundle('foo');
        givenCss('too-many-selectors');

        assertValidateThrowsError(done);

    });

    it('Given oversized bundle, throws error.', function(done) {

        givenBundle('foo');
        givenCss('too-big');

        assertValidateThrowsError(done);

    });

    var givenBundle = function(name) {
        bundle = './foo/bar/' + name + '.css.bundle';
    };

    var givenCss = function(cssTestCase) {
        css = fs.readFileSync('./css-validator/test-cases/' + cssTestCase + '.css').toString('utf8');
    };

    var validate = function(cb) {
        cssValidator.validate(bundle, css, cb);
    };

    var assertValidateThrowsError = function(done) {
        validate(function(err) {
            expect(err).not.toBeUndefined();
            done();
        });
    };

    var assertValidateDoesNotThrowError = function(done) {
        validate(function(err) {
            expect(err).toBeUndefined();
            done();
        });
    };

});