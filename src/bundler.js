/*
Copyright (c) 2012 Demis Bellot <demis.bellot@gmail.com>

MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

// uncaught exceptions should cause the application to crash and exit
// with an exit code that will be identified as a failure by most
// windows build systems

var handleError = function(err) {
    if (err.stack) {
        console.error(err.stack);
    } else {
        var jsonError = JSON.stringify(err, null, 4);
        if (jsonError !== '{}') {
            console.error(jsonError);
        } else {
            console.error(err.message);
        }
    }
    process.exit(1);
};

process.on("uncaughtException", handleError);

var fs = require("fs"),
    path = require("path"),
    Step = require('step'),
    hashingRequire = require('./bundle-stats.js'),
    bundlefiles = require('./bundle-files.js'),
    bundleStatsCollector = new hashingRequire.BundleStatsCollector(),
    optionsRequire = require('./bundle-options.js'),
    bundleFileUtilityRequire = require('./bundle-file-utility.js'),
    bundleFileUtility,
    bundlerOptions = new optionsRequire.BundlerOptions(),
    urlRewrite = require('./bundle-url-rewrite.js'),
    _ = require('underscore'),
    collection = require('./collection'),
    cssValidator = require('./css-validator'),
    readTextFile = require('./read-text-file'),
    compile = require('./compile'),
    minify = require('./minify'),
    concat = require('./concat'),
    file = require('./file'),
    urlVersioning = null;

bundleFileUtility = new bundleFileUtilityRequire.BundleFileUtility(fs);

bundlerOptions.ParseCommandLineArgs(process.argv.splice(2));

if (!bundlerOptions.Directories.length) {
    console.log("No directories were specified.");
    console.log("Usage: bundler.js [#option:value] ../Content [../Scripts]");
    return;
}

if(bundlerOptions.DefaultOptions.statsfileprefix) {
    bundleStatsCollector.setFilePrefix(bundlerOptions.DefaultOptions.statsfileprefix);
}

if(bundlerOptions.DefaultOptions.rewriteimagefileroot && bundlerOptions.DefaultOptions.rewriteimageoutputroot) {
    urlVersioning = new urlRewrite.BundleUrlRewriter(
        fs,
        bundlerOptions.DefaultOptions.rewriteimageoutputroot,
        bundlerOptions.DefaultOptions.rewriteimagefileroot
    );
}

bundleStatsCollector.Console = console;
bundleStatsCollector.LoadStatsFromDisk(bundlerOptions.DefaultOptions.outputdirectory || process.cwd());

var walk = function (dir, done) {
    var results = new bundlefiles.BundleFiles();
    fs.readdir(dir, function (err, list) {
        if (err) throw err;
        var i = 0;
        (function next() {
            var file = list[i++];
            if (!file) return done(null, results);
            file = dir + '/' + file;
            fs.stat(file, function (_, stat) {
                if (stat && stat.isDirectory()) {
                    walk(file, function (_, res) {
                        results.addFiles(res.files);
                        next();
                    });
                } else {
                    results.addFile(file);
                    next();
                }
            });
        })();
    });
};

var scanIndex = 0;
(function scanNext() {
    if (scanIndex < bundlerOptions.Directories.length) {
        var rootDir = bundlerOptions.Directories[scanIndex++];
        fs.exists(rootDir, function(exists) {
            if (exists) {
                walk(rootDir, function(err, allFiles) {
                    if (err) throw err;
                    scanDir(allFiles, scanNext);
                });
            } else {
                console.log("\nSpecified dir '" + rootDir + "' does not exist, skipping...");
                scanNext();
            }
        });
    } else {
        bundleStatsCollector.SaveStatsToDisk(bundlerOptions.DefaultOptions.outputdirectory || process.cwd());
    }
})();

function scanDir(allFiles, cb) {

    allFiles.Index();

    var jsBundles  = allFiles.getBundles(bundlefiles.BundleType.Javascript);
    var cssBundles = allFiles.getBundles(bundlefiles.BundleType.Css);

    Step(
        function () {
            var next = this;
            var index = 0;
            var nextBundle = function () {
                if (index < jsBundles.length)
                    processBundle(jsBundles[index++]);
                else
                    next();
            };
            function processBundle(jsBundle) {
                var bundleDir = path.dirname(jsBundle);
                var bundleName = jsBundle.replace('.bundle', '');

                readTextFile(jsBundle, function (data) {
                    var jsFiles = removeCR(data).split("\n");
                    var options = bundlerOptions.getOptionsForBundle(jsFiles);

                    bundleName = bundleFileUtility.getOutputFilePath(bundleName, bundleName, options);

                    var tmpFiles = collection.createBundleFiles(jsBundle);

                    jsFiles.forEach(function(name) {

                        if(name.startsWith('#')) { return; }

                        var currentItem = bundleDir + '/' +  name;
                        var stat = fs.statSync(currentItem);
                        if(!stat.isDirectory()) {
                            tmpFiles.addFile(name);
                        }
                        else if(currentItem != bundleDir + '/'){

                            var filesInDir = allFiles.getFilesInDirectory(
                                                bundlefiles.BundleType.Javascript,
                                                currentItem,
                                                name
                                            );
                            _.chain(filesInDir).filter(function(a) { return a.endsWith(".mustache")}).each(tmpFiles.addFile, tmpFiles);
                            _.chain(filesInDir).filter(function(a) { return a.endsWith(".js") || a.endsWith(".jsx") || a.endsWith(".es6"); }).each(tmpFiles.addFile, tmpFiles);
                        }
                    });

                    jsFiles = tmpFiles.toJSON();

                    processJsBundle(options, jsBundle, bundleDir, jsFiles, bundleName, nextBundle);
                });
            };
            nextBundle();
        },
        function () {
            var next = this;
            var index = 0;
            var nextBundle = function () {
                if (index < cssBundles.length)
                    processBundle(cssBundles[index++]);
                else
                    next();
            };
            function processBundle(cssBundle) {
                var bundleDir = path.dirname(cssBundle);
                var bundleName = cssBundle.replace('.bundle', '');

                readTextFile(cssBundle, function (data) {
                    var cssFiles = removeCR(data).split("\n");
                    var options = bundlerOptions.getOptionsForBundle(cssFiles);

                    bundleName = bundleFileUtility.getOutputFilePath(bundleName, bundleName, options);

                    var tmpFiles = collection.createBundleFiles(cssBundle);

                    cssFiles.forEach(function(name) {

                        if(name.startsWith('#')) { return; }

                        var currentItem = bundleDir + '/' +  name;
                        var stat = fs.statSync(currentItem);
                        if(!stat.isDirectory()) {
                            tmpFiles.addFile(name);
                        }
                        else if(currentItem != bundleDir + '/'){

                            var cssFiles = allFiles.getFilesInDirectory(
                                bundlefiles.BundleType.Css,
                                currentItem,
                                name);

                            _.each(cssFiles, tmpFiles.addFile, tmpFiles);
                        }
                    });

                    cssFiles = tmpFiles.toJSON();

                    processCssBundle(options, cssBundle, bundleDir, cssFiles, bundleName, nextBundle);
                });
            }
            nextBundle();
        },
        cb
    );
}

function processJsBundle(options, jsBundle, bundleDir, jsFiles, bundleName, cb) {

    var processedFiles = {};

    var allJsArr = [], allMinJsArr = [], index = 0, pending = 0;
    var whenDone = function () {
        var allJs = concat.files({
                files: allJsArr,
                fileType: file.type.JS,
                sourceMap: options.sourcemaps
            }),
            allMinJs = concat.files({
                files: allMinJsArr,
                fileType: file.type.JS,
                sourceMap: options.sourcemaps
            });

        var afterBundle = function () {
            var minFileName = bundleFileUtility.getMinFileName(bundleName, bundleName, options);

            bundleStatsCollector.AddFileHash(bundleName, allMinJs.code);

            file.write(allMinJs.code, allMinJs.map, file.type.JS, minFileName, options.siterootdirectory)
                .then(cb)
                .catch(handleError);

        };

        file.write(allJs.code, allJs.map, file.type.JS, bundleName, options.siterootdirectory)
            .then(afterBundle)
            .catch(handleError);

        if (options.require) {
            bundleStatsCollector.AddDebugFile(jsBundle, bundleName);
        } else {
            allJsArr.forEach(function(jsFile) {
                bundleStatsCollector.AddDebugFile(jsBundle, jsFile.path);
            });
        }

    };

    bundleStatsCollector.ClearStatsForBundle(jsBundle);

    jsFiles.forEach(function (file) {
        // Skip blank lines/files beginning with '.' or '#', but allow ../relative paths

        if (!(file = file.trim())
            || (file.startsWith(".") && !file.startsWith(".."))
            || file.startsWith('#')
            || processedFiles[file])
            return;

        processedFiles[file] = true;

        var isMustache = file.endsWith(".mustache");
        var isJsx = file.endsWith(".jsx");
        var isES6 = file.endsWith(".es6");
        var jsFile = isMustache ? file.replace(".mustache", ".js")
                   : isJsx ? file.replace(".jsx", ".js")
                   : isES6 ? file.replace(".es6", ".js")
	           : file;

        var filePath = path.join(bundleDir, file),
              jsPath = path.join(bundleDir, jsFile),
              jsPathOutput = bundleFileUtility.getOutputFilePath(bundleName, jsPath, options),
              minJsPath = bundleFileUtility.getMinFileName(bundleName, jsPathOutput,  options);
        
        var i = index++;
        pending++;
        Step(
            function () {

                var next = this;

                if (isMustache || isJsx || isES6) {
                    jsPath = jsPathOutput;
                }

                readTextFile(filePath, function(code) {

                    var compileOptions = getProcessCodeOptions(code, undefined, filePath, jsPathOutput, bundleDir, bundleStatsCollector, options);

                    if (isMustache) {

                        bundleStatsCollector.ParseMustacheForStats(jsBundle, code);
                        compile.mustache(compileOptions).then(next).catch(handleError);

                    } else if (isJsx) {

                        bundleStatsCollector.ParseJsForStats(jsBundle, code);
                        compile.jsx(compileOptions).then(next).catch(handleError);

                    } else if (isES6) {

                        bundleStatsCollector.ParseJsForStats(jsBundle, code);
                        compile.es6(compileOptions).then(next).catch(handleError);

                    } else {

                        bundleStatsCollector.ParseJsForStats(jsBundle, code);
                        next({
                            path: jsPath,
                            code: code
                        });

                    }


                });

            },
            function (js) {
                allJsArr[i] = js;
                var withMin = function (minJs) {
                    allMinJsArr[i] = minJs;

                    if (! --pending) whenDone();
                };

                var minifyOptions = getProcessCodeOptions(js.code, js.map, jsPath, minJsPath, bundleDir, bundleStatsCollector, options);
                minify.js(minifyOptions).then(withMin).catch(handleError);
            }
        );
    });
}

function processCssBundle(options, cssBundle, bundleDir, cssFiles, bundleName, cb) {

    var processedFiles = {};

    var allCssArr = [], allMinCssArr = [], index = 0, pending = 0;
    var whenDone = function () {
        var allCss = concat.files({
                files: allCssArr,
                fileType: file.type.CSS,
                sourceMap: options.sourcemaps
            }),
            allMinCss = concat.files({
                files: allMinCssArr,
                fileType: file.type.CSS,
                sourceMap: options.sourcemaps
            });

        var afterBundle = function () {

            if(urlVersioning) {
                allMinCss.code = urlVersioning.VersionUrls(allMinCss.code);
            }

            cssValidator.validate(cssBundle, allMinCss.code, function(err) {
                if (err) {
                    handleError(err);
                    return;
                }

                var minFileName = bundleFileUtility.getMinFileName(bundleName, bundleName, options);

                file.write(allMinCss.code, allMinCss.map, file.type.CSS, minFileName, options.siterootdirectory)
                    .then(cb)
                    .catch(handleError);

            });
        };

        bundleStatsCollector.AddFileHash(bundleName, allMinCss.code);

        file.write(allCss.code, allCss.map, file.type.CSS, bundleName, options.siterootdirectory)
            .then(afterBundle)
            .catch(handleError);

        allCssArr.forEach(function(cssFile) {
            bundleStatsCollector.AddDebugFile(cssBundle, cssFile.path);
        });
    };

    bundleStatsCollector.ClearStatsForBundle(cssBundle);

    cssFiles.forEach(function (file) {
        if (!(file = file.trim())
            || (file.startsWith(".") && !file.startsWith(".."))
            || file.startsWith('#')
            || processedFiles[file])
            return;

        processedFiles[file] = true;

        var isLess = file.endsWith(".less");
        var isSass = (file.endsWith(".sass") || file.endsWith(".scss"));
        var cssFile = isLess ?
            file.replace(".less", ".css")
            : isSass ?
            file.replace(".sass", ".css").replace(".scss", ".css") :
            file;

        var filePath = path.join(bundleDir, file),
            cssPath = path.join(bundleDir, cssFile),
            cssPathOutput = bundleFileUtility.getOutputFilePath(bundleName, cssPath, options),
            minCssPath = bundleFileUtility.getMinFileName(bundleName, cssPathOutput, options);

        var i = index++;
        pending++;
        Step(
            function () {

                var next = this;

                if (isLess || isSass) {
                    cssPath = cssPathOutput;
                }

                readTextFile(filePath, function(code) {

                    var compileOptions = getProcessCodeOptions(code, undefined, filePath, cssPathOutput, bundleDir, bundleStatsCollector, options);

                    if (isLess) {

                        compile.less(compileOptions).then(next).catch(handleError);

                    } else if (isSass) {

                        compile.sass(compileOptions).then(next).catch(handleError);

                    } else {

                        next({
                            path: cssPath,
                            code: code
                        });

                    }

                });

            },
            function (css) {
                allCssArr[i] = css;
                var withMin = function (minCss) {
                    allMinCssArr[i] = minCss;

                    if (! --pending) whenDone();
                };

                var minifyOptions = getProcessCodeOptions(css.code, css.map, cssPath, minCssPath, bundleDir, bundleStatsCollector, options);
                minify.css(minifyOptions).then(withMin).catch(handleError);
            }
        );
    });
}

function getProcessCodeOptions(code, map, inputPath, outputPath, bundleDir, bundleStatsCollector, bundlerOptions) {

    return {
        code: code,
        map: map,
        inputPath: inputPath,
        outputPath: outputPath,
        bundleDir: bundleDir,
        bundleStatsCollector: bundleStatsCollector,
        sourceMap: bundlerOptions.sourcemaps,
        siteRoot: bundlerOptions.siterootdirectory,
        useTemplateDirs: bundlerOptions.usetemplatedirs
    };

}

function removeCR(text) {
    return text.replace(/\r/g, '');
}