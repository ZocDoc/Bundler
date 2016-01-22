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
    processAsync = require('./process-async'),
    compile = require('./compile'),
    minify = require('./minify'),
    fileType = require('./file').type,
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

if(bundlerOptions.DefaultOptions.outputbundlestats) {
    bundleStatsCollector.Console = console;
    bundleStatsCollector.LoadStatsFromDisk(bundlerOptions.DefaultOptions.outputdirectory ||  process.cwd());
}

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

        if(bundlerOptions.DefaultOptions.outputbundlestats) {
            bundleStatsCollector.SaveStatsToDisk(bundlerOptions.DefaultOptions.outputdirectory ||  process.cwd());
        }
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

                    if(options.directory !== undefined) {
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
                    }
                    else if (options.folder !== undefined) {
                        options.nobundle = !options.forcebundle;
                        var recursive = options.folder === 'recursive';
                        jsFiles = allFiles.getFilesInFolder(bundlefiles.BundleType.Javascript, bundleDir, recursive, path);
                    }
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

                    if(options.directory !== undefined) {
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
                    }
                    else if (options.folder !== undefined) {
                        options.nobundle = !options.forcebundle;
                        var recursive = options.folder === 'recursive';
                        cssFiles = allFiles.getFilesInFolder(bundlefiles.BundleType.Css, bundleDir, recursive, path);
                    }
                    processCssBundle(options, cssBundle, bundleDir, cssFiles, bundleName, nextBundle);
                });
            };
            nextBundle();
        },
        cb
    );
}

function processJsBundle(options, jsBundle, bundleDir, jsFiles, bundleName, cb) {

    var processedFiles = {};

    var allJsArr = [], allMinJsArr = [], index = 0, pending = 0;
    var whenDone = function () {
        if (options.nobundle) {
            setTimeout(cb, 0);
            return;
        }

        var allJs = "", allMinJs = "";
        for (var i = 0; i < allJsArr.length; i++) {
            allJs += ";" + allJsArr[i] + "\n";
            allMinJs += ";" + allMinJsArr[i] + "\n";
        }

        var afterBundle = options.skipmin ? cb : function (_) {
            var minFileName = bundleFileUtility.getMinFileName(bundleName, bundleName, options);
			
            if(options.outputbundlestats) {
                bundleStatsCollector.AddFileHash(bundleName, allMinJs);
            }

            fs.writeFile(minFileName, allMinJs, cb);
        };
        if (!options.bundleminonly) {
            fs.writeFile(bundleName, allJs, afterBundle);
        } else {
            afterBundle();
        }
    };

    if(options.outputbundlestats) {
        bundleStatsCollector.ClearStatsForBundle(jsBundle);
    }

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

                if (options.outputbundlestats) {
                    bundleStatsCollector.AddDebugFile(jsBundle, jsPath);
                }

                readTextFile(filePath, function(code) {

                    var compileOptions = getProcessAsyncOptions(code, filePath, jsPathOutput, bundleDir, bundleStatsCollector, options),
                        compiler;

                    if (options.outputbundlestats) {
                        if (isMustache) {
                            bundleStatsCollector.ParseMustacheForStats(jsBundle, code);
                        } else {
                            bundleStatsCollector.ParseJsForStats(jsBundle, code);
                        }
                    }

                    if (isMustache) {
                        compiler = compile.mustache;
                    } else if (isJsx) {
                        compiler = compile.jsx;
                    } else if (isES6) {
                        compiler = compile.es6;
                    } else {
                        compiler = compile.js;
                    }

                    processAsync(fileType.JS, compileOptions, compiler)
                        .then(next)
                        .catch(handleError);


                });

            },
            function (js) {
                allJsArr[i] = js.code;
                var withMin = function (minJs) {
                    allMinJsArr[i] = minJs.code;

                    if (! --pending) whenDone();
                };

                if (options.skipmin) {
                    withMin({});
                } else if (/(\.min\.|\.pack\.)/.test(file) && options.skipremin) {
                    readTextFile(jsPath, function(code) {
                        withMin({
                            code: code
                        })
                    });
                }  else {
                    var minifyOptions = getProcessAsyncOptions(js.code, jsPath, minJsPath, bundleDir, bundleStatsCollector, options);

                    processAsync(fileType.JS, minifyOptions, minify.js)
                        .then(withMin)
                        .catch(handleError);
                }
            }
        );
    });
}

