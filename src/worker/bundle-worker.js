var fs = require("fs"),
path = require("path"),
Step = require('step'),
hashingRequire = require('../bundle-stats.js'),
bundlefiles = require('../bundle-files.js'),
bundleStatsCollector = new hashingRequire.BundleStatsCollector(),
optionsRequire = require('../bundle-options.js'),
bundleFileUtilityRequire = require('../bundle-file-utility.js'),
bundleFileUtility,
bundlerOptions = new optionsRequire.BundlerOptions(),
urlRewrite = require('../bundle-url-rewrite.js'),
_ = require('underscore'),
collection = require('../collection'),
cssValidator = require('../css-validator'),
readTextFile = require('../read-text-file').readTextFile,
readTextFilePs = require('../read-text-file').readTextFilePs,
compile = require('../compile'),
minify = require('../minify'),
concat = require('../concat'),
file = require('../file'),
webpack = require('../webpack'),
sourceMap = require('convert-source-map'),
urlVersioning = null,
Promise = require('bluebird'),
process = require('process');
 

bundleFileUtility = new bundleFileUtilityRequire.BundleFileUtility(fs);
allFiles = new bundlefiles.BundleFiles();

function initBundleOptions(args){

    console.log("init bundle options: " + args)

    bundlerOptions.ParseCommandLineArgs(args);

    if (!bundlerOptions.Directories.length) {
        throw "No directories were specified. Usage: bundler.js [#option:value] ../Content [../Scripts]"
    }

    if(bundlerOptions.DefaultOptions.statsfileprefix) {
        bundleStatsCollector.setFilePrefix(bundlerOptions.DefaultOptions.statsfileprefix);
    }

    if(bundlerOptions.DefaultOptions.rewriteimagefileroot && bundlerOptions.DefaultOptions.rewriteimageoutputroot) {
        urlVersioning = new urlRewrite.BundleUrlRewriter(
            fs,
            bundlerOptions.DefaultOptions.rewriteimageoutputroot,
            bundlerOptions.DefaultOptions.rewriteimagefileroot,
            bundlerOptions.DefaultOptions.hashedfiledirectory
        );
    }

    bundleStatsCollector.Console = console;
    bundleStatsCollector.LoadStatsFromDisk(bundlerOptions.DefaultOptions.outputdirectory || process.cwd());
}

function initAllFilesObject(allFilesObj){
    allFiles.files = allFilesObj.files;
    allFiles._jsBundles = allFilesObj._jsBundles;
    allFiles._jsDirectories = allFilesObj._jsDirectories;
    allFiles._cssBundles = allFilesObj._cssBundles;
    allFiles._cssDirectories = allFilesObj._cssDirectories;
    allFiles.indexed = allFilesObj.indexed;
}

function removeCR(text) {
    return text.replace(/\r/g, '');
}

function processJs(jsBundle) {
    console.time('processJs-'+jsBundle);

    var bundleDir = path.dirname(jsBundle);
    var bundleName = jsBundle.replace('.bundle', '');
  
    return readTextFilePs(jsBundle)
        .then(function(data){

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
                                    name,
                                    options
                                );
                _.chain(filesInDir).filter(function(a) { return a.endsWith(".mustache")}).each(tmpFiles.addFile, tmpFiles);
                _.chain(filesInDir).filter(function(a) { return a.endsWith(".js") || a.endsWith(".jsx") || a.endsWith(".es6") || a.endsWith(".json"); }).each(tmpFiles.addFile, tmpFiles);
            }
        });

        jsFiles = tmpFiles.toJSON();

        return new Promise((resolve, reject) => {
            processJsBundle(options, jsBundle, bundleDir, jsFiles, bundleName, function(){
                console.timeEnd('processJs-'+jsBundle);
                resolve()
            });                    
        });
    });
};

