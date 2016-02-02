var compileMustache = require('../../../src/compile/compile-mustache');
var _ = require('underscore');

describe('compile mustache', function() {

    var inputPath,
        useTemplateDirs,
        require;

    beforeEach(function() {

        inputPath = 'C:\\foo\\templates\\sub\\bar.mustache';
        useTemplateDirs = false;
        require = false;

    });

    it('Given mustache code and require is disabled, compiles to JS attaching to global.', function(done) {

        compile(
                '<div> {{a}} </div>'
            )
            .then(assertResultIs(
                '(function() {\n' +
                '\n' +
                '    this.JST = this.JST || {};\n' +
                '\n' +
                '    this.JST[\'bar\'] = new this.Hogan.Template({\n' +
                '        code: function(c,p,i){var _=this;_.b(i=i||"");_.b("<div> ");_.b(_.v(_.f("a",c,p,0)));_.b(" </div>");return _.fl();;},\n' +
                '        partials: {},\n' +
                '        subs: {}\n' +
                '    });\n' +
                '\n' +
                '}).call(this);',
                done
            ))
            .catch(throwError);

    });

    it('Given mustache code and require is disabled and use template dirs options, compiles to JS attaching to global with folder prefixed template name.', function(done) {

        givenUseTemplateDirs();

        compile(
                '<div> {{a}} </div>'
            )
            .then(assertResultIs(
                '(function() {\n' +
                '\n' +
                '    this.JST = this.JST || {};\n' +
                '\n' +
                '    this.JST[\'sub-bar\'] = new this.Hogan.Template({\n' +
                '        code: function(c,p,i){var _=this;_.b(i=i||"");_.b("<div> ");_.b(_.v(_.f("a",c,p,0)));_.b(" </div>");return _.fl();;},\n' +
                '        partials: {},\n' +
                '        subs: {}\n' +
                '    });\n' +
                '\n' +
                '}).call(this);',
                done
            ))
            .catch(throwError);

    });

    it('Given mustache code and require is enabled, compiles to JS module export.', function(done) {

        givenRequire();

        compile(
            '<div> {{a}} </div>'
        )
            .then(assertResultIs(
                'var Hogan = require(\'hogan\');\n' +
                '\n' +
                'module.exports = new Hogan.Template({\n' +
                '    code: function(c,p,i){var _=this;_.b(i=i||"");_.b("<div> ");_.b(_.v(_.f("a",c,p,0)));_.b(" </div>");return _.fl();;},\n' +
                '    partials: {},\n' +
                '    subs: {}\n' +
                '});',
                done
            ))
            .catch(throwError);

    });

    it('Given invalid mustache code, throws error.', function(done) {

        compile('<div> {{#i}} </div>')
            .then(assertResultWasNotReturned)
            .catch(assertErrorIsThrown(done));

    });

    var compile = function(code) {

        return compileMustache({
            code: code,
            inputPath: inputPath,
            useTemplateDirs: useTemplateDirs,
            require: require
        });

    };

    var givenUseTemplateDirs = function() {

        useTemplateDirs = true;

    };

    var givenRequire = function() {

        require = true;

    };

    var assertResultIs = function(expected, done) {

        return function(result) {

            expect(result.code).toEqual(expected);

            done();

        };

    };

    var assertResultWasNotReturned = function() {

        throw 'Compile should not have succeeded!';

    };

    var assertErrorIsThrown = function(done) {

        return function(err) {

            expect(err).not.toBeUndefined();

            done();

        };

    };

    var throwError = function(err) {

        throw err;

    };

});