function processCssBundle(options, cssBundle, bundleDir, cssFiles, bundleName, cb) {

    var processedFiles = {};

    var allCssArr = [], allMinCssArr = [], index = 0, pending = 0;
    var whenDone = function () {
        if (options.nobundle) {
            setTimeout(cb, 0);
            return;
        }

        var allCss = "", allMinCss = "";
        for (var i = 0; i < allCssArr.length; i++) {
            allCss += allCssArr[i] + "\n";
            allMinCss += allMinCssArr[i] + "\n";
        }

        var afterBundle = options.skipmin ? cb : function (_) {

            if(urlVersioning) {
                allMinCss = urlVersioning.VersionUrls(allMinCss);
            }

            cssValidator.validate(cssBundle, allMinCss, function(err) {
                if (err) {
                    handleError(err);
                    return;
                }

                var minFileName = bundleFileUtility.getMinFileName(bundleName, bundleName, options);
                fs.writeFile(minFileName, allMinCss, cb);
            });
        };

        if (!options.bundleminonly) {
            if(options.outputbundlestats) {
                bundleStatsCollector.AddFileHash(bundleName, allMinCss);
            }
            fs.writeFile(bundleName, allCss, afterBundle);
        } else {
            afterBundle();
        }
    };

    if(options.outputbundlestats) {
        bundleStatsCollector.ClearStatsForBundle(cssBundle);
    }

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

                if (options.outputbundlestats) {
                    bundleStatsCollector.AddDebugFile(cssBundle, cssPath);
                }

                readTextFile(filePath, function(code) {

                    var compileOptions = getProcessAsyncOptions(code, filePath, cssPathOutput, bundleDir, bundleStatsCollector, options),
                        compiler;

                    if (options.outputbundlestats && isLess) {
                        bundleStatsCollector.SearchForLessImports(filePath, code);
                    }

                    if (isLess) {
                        compiler = compile.less;
                    } else if (isSass) {
                        compiler = compile.sass;
                    } else {
                        compiler = compile.css;
                    }

                    processAsync(fileType.CSS, compileOptions, compiler)
                        .then(next)
                        .catch(handleError);

                });

            },
            function (css) {
                allCssArr[i] = css.code;
                var withMin = function (minCss) {
                    allMinCssArr[i] = minCss.code;

                    if (! --pending) whenDone();
                };

                if (options.skipmin) {
                    withMin({});
                } else if (/(\.min\.|\.pack\.)/.test(file) && options.skipremin) {
                    readTextFile(cssPath, function(code) {
                        withMin({
                            code: code
                        })
                    });
                } else {
                    var minifyOptions = getProcessAsyncOptions(css.code, cssPath, minCssPath, bundleDir, bundleStatsCollector, options);

                    processAsync(fileType.CSS, minifyOptions, minify.css)
                        .then(withMin)
                        .catch(handleError);
                }
            }
        );
    });
}

function getProcessAsyncOptions(code, inputPath, outputPath, bundleDir, bundleStatsCollector, bundlerOptions) {

    return {
        code: code,
        inputPath: inputPath,
        outputPath: outputPath,
        bundleDir: bundleDir,
        outputBundleOnly: bundlerOptions.outputbundleonly,
        outputBundleStats: bundlerOptions.outputbundlestats,
        bundleStatsCollector: bundleStatsCollector,
        sourceMap: bundlerOptions.sourcemaps,
        siteRoot: bundlerOptions.siterootdirectory,
        useTemplateDirs: bundlerOptions.usetemplatedirs
    };

}

function removeCR(text) {
    return text.replace(/\r/g, '');
}