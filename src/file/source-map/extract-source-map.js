var convert = require('convert-source-map');

var sourceMapRegex = /\n\/(\*|\/)# sourceMappingURL=(.*)$/mg;
var inlineBase64SourceMapRegex = /\n\/(\*|\/)# sourceMappingURL=data:application\/json(.*);base64,(.*)$/mg;

function extract(code, mapFileDir) {
	
	var inlineBase64SourceMapMatch = code.match(inlineBase64SourceMapRegex);
	
	if(inlineBase64SourceMapMatch) {
		
        return {
            code: code.replace(sourceMapRegex, ''),
            map: convert.fromComment(inlineBase64SourceMapMatch[0]).toObject()
        };
		
	}

    var sourceMapMatch = code.match(sourceMapRegex);

    if (sourceMapMatch) {

		var sourceMap = convert.fromMapFileComment(sourceMapMatch[0], mapFileDir);
		
        return {
            code: code.replace(sourceMapRegex, ''),
            map: sourceMap && sourceMap.toObject()
        };

    } else {

        return {
            code: code
        };

    }

}

module.exports = extract;