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

const config = require('threads').config;
config.set({
  basepath : {
    node    : __dirname + '/worker/'
  }
});

const Pool = require('threads').Pool;
const os = require('os');
const cpuCount = os.cpus().length;
const pool = new Pool(cpuCount);

pool.run('bundle-worker.js');

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
    readTextFile = require('./read-text-file').readTextFile,
    readTextFilePs = require('./read-text-file').readTextFilePs,
    compile = require('./compile'),
    minify = require('./minify'),
    concat = require('./concat'),
    file = require('./file'),
    webpack = require('./webpack'),
    sourceMap = require('convert-source-map'),
    urlVersioning = null,
    Promise = require('bluebird');

bundleFileUtility = new bundleFileUtilityRequire.BundleFileUtility(fs);

process_args = process.argv.splice(2);
console.log('args: ' + process_args);

bundlerOptions.ParseCommandLineArgs(process_args);

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
        bundlerOptions.DefaultOptions.rewriteimagefileroot,
        bundlerOptions.DefaultOptions.hashedfiledirectory
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
        pool.killAll();
    }
})();

function scanDir(allFiles, cb) {

    allFiles.Index();

    // Couldn't find a nicer way to initialize the pool with args
    // Seems to be some interest in a 'send all' function though https://github.com/andywer/threads.js/issues/48
    Promise.all(
        _.range(cpuCount).map(i => pool.send({
                type: 'bundle-options',
                args: process_args,
                allFiles: allFiles
            }).promise())
    ).then(function(){
        
    var jsBundles  = allFiles.getBundles(bundlefiles.BundleType.Javascript);
    var cssBundles = allFiles.getBundles(bundlefiles.BundleType.Css);

    var jobs = _.map(jsBundles, function(bundle){
            return pool.send({
            type: 'compile-js',
            bundle
        }).promise()});

    jobs.concat(_.map(cssBundles, function(bundle){
            return pool.send({
            type: 'compile-css',
            bundle
        }).promise()}));

    console.log('starting ' + jobs.length + ' jobs');

    Promise
        .all(jobs)
        .then(function(){
            cb();
        })
        .catch(handleError);
    });
}