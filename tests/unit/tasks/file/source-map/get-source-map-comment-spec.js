var getComment = require('../../../../../src/tasks/file/source-map/get-source-map-comment');
var fileType = require('../../../../../src/tasks/file').type;

describe('get source map comment', function() {

    var comment;

    it('Given map for javascript file, returns single line source mapping URL comment.', function() {

        getSourceMapComment({
            version: 3,
            sources: ['foo.js'],
            names: ['a', 'b'],
            mappings: ['AAAA', 'BBBB']
        }, fileType.JS);

        assertCommentIs('//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZvby5qcyJdLCJuYW1lcyI6WyJhIiwiYiJdLCJtYXBwaW5ncyI6WyJBQUFBIiwiQkJCQiJdfQ==');

    });

    it('Given map for CSS file, returns multiline source mapping URL comment.', function() {

        getSourceMapComment({
            version: 3,
            sources: ['foo.less'],
            names: ['a', 'b'],
            mappings: ['AAAA', 'BBBB']
        }, fileType.CSS);

        assertCommentIs('/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZvby5sZXNzIl0sIm5hbWVzIjpbImEiLCJiIl0sIm1hcHBpbmdzIjpbIkFBQUEiLCJCQkJCIl19 */');

    });

    var getSourceMapComment = function(map, fileType) {

        comment = getComment(map, fileType);

    };

    var assertCommentIs = function(expected) {

        expect(comment).toEqual(expected);

    };

});