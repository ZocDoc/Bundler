var extract = require('../../../../../src/tasks/file/source-map/extract-source-map');

describe('extract source map', function() {

    var result;

    it('Given code with no source mapping URL comment, returns original code.', function() {

        extractSourceMap('var x = 1;');

        assertCodeIs('var x = 1;');

    });

    it('Given code with no source mapping URL comment, does not return map.', function() {

        extractSourceMap('var x = 1;');

        assertMapIs(undefined);

    });

    it('Given JS code with source mapping URL comment, returns code with source mapping URL comment removed.', function() {

        extractSourceMap('var x = 1;\n//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZvby5qcyJdLCJuYW1lcyI6WyJhIiwiYiJdLCJtYXBwaW5ncyI6WyJBQUFBIiwiQkJCQiJdfQ==');

        assertCodeIs('var x = 1;');

    });

    it('Given JS code with source mapping URL comment, returns decoded source map.', function() {

        extractSourceMap('var x = 1;\n//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZvby5qcyJdLCJuYW1lcyI6WyJhIiwiYiJdLCJtYXBwaW5ncyI6WyJBQUFBIiwiQkJCQiJdfQ==');

        assertMapIs({
            version: 3,
            sources: ['foo.js'],
            names: ['a', 'b'],
            mappings: ['AAAA', 'BBBB']
        });

    });

    it('Given CSS code with source mapping URL comment, returns code with source mapping URL comment removed.', function() {

        extractSourceMap('.foo { background: red; }\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZvby5sZXNzIl0sIm5hbWVzIjpbImEiLCJiIl0sIm1hcHBpbmdzIjpbIkFBQUEiLCJCQkJCIl19 */');

        assertCodeIs('.foo { background: red; }');

    });

    it('Given CSS code with source mapping URL comment, returns decoded source map.', function() {

        extractSourceMap('.foo { background: red; }\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZvby5sZXNzIl0sIm5hbWVzIjpbImEiLCJiIl0sIm1hcHBpbmdzIjpbIkFBQUEiLCJCQkJCIl19 */');

        assertMapIs({
            version: 3,
            sources: ['foo.less'],
            names: ['a', 'b'],
            mappings: ['AAAA', 'BBBB']
        });

    });

    var extractSourceMap = function(code) {

        result = extract(code);

    };

    var assertCodeIs = function(expected) {

        expect(result.code).toEqual(expected);

    };

    var assertMapIs = function(expected) {

        expect(result.map).toEqual(expected);

    };

});