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
    jsp = require("uglify-js").parser,
    pro = require("uglify-js").uglify,
    less = require('less'),
    sass = require('node-sass'),
    stylus = require('stylus'),
    nib = require('nib'),
    hogan = require('hogan.js-template/lib/hogan.js'),
    coffee = require('coffee-script'),
    livescript = require('livescript'),
    react = require('react-tools'),
    babel = require('babel-core'),
    CleanCss = require('clean-css'),
    Step = require('step'),
    startedAt = Date.now(),
    hashingRequire = require('./bundle-stats.js'),
    bundlefiles = require('./bundle-files.js'),
    bundleStatsCollector = new hashingRequire.BundleStatsCollector(),
    optionsRequire = require('./bundle-options.js'),
    bundleFileUtilityRequire = require('./bundle-file-utility.js'),
    bundleFileUtility,
    bundlerOptions = new optionsRequire.BundlerOptions(),
    urlRewrite = require('./bundle-url-rewrite.js'),
    ext = require('./string-extensions.js'),
    _ = require('underscore'),
    collection = require('./collection'),
    cssValidator = require('./css-validator'),
    urlVersioning = null;

bundleFileUtility = new bundleFileUtilityRequire.BundleFileUtility(fs);

function ArgumentisOptional(arg) {
    return arg.startsWith('#') || arg.startsWith('-');
}

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

        var isCoffee = file.endsWith(".coffee");
        var isLiveScript = file.endsWith(".ls");
        var isMustache = file.endsWith(".mustache");
        var isJsx = file.endsWith(".jsx");
        var isES6 = file.endsWith(".es6");
        var jsFile = isCoffee ? file.replace(".coffee", ".js")
                   : isLiveScript ? file.replace(".ls", ".js")
                   : isMustache ? file.replace(".mustache", ".js")
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
                if (isCoffee) {
                    readTextFile(filePath, function (coffee) {
                        getOrCreateJs(options, coffee, filePath, jsPath, next);
                    });
                } else if(isLiveScript){
                    readTextFile(filePath, function(livescriptText){
                        getOrCreateJsLiveScript(options, livescriptText, filePath, jsPath, next);
                    });
                } else if(isMustache){

                    jsPath = jsPathOutput;
                    readTextFile(filePath, function(mustacheText){

                        if(options.outputbundlestats) {
                            bundleStatsCollector.ParseMustacheForStats(jsBundle,mustacheText);
                        }

                        getOrCreateJsMustache(options, mustacheText, filePath, jsPathOutput, next);
                    });  
                } else if (isJsx) {
                    jsPath = jsPathOutput;
                    readTextFile(filePath, function (jsxText) {
                        if (options.outputbundlestats) {
                            bundleStatsCollector.ParseJsForStats(jsBundle, jsxText);
                        }
                        getOrCreateJsx(options, jsxText, filePath, jsPathOutput, next);
                    });
                } else if (isES6) {
                    jsPath = jsPathOutput;
                    readTextFile(filePath, function(es6Text) {
                        if (options.outputbundlestats) {
                            bundleStatsCollector.ParseJsForStats(jsBundle, es6Text);
                        }
                        getOrCreateES6(options, es6Text, filePath, jsPathOutput, next);
                    });
                } else {
                    readTextFile(jsPath, function(jsText) {
                        if(options.outputbundlestats) {
                            bundleStatsCollector.ParseJsForStats(jsBundle,jsText);
                        }
                        next(jsText);
                    });
                }

                if(options.outputbundlestats) {
                    bundleStatsCollector.AddDebugFile(jsBundle, jsPath);
                }
            },
            function (js) {
                allJsArr[i] = js;
                var withMin = function (minJs) {
                    allMinJsArr[i] = minJs;

                    if (! --pending) whenDone();
                };

                if (options.skipmin) {
                    withMin('');
                } else if (/(\.min\.|\.pack\.)/.test(file) && options.skipremin) {
                    readTextFile(jsPath, withMin);
                }  else {
                    getOrCreateMinJs(options, js, jsPath, minJsPath, withMin);
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
        var isStylus = file.endsWith(".styl");
        var cssFile = isLess ?
            file.replace(".less", ".css")
            : isSass ?
            file.replace(".sass", ".css").replace(".scss", ".css")
            : isStylus ?
            file.replace(".styl", ".css") :
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
                if (isLess) {
                    cssPath = cssPathOutput;
                    readTextFile(filePath, function (lessText) {
                        getOrCreateLessCss(options, lessText, filePath, cssPathOutput, next);
                    });
                } else if (isSass) {
                    cssPath = cssPathOutput;
                    readTextFile(filePath, function (sassText) {
                        getOrCreateSassCss(options, sassText, filePath, cssPathOutput, next);
                    });
				} else if (isStylus){
					readTextFile(filePath, function (stylusText) {
						getOrCreateStylusCss(options, stylusText, filePath, cssPath, next);
					});
                } else {
                    readTextFile(cssPath, next);
                }

                if(options.outputbundlestats) {
                    bundleStatsCollector.AddDebugFile(cssBundle, cssPath);
                }

            },
            function (css) {
                allCssArr[i] = css;
                var withMin = function (minCss) {
                    allMinCssArr[i] = minCss;

                    if (! --pending) whenDone();
                };

                if (options.skipmin) {
                    withMin('');
                } else if (/(\.min\.|\.pack\.)/.test(file) && options.skipremin) {
                    readTextFile(cssPath, withMin);
                }else {
                    getOrCreateMinCss(options, css, cssPath, minCssPath, withMin);
                }
            }
        );
    });
}

