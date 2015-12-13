describe('CssValidator', function() {

    var cssValidator = require('../../src/css-validator'),
        bundle,
        css;

    beforeEach(function(){
        css = '';
    })

    it('Given valid CSS, does not throw error.', function(done) {

        givenBundle('foo');
        givenValidCss();

        assertValidateDoesNotThrowError(done);

    });
    
    it('Given mobile bundle with too many selectors, does not throw error.', function(done) {
    
        givenBundle('patient-mobile');
        givenTooManySelectors();

        assertValidateDoesNotThrowError(done);
    
    });

    it('Given oversized mobile bundle, does not throw error.', function(done) {

        givenBundle('patient-mobile');
        givenToBigCss();

        assertValidateDoesNotThrowError(done);

    });

    it('Given CSR bundle with too many selectors, does not throw error.', function(done) {

        givenBundle('ondeck-csr');
        givenTooManySelectors();

        assertValidateDoesNotThrowError(done);

    });

    it('Given oversized CSR bundle, does not throw error.', function(done) {

        givenBundle('ondeck-csr');
        givenToBigCss();

        assertValidateDoesNotThrowError(done);

    });

    it('Given Pulse bundle with too many selectors, does not throw error.', function(done) {

        givenBundle('ondeck-pulse');
        givenTooManySelectors();

        assertValidateDoesNotThrowError(done);

    });

    it('Given oversized Pulse bundle, does not throw error.', function(done) {

        givenBundle('ondeck-pulse');
        givenToBigCss();

        assertValidateDoesNotThrowError(done);

    });

    it('Given bundle with too many selectors, throws error.', function(done) {

        givenBundle('foo');
        givenTooManySelectors();

        assertValidateThrowsError(done);

    });

    it('Given oversized bundle, does not throw error.', function(done) {

        givenBundle('foo');
        givenToBigCss();

        assertValidateDoesNotThrowError(done);
    });

    var givenBundle = function(name) {
        bundle = './foo/bar/' + name + '.css.bundle';
    };

    var givenTooManySelectors = function(){
        addCssRows(10, ".foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}.foo,.bar{margin-left:10px;}");
    };

    var givenValidCss = function() {
        addCssRows(14, ".foo{margin-top:10px;margin-left:10px;margin-right:10px;margin-bottom:10px;padding-top:10px;padding-left:10px;padding-right:10px;padding-bottom:10px;background-image:url('/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar.jpg');}.foo{margin-top:10px;margin-left:10px;margin-right:10px;margin-bottom:10px;padding-top:10px;padding-left:10px;padding-right:10px;padding-bottom:10px;background-image:url('/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar.jpg');}.foo{margin-top:10px;margin-left:10px;margin-right:10px;margin-bottom:10px;padding-top:10px;padding-left:10px;padding-right:10px;padding-bottom:10px;background-image:url('/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar.jpg');}.foo{margin-top:10px;margin-left:10px;margin-right:10px;margin-bottom:10px;padding-top:10px;padding-left:10px;padding-right:10px;padding-bottom:10px;background-image:url('/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar.jpg');}.foo{margin-top:10px;margin-left:10px;margin-right:10px;margin-bottom:10px;padding-top:10px;padding-left:10px;padding-right:10px;padding-bottom:10px;background-image:url('/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar/foo/bar.jpg');}");
    };

    var givenToBigCss = function() {
        for(var i=0; i<25; i++) {
            givenValidCss();;
        }
    };

    var addCssRows = function(numRowsToAdd, cssToAdd) {
        for(var i=0; i<numRowsToAdd; i++) {
            css += cssToAdd;
        }
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