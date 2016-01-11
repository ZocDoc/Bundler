var fs = require('fs');
var Promise = require('bluebird');
var readTextFile = require('./read-text-file');
var Step = require('step');

/**
 * @param {object} options
 * @param {string} options.code
 * @param {string} options.inputPath
 * @param {string} options.outputPath
 * @param {boolean} options.outputBundleOnly
 * @param {boolean} options.outputBundleStats
 * @param {object} options.bundleStatsCollector
 * @param {function} compile
 */
function compileAsync(options, compile) {

    return new Promise(function(resolve, reject) {

        Step(
            function doesOutputFileExist() {
                fs.exists(options.outputPath, this);
            },
            function (outputFileExists) {

                var next = this;

                if (!outputFileExists) {

                    next(!outputFileExists);

                } else {

                    fs.stat(options.inputPath, function (err, inputFileStat) {

                        if (err) {
                            throw err;
                        }

                        fs.stat(options.outputPath, function (err, outputFileStat) {

                            if (err) {
                                throw err;
                            }

                            var shouldRecompile = outputFileStat.mtime.getTime() < inputFileStat.mtime.getTime();

                            if (options.outputBundleStats && !shouldRecompile) {

                                var imports = options.bundleStatsCollector.GetImportsForFile(options.inputPath) || [];

                                for (var i = 0; i < imports.length; i++) {

                                    var importStat = fs.statSync(imports[i]);

                                    shouldRecompile = outputFileStat.mtime.getTime() < importStat.mtime.getTime();

                                    if (shouldRecompile) {
                                        break;
                                    }
                                }

                            }

                            next(shouldRecompile);

                        });
                    });
                }

            },
            function (shouldRecompile) {

                if (shouldRecompile) {

                    var onAfterCompiled = function(code) {

                        if (options.outputBundleOnly) {

                            resolve(code);

                        } else {

                            fs.writeFile(options.outputPath, code, 'utf-8', function(err) {

                                if (err) {
                                    reject(err);
                                }

                                resolve(code);

                            });

                        }
                    };

                    compile(options)
                        .then(onAfterCompiled)
                        .catch(reject);

                } else {

                    try {
                        readTextFile(options.outputPath, resolve);
                    } catch (err) {
                        reject(err);
                    }

                }

            }
        );

    });

}

module.exports = function(compile) {

    return function(options) {

        return compileAsync(options, compile);

    };

};