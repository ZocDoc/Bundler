var uglify = require('uglify-js');

function minify(js, filePath) {

    var ast = generateSyntaxTree(js, filePath);

    ast = compress(ast);

    mangle(ast);

    return generateCode(ast);

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