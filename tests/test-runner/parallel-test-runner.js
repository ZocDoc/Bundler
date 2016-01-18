var fs = require('fs');
var path = require('path');
var async = require('async');
var exec = require('child_process').exec;
var process = require('process');

var parameters = new (require('./parameters.js')).Parameters(process.argv);
var timer = new (require('./timer.js')).Timer(process);
var fileUtility = new (require('./file-utility.js')).FileUtility(fs, path);
var parser = new (require('./parser.js')).Parser();
var output = new (require('./output.js')).Outputter(console, parameters, timer);
var runner = new (require('./runner.js')).Runner(async, exec, parameters, output, parser);

timer.Start();
process.chdir(require.main.filename.split('test-runner')[0]);

var testDirectories = [ 'unit', 'integration'];
var walkTasks = [];

testDirectories.forEach(function(directory){
    walkTasks.push(function(cb) {
        fileUtility.GetTestFiles('./' + directory, function(err, results) {
            runner.RunTests(err, results, directory, cb);
        });
    });
});

async.parallel(walkTasks, function(){
    var finalResults = runner.GetFinalResults();
    output.OutputFinalResult(finalResults);
});