var getComment = require('../../../../src/file/source-map/get-source-map-comment');
var file = require('../../../../src/file');

describe('get source map comment', function() {

    var comment;

    it('Given map for javascript file, returns single line source mapping URL comment.', function() {

		var sourceMapFile = 'sourceMapPath.min.js.map';
	
        getSourceMapComment(sourceMapFile, file.type.JS);

        assertCommentIs('//# sourceMappingURL=' + sourceMapFile);

    });

    it('Given map for CSS file, returns multiline source mapping URL comment.', function() {

		var sourceMapFile = 'sourceMapPath.min.js.map';
	
        getSourceMapComment(sourceMapFile, file.type.CSS);

        assertCommentIs('/*# sourceMappingURL=' + sourceMapFile + ' */');

    });

    var getSourceMapComment = function(map, fileType) {

        comment = getComment(map, fileType);

    };

    var assertCommentIs = function(expected) {

        expect(comment).toEqual(expected);

    };

});