function processJsBundle(options, jsBundle, bundleDir, jsFiles, bundleName, cb) {

    var processedFiles = {};

    var allJsArr = [], allMinJsArr = [], index = 0, pending = 0;
    var whenDone = function () {

        var sourceMap = options.sourcemaps && !options.webpack;

        concat.files({
                files: allJsArr,
                fileType: file.type.JS,
                sourceMap: sourceMap,
                require: options.require,
                bundleName: jsBundle,
                bundleStatsCollector: bundleStatsCollector
            })
            .then(function(allJs) {

                return file.write(allJs.code, allJs.map, file.type.JS, bundleName, options.siterootdirectory);

            })
            .then(function() {

                return concat.files({
                    files: allMinJsArr,
                    fileType: file.type.JS,
                    sourceMap: sourceMap,
                    require: options.require,
                    bundleName: jsBundle,
                    bundleStatsCollector: bundleStatsCollector
                });

            })
            .then(function(allMinJs) {

                var minFileName = bundleFileUtility.getMinFileName(bundleName, bundleName, options);
                var hash = bundleStatsCollector.AddFileHash(bundleName, allMinJs.code);

                if (bundlerOptions.DefaultOptions.hashedfiledirectory) {
                    return file.write(allMinJs.code, allMinJs.map, file.type.JS, minFileName, options.siterootdirectory)
                        .then(function() {
                            var fileNameWithHash = bundleFileUtility.getBundleWithHashname(bundleName, hash, options);
                            return file.write(allMinJs.code, allMinJs.map, file.type.JS, fileNameWithHash, options.siterootdirectory);
                        });
                } else {
                    return file.write(allMinJs.code, allMinJs.map, file.type.JS, minFileName, options.siterootdirectory);
                }
            })
            .then(cb)
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

    if (options.webpack) {
        webpack.validate({
            files: jsFiles,
            fileType: file.type.JS
        });
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
        var isJson = file.endsWith(".json");
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

                    var compileOptions = {
                        code: code,
                        originalPath: filePath,
                        inputPath: filePath,
                        outputPath: jsPathOutput,
                        bundleDir: bundleDir,
                        bundleStatsCollector: bundleStatsCollector,
                        sourceMap: options.sourcemaps,
                        require: options.require,
                        siteRoot: options.siterootdirectory,
                        useTemplateDirs: options.usetemplatedirs
                    };

                    if (isJson) {

                        bundleStatsCollector.ParseJsonForStats(jsBundle, filePath, code);
                        if (! --pending) whenDone();

                    } else if (isMustache) {

                        bundleStatsCollector.ParseMustacheForStats(jsBundle, code);
                        compile.mustache(compileOptions).then(next).catch(handleError);

                    } else if (isJsx) {

                        bundleStatsCollector.ParseJsForStats(jsBundle, code);
                        compile.jsx(compileOptions).then(next).catch(handleError);

                    } else if (isES6) {

                        bundleStatsCollector.ParseJsForStats(jsBundle, code);
                        compile.es6(compileOptions).then(next).catch(handleError);

                    } else {

                        if (options.webpack) {

                            code = sourceMap.removeComments(code);
                            code = sourceMap.removeMapFileComments(code);

                        }

                        bundleStatsCollector.ParseJsForStats(jsBundle, code);
                        next({
                            code: code,
                            path: jsPath,
                            originalPath: filePath
                        });

                    }


                });

            },
            function (js) {
                if (options.webpack) {

                    if (jsPath.endsWith('.min.js')) {
                        allMinJsArr[i] = js;
                    } else {
                        allJsArr[i] = js;
                    }

                    if (! --pending) whenDone();

                } else {

                    allJsArr[i] = js;
                    var withMin = function (minJs) {
                        allMinJsArr[i] = minJs;

                        if (! --pending) whenDone();
                    };

                    minify.js({
                        code: js.code,
                        map: js.map,
                        originalPath: filePath,
                        inputPath: jsPath,
                        outputPath: minJsPath,
                        bundleDir: bundleDir,
                        bundleStatsCollector: bundleStatsCollector,
                        sourceMap: options.sourcemaps,
                        siteRoot: options.siterootdirectory,
                        useTemplateDirs: options.usetemplatedirs
                    }).then(withMin).catch(handleError);

                }
            }
        );
    });
}


function processCss(cssBundle){   
    console.time('processCss-' + cssBundle);

    var bundleDir = path.dirname(cssBundle);
    var bundleName = cssBundle.replace('.bundle', '');

    return readTextFilePs(cssBundle)
        .then(function (data) {

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
                        name,
                        options
                    );

                    _.each(cssFiles, tmpFiles.addFile, tmpFiles);
                }
            });

            cssFiles = tmpFiles.toJSON();
            
            return new Promise((resolve, reject) => {
                processCssBundle(options, cssBundle, bundleDir, cssFiles, bundleName, function(){
                    console.timeEnd('processCss-' + cssBundle);
                    resolve();
                });
        });
    });
}

