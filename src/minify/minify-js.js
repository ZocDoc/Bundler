var Promise = require('bluebird');
var uglify = require('uglify-js');

/**
 * @param {object} options
 * @param {string} options.code
 * @param {object} options.map
 * @param {string} options.inputPath
 * @param {boolean} options.sourceMap
 * @returns {bluebird}
 */
function minify(options) {

    return new Promise(function(resolve, reject) {

        try {

            var ast = generateSyntaxTree(options.code, options.inputPath);

            ast = compress(ast);

            mangle(ast);

            var result = generateCode(ast, options);

            resolve(result);

        } catch (err) {

            reject(err);

        }

    });

}

function generateSyntaxTree(js, filePath) {

    uglify.base64.reset();

    return uglify.parse(js, {
        filename: filePath
    });

}

function compress(ast) {

    var sq = uglify.Compressor({
        warnings: false
    });

    ast.figure_out_scope();

    return ast.transform(sq);

}

function mangle(ast) {

    ast.figure_out_scope();
    ast.compute_char_frequency();
    ast.mangle_names();

}

function generateCode(ast, options) {

    var output = {},
        sourceMap,
        result,
        stream;

    if (options.sourceMap) {
        sourceMap = output.source_map = uglify.SourceMap({
            orig: options.map
        });
    }

    stream = uglify.OutputStream(output);

    ast.print(stream);

    result = {
        code: stream.toString()
    };

    if (options.sourceMap) {
        result.map = JSON.parse(sourceMap.toString());
    }

    return result;

}

module.exports = minify;