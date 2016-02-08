var _ = require('underscore');
var browserPack = require('browser-pack');
var concat = require('concat-stream');
var FileType = require('../../file').type;
var Promise = require('bluebird');
var sourceMap = require('../../file/source-map');
var toStream = require('string-to-stream');

var exportsRegex = /(module.exports\s*=)|(exports\s*=)|(exports\.[A-Za-z0-9_]+\s*=)/mg;

/**
 * @param {object} options
 * @param {object} options.allFiles
 * @param {object} options.deps
 * @param {object} options.indices
 * @param {boolean} options.sourceMap
 * @param {object} options.exports
 * @returns {Promise}
 */
function pack(options) {

    return new Promise(function(resolve, reject) {

        var packInput = getPackInput(options);

        toStream(JSON.stringify(packInput)).pipe(browserPack())
            .pipe(concat(function(stream) {

                var result = sourceMap.extract(stream.toString());

                result.code = exposeExports(result.code, options.exports, options.indices);

                if (options.sourceMap) {
                    resolve(result);
                } else {
                    resolve({
                        code: result.code
                    });
                }

            }))
            .on('error', function(err) {
                reject(err);
            });

    });

}

function getPackInput(options) {

    var packInput = [];

    _.each(options.allFiles, function(file, filePath) {

        var fileDeps = {},
            code;

        _.each(options.deps[filePath], function(dep, reference) {
            if (dep.isPath) {
                fileDeps[reference] = options.indices[dep.name];
            } else {
                fileDeps[reference] = reference;
            }
        });

        if (options.sourceMap && file.map) {
            code = file.code + '\n' + sourceMap.getComment(file.map, FileType.JS);
        } else {
            code = file.code;
        }

        packInput.push({
            sourceFile: filePath,
            id: options.indices[filePath],
            source: code,
            deps: fileDeps,
            entry: isEntry(code)
        });

    });

    return packInput;

}

function isEntry(code) {

    // If a file doesn't export anything, we want to invoke it immediately
    // since it's likely attaching to global objects
    if (!code.match(exportsRegex)) {
        return true;
    }

    return false;

}

function exposeExports(code, exports, indices) {

    var fullCode = [];

    fullCode.push('(function(){var ir=');
    fullCode.push(code);
    fullCode.push(';require=function(n){');

    _.each(exports, function(filePath, name) {
        fullCode.push('if(n===\'');
        fullCode.push(name);
        fullCode.push('\')return ir(');
        fullCode.push(indices[filePath]);
        fullCode.push(');');
    });

    fullCode.push('return ir(n,true)}}).call(this);');

    return fullCode.join('');

}

module.exports = pack;