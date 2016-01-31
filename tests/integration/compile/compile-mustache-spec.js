var compileMustache = require('../../../src/compile/compile-mustache');
var _ = require('underscore');
var path = require('path');

describe('compile mustache', function() {

    var inputPath,
        useTemplateDirs;

    beforeEach(function() {

        inputPath = 'C:\\foo\\templates\\sub\\bar.mustache';
        useTemplateDirs = false;

    });

    it('Given mustache code, compiles to JS.', function(done) {

        compile(
                '<div> {{a}} </div>'
            )
            .then(assertResultIs(
                '(function() {\n' +
                '\n' +
                '    var useCommonJs = typeof module !== \'undefined\' && module.exports,\n' +
                '        Hogan,\n' +
                '        template;\n' +
                '\n' +
                '    if (useCommonJs) {\n' +
                '        Hogan = require(\'hogan\');\n' +
                '    } else {\n' +
                '        Hogan = this.Hogan;\n' +
                '    }\n' +
                '\n' +
                '    template = new Hogan.Template({\n' +
                '        code: function(c,p,i){var _=this;_.b(i=i||"");_.b("<div> ");_.b(_.v(_.f("a",c,p,0)));_.b(" </div>");return _.fl();;},\n' +
                '        partials: {},\n' +
                '        subs: {}\n' +
                '    });\n' +
                '\n' +
                '    if (useCommonJs) {\n' +
                '        module.exports = template;\n' +
                '    } else {\n' +
                '        this.JST = this.JST || {};\n' +
                '        JST[\'bar\'] = template;\n' +
                '    }\n' +
                '\n' +
                '}).call(this);',
                done
            ))
            .catch(throwError);

    });

    it('Given mustache code and use template dirs options, compiles to JS with folder prefixed template name.', function(done) {

        givenUseTemplateDirs();

        compile(
                '<div> {{a}} </div>'
            )
            .then(assertResultIs(
                '(function() {\n' +
                '\n' +
                '    var useCommonJs = typeof module !== \'undefined\' && module.exports,\n' +
                '        Hogan,\n' +
                '        template;\n' +
                '\n' +
                '    if (useCommonJs) {\n' +
                '        Hogan = require(\'hogan\');\n' +
                '    } else {\n' +
                '        Hogan = this.Hogan;\n' +
                '    }\n' +
                '\n' +
                '    template = new Hogan.Template({\n' +
                '        code: function(c,p,i){var _=this;_.b(i=i||"");_.b("<div> ");_.b(_.v(_.f("a",c,p,0)));_.b(" </div>");return _.fl();;},\n' +
                '        partials: {},\n' +
                '        subs: {}\n' +
                '    });\n' +
                '\n' +
                '    if (useCommonJs) {\n' +
                '        module.exports = template;\n' +
                '    } else {\n' +
                '        this.JST = this.JST || {};\n' +
                '        JST[\'sub-bar\'] = template;\n' +
                '    }\n' +
                '\n' +
                '}).call(this);',
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
            useTemplateDirs: useTemplateDirs
        });

    };

    var givenUseTemplateDirs = function() {

        useTemplateDirs = true;

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