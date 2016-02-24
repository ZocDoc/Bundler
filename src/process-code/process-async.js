var fs = require('fs');
var file = require('../file');
var Promise = require('bluebird');
var Step = require('step');

/**
 * @param {file.type} fileType
 * @param {object} options
 * @param {string} options.code
 * @param {string} options.originalPath
 * @param {string} options.inputPath
 * @param {string} options.outputPath
 * @param {string} options.bundleDir
 * @param {string} options.nodeModulesPath
 * @param {object} options.bundleStatsCollector
 * @param {boolean} options.sourceMap
 * @param {string} options.siteRoot
 * @param {boolean} options.useTemplateDirs
 * @param {function} processFn
 */
function processAsync(fileType, options, processFn) {

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

                            if (!shouldReprocess) {

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

                        file.write(result.code, result.map, fileType, options.outputPath, options.siteRoot)
                            .then(function(written) {
                                resolve({
                                    code: written.code,
                                    map: written.map,
                                    path: options.outputPath,
                                    originalPath: options.originalPath
                                });
                            })
                            .catch(reject);

                    };

                    processFn(options)
                        .then(onAfterProcessed)
                        .catch(reject);

                } else {

                    file.read(options.outputPath)
                        .then(function(read) {
                            resolve({
                                code: read.code,
                                map: read.map,
                                path: options.outputPath,
                                originalPath: options.originalPath
                            });
                        })
                        .catch(reject);

                }

            }
        );

    });

}

module.exports = processAsync;