function getOrCreateJs(options, coffeeScript, csPath, jsPath, cb /*cb(js)*/) {
    compileAsync(options, "compiling", function (coffeeScript, csPath, cb) {
            cb(coffee.compile(coffeeScript));
        }, coffeeScript, csPath, jsPath, cb);
}

function getOrCreateJsLiveScript(options, livescriptText, lsPath, jsPath, cb /*cb(js)*/) {
    compileAsync(options, "compiling", function (livescriptText, lsPath, cb) {
            cb(livescript.compile(livescriptText));
        }, livescriptText, lsPath, jsPath, cb);
}

function getOrCreateJsx(options, jsxText, jsxPath, jsPath, cb) {
    compileAsync(options, "compiling", function(jsxText, jsxPath, cb) {
            cb(react.transform(jsxText));
        }, jsxText, jsxPath, jsPath, cb);
}

function getOrCreateES6(options, es6Text, es6Path, jsPath, cb) {
    compileAsync(options, "compiling", function(es6Text, es6Path, cb) {
            var result = babel.transform(es6Text, {
                presets: [
                    path.join(__dirname, "node_modules", "babel-preset-es2015"),
                    path.join(__dirname, "node_modules", "babel-preset-react")
                ]
            });
            cb(result.code);
        }, es6Text, es6Path, jsPath, cb);
}

function getOrCreateJsMustache(options, mustacheText, mPath, jsPath, cb /*cb(js)*/) {

	compileAsync(options, "compiling", function (mustacheText, mPath, cb) {
            var templateName = path.basename(mPath, path.extname(mPath)); 
            if (options.usetemplatedirs){
                var splitPath = mPath.replace(".mustache", "").split(path.sep);
                var templateIndex = splitPath.indexOf("templates");
                templateName = splitPath.slice(templateIndex + 1).join("-");
            }
            var templateObject = "{ code: " + hogan.compile(mustacheText, { asString: true })
                            + ", partials: {}, subs: {} }";
            var compiledTemplate = "window[\"JST\"] = window[\"JST\"] || {};"
                        + " JST['"
                        + templateName
                        + "'] = new Hogan.Template("+ templateObject + ");";
            cb(compiledTemplate);
        }, mustacheText, mPath, jsPath, cb);
}

function getOrCreateMinJs(options, js, jsPath, minJsPath, cb /*cb(minJs)*/) {
    compileAsync(options, "minifying", function (js, jsPath, cb) {
        cb(minifyjs(js, jsPath));
    }, js, jsPath, minJsPath, cb);
}

function getOrCreateLessCss(options, less, lessPath, cssPath, cb /*cb(css)*/) {
    compileAsync(options, "compiling", compileLess, less, lessPath, cssPath, cb);
}

function getOrCreateSassCss(options, sassText, sassPath, cssPath, cb /*cb(sass)*/) {
    compileAsync(options, "compiling", compileSass, sassText, sassPath, cssPath, cb);
}

