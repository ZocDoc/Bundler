var files = require('../files');
var fs = require('fs');
var Promise = require('bluebird');
var Step = require('step');

/**
 * @param {object} options
 * @param {string} options.code
 * @param {string} options.map
 * @param {string} options.inputPath
 * @param {string} options.outputPath
 * @param {string} options.mapOutputPath
 * @param {string} options.bundleDir
 * @param {string} options.nodeModulesPath
 * @param {boolean} options.outputBundleOnly
 * @param {boolean} options.outputBundleStats
 * @param {object} options.bundleStatsCollector
 * @param {boolean} options.sourceMap
 * @param {string} options.siteRoot
 * @param {boolean} options.useTemplateDirs
 * @param {function} processFn
 */
function processAsync(options, processFn) {

    return new Promise(function(resolve, reject) {

        Step(
            function doesOutputFileExist() {
                fs.exists(options.outputPath, this);
            },
            function shouldProcessCode(outputFileExists) {

                var next = this;

                if (!outputFileExists) {

                    next(true);

                } else {

                    fs.stat(options.inputPath, function (err, inputFileStat) {

                        if (err) {
                            throw err;
                        }

                        fs.stat(options.outputPath, function (err, outputFileStat) {

                            if (err) {
                                throw err;
                            }

                            var shouldReprocess = outputFileStat.mtime.getTime() < inputFileStat.mtime.getTime();

                            if (options.outputBundleStats && !shouldReprocess) {

                                var imports = options.bundleStatsCollector.GetImportsForFile(options.inputPath) || [];

                                for (var i = 0; i < imports.length; i++) {

                                    var importStat = fs.statSync(imports[i]);

                                    shouldReprocess = outputFileStat.mtime.getTime() < importStat.mtime.getTime();

                                    if (shouldReprocess) {
                                        break;
                                    }
                                }

                            }

                            next(shouldReprocess);

                        });
                    });
                }

            },
            function processCode(shouldProcessCode) {

                if (shouldProcessCode) {

                    var onAfterProcessed = function(result) {

                        if (options.outputBundleOnly) {

                            resolve(result.code);

                        } else {

                            files.write(result.code, result.map, options.outputPath, options.mapOutputPath, options.siteRoot)
                                .then(resolve)
                                .catch(reject);

                        }
                    };

                    processFn(options)
                        .then(onAfterProcessed)
                        .catch(reject);

                } else {

                    files.read(options.outputPath, options.mapOutputPath)
                        .then(resolve)
                        .catch(reject);

                }

            }
        );

    });

}

module.exports = processAsync;