var uglify = require('uglify-js');

/**
 * @param {object} options
 * @param {string} options.code
 * @param {string} options.filePath
 * @param {function} options.success
 * @param {function} options.error
 */
function minify(options) {

    var ast = generateSyntaxTree(options.code, options.filePath);

    ast = compress(ast);

    mangle(ast);

    var minifiedJs = generateCode(ast);

    options.success(minifiedJs);

}

function generateSyntaxTree(js, filePath) {

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

function generateCode(ast) {

    var output = {},
        stream = uglify.OutputStream(output);

    ast.print(stream);

    return stream.toString();

}

module.exports = minify;