function processCssBundle(options, cssBundle, bundleDir, cssFiles, bundleName, cb) {

    var processedFiles = {};

    var allCssArr = [], allMinCssArr = [], index = 0, pending = 0;
    var whenDone = function () {

        var sourceMap = options.sourcemaps && !options.webpack;

        allCssArr.forEach(function(cssFile) {
            bundleStatsCollector.AddDebugFile(cssBundle, cssFile.path);
        });

        concat.files({
                files: allCssArr,
                fileType: file.type.CSS,
                sourceMap: sourceMap,
                bundleName: cssBundle,
                bundleStatsCollector: bundleStatsCollector
            })
            .then(function(allCss) {

                return file.write(allCss.code, allCss.map, file.type.CSS, bundleName, options.siterootdirectory);

            })
            .then(function() {

                return concat.files({
                    files: allMinCssArr,
                    fileType: file.type.CSS,
                    sourceMap: sourceMap,
                    bundleName: cssBundle,
                    bundleStatsCollector: bundleStatsCollector
                });

            })
            .then(function(allMinCss) {

                var code = allMinCss.code;
                if (urlVersioning) {
                    code = urlVersioning.VersionHashUrls(allMinCss.code);
                    allMinCss.code = urlVersioning.VersionUrls(allMinCss.code);
                }

                return new Promise.all([
                    cssValidator.validate(cssBundle, allMinCss),
                    cssValidator.validate(cssBundle, {
                        code: code
                    })
                ]);
            })
            .then(function(minifiedCss) {

                var allMinCss = minifiedCss[0];

                var hash = bundleStatsCollector.AddFileHash(bundleName, allMinCss.code);

                var minFileName = bundleFileUtility.getMinFileName(bundleName, bundleName, options);
                var fileNameWithHash = minFileName.replace('.min.', '__' + hash + '__' + '.min.');

                if (bundlerOptions.DefaultOptions.hashedfiledirectory) {
                    return file.write(allMinCss.code, allMinCss.map, file.type.CSS, minFileName, options.siterootdirectory)
                        .then(function() {
                            var fileNameWithHash = bundleFileUtility.getBundleWithHashname(bundleName, hash, options);
                            return file.write(minifiedCss[1].code, allMinCss.map, file.type.CSS, fileNameWithHash, options.siterootdirectory);
                        });
                } else {
                    return file.write(allMinCss.code, allMinCss.map, file.type.CSS, minFileName, options.siterootdirectory);
                }
            })
            .then(cb)
            .catch(handleError);

    };

    bundleStatsCollector.ClearStatsForBundle(cssBundle);

    if (options.webpack) {
        webpack.validate({
            files: cssFiles,
            fileType: file.type.CSS
        });
    }

    cssFiles.forEach(function (file) {
        if (!(file = file.trim())
            || (file.startsWith(".") && !file.startsWith(".."))
            || file.startsWith('#')
            || processedFiles[file])
            return;

        processedFiles[file] = true;

        var isLess = file.endsWith(".less");
        var cssFile = isLess ?
            file.replace(".less", ".css")
            : file;

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
                }

                readTextFile(filePath, function(code) {

                    var compileOptions = {
                        code: code,
                        originalPath: filePath,
                        inputPath: filePath,
                        outputPath: cssPathOutput,
                        bundleDir: bundleDir,
                        bundleStatsCollector: bundleStatsCollector,
                        sourceMap: options.sourcemaps,
                        siteRoot: options.siterootdirectory,
                        useTemplateDirs: options.usetemplatedirs
                    };

                    if (isLess) {

                        compile.less(compileOptions).then(next).catch(handleError);

                    } else {

                        if (options.webpack) {

                            code = sourceMap.removeComments(code);
                            code = sourceMap.removeMapFileComments(code);

                        }

                        next({
                            code: code,
                            path: cssPath,
                            originalPath: filePath
                        });

                    }

                });

            },
            function (css) {
                if (options.webpack) {

                    if (cssPath.endsWith('.min.css')) {
                        allMinCssArr[i] = css;
                    } else {
                        allCssArr[i] = css;
                    }

                    if (!--pending) whenDone();

                } else {

                    allCssArr[i] = css;
                    var withMin = function (minCss) {
                        allMinCssArr[i] = minCss;

                        if (!--pending) whenDone();
                    };

                    minify.css({
                        code: css.code,
                        map: css.map,
                        originalPath: filePath,
                        inputPath: cssPath,
                        outputPath: minCssPath,
                        bundleDir: bundleDir,
                        bundleStatsCollector: bundleStatsCollector,
                        sourceMap: options.sourcemaps,
                        siteRoot: options.siterootdirectory,
                        useTemplateDirs: options.usetemplatedirs
                    }).then(withMin).catch(handleError);

                }
            }
        );
    });
}

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

module.exports = function(input, done) {
    if(input.type == 'bundle-options')
    {
        initBundleOptions(input.args);
        initAllFilesObject(input.allFiles);
        done();
    }
    else if(input.type == 'compile-js')
    {
        processJs(input.bundle)
            .then(function(){
                done();
            });
    }
    else if(input.type == 'compile-css')
    {
        processCss(input.bundle)
            .then(function(){
                done();
            });
    }
    else if(input.type == 'get-stats')
    {
        done({
            bundleStatsCollector          
        });
    }
    else
    {
        done();
    }
};