function getOrCreateStylusCss(options, stylusText, stylusPath, cssPath, cb /*cb(css)*/) {
    compileAsync(options, "compiling", function (stylusText, stylusPath, cb) {
        stylus(stylusText)
			.set('filename', stylusPath)
			.use(nib())
			.render(function(err, css){
				if(err){
					throw new Error(err);
				}

				cb(css);
			});
    }, stylusText, stylusPath, cssPath, cb);
}

function getOrCreateMinCss(options, css, cssPath, minCssPath, cb /*cb(minCss)*/) {
    compileAsync(options, "minifying", function (css, cssPath, cb) {
            new CleanCss({
                advanced: false,
                restructuring: false
            }).minify(css, function(err, minCss) {
                if (err) {
                    throw err;
                }
                cb(minCss.styles);
            });
        }, css, cssPath, minCssPath, cb);
}

function compileAsync(options, mode, compileFn /*compileFn(text, textPath, cb(compiledText))*/,
    text, textPath, compileTextPath, cb /*cb(compiledText)*/) {
	
    Step(
        function () {
            fs.exists(compileTextPath, this);
        },
        function (exists) {

            var next = this;
            if (!exists)
                next(!exists);
            else {
                fs.stat(textPath, function (_, textStat) {
                    fs.stat(compileTextPath, function (_, minTextStat) {

                        var shouldCompile = minTextStat.mtime.getTime() < textStat.mtime.getTime();

                        if(bundlerOptions.DefaultOptions.outputbundlestats && !shouldCompile) {
                            var imports = bundleStatsCollector.GetImportsForFile(textPath) || [];

                            for(var i=0; i < imports.length; i++) {
                                
                                var importStat = fs.statSync(imports[i]);

                                shouldCompile = minTextStat.mtime.getTime() < importStat.mtime.getTime();

                                if(shouldCompile) {
                                    break;
                                }
                            }
                        };

                        next(shouldCompile);
                    });
                });
            }
        },
        function (doCompile) {
            if (doCompile) {
                var onAfterCompiled = function(minText) {
                    if (options.outputbundleonly) {
                        cb(minText);
                    } else {
                        fs.writeFile(compileTextPath, minText, 'utf-8', function(_) {
                            cb(minText);
                        });
                    }
                };
                compileFn(text, textPath, onAfterCompiled);
            } else {
                readTextFile(compileTextPath, cb);
            }
        }
    );
}

function compileLess(lessCss, lessPath, cb) {
    var lessDir = path.dirname(lessPath),
        fileName = path.basename(lessPath),
        options = {
            paths: ['.', lessDir], // Specify search paths for @import directives
            filename: fileName
        };

    if(bundlerOptions.DefaultOptions.outputbundlestats) {
        bundleStatsCollector.SearchForLessImports(lessPath, lessCss);
    }

    less.render(lessCss, options, function (err, css) {
        if (err) handleError(err);
        cb(css.css);
    });
}

function compileSass(sassCss, sassPath, cb) {
    var explodedSassPath = sassPath.split('\\');

    if (explodedSassPath.length == 0) {
        explodedSassPath = sassPath.split('/');
    }

    var sassFileName = explodedSassPath.pop();
    var includePaths = [sassPath.replace(sassFileName, '')];

    sass.render({
        data: sassCss,
        includePaths: includePaths
    }, function(error, result) {

        if(error) {
            handleError(error);
        }
        else {
            cb(result.css.toString());
        }
    });
}

function minifyjs(js, fileName) {
    try {
        var ast = jsp.parse(js);
        ast = pro.ast_mangle(ast);
        ast = pro.ast_squeeze(ast);
        var minJs = pro.gen_code(ast);
        return minJs;
    }
    catch(e) {
        e.FileName = path.basename(fileName);
        delete e.stack;
        throw e;
    }
}

function removeCR(text) {
    return text.replace(/\r/g, '');
}

function stripBOM(content) {
    // Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
    // because the buffer-to-string conversion in `fs.readFileSync()`
    // translates it to FEFF, the UTF-16 BOM.
    if (content.charCodeAt(0) === 0xFEFF) {
        content = content.slice(1);
    }
    return content;
}

function readTextFile(filePath, cb) {
    fs.readFile(filePath, 'utf-8', function(err, fileContents) {
        if (err) throw err;
        cb(stripBOM(fileContents));
    });
}
