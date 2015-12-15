
function Runner(async, exec, parameters, output, parser) {
    this.async = async;
    this.exec = exec;
    this.parameters = parameters;
    this.output = output;
    this.parser = parser;
    this.finalResults = {
        total: 0,
        passed: 0,
        failed: 0
    };
};

exports.Runner = Runner;

var addToFinalResults = function(runner, parsedOutput) {
    runner.finalResults.total += parsedOutput.total;
    runner.finalResults.passed += parsedOutput.passed;
    runner.finalResults.failed += parsedOutput.failed;
};

Runner.prototype.RunTests = function(err, results, type, callback) {

    if(err) {
        console.log(err);
        return;
    }

    var _this = this;
    var tasks = [];
    results.forEach(function(fileName) {

        if(fileName.toLowerCase().indexOf('spec') < 0) {
            return;
        }

        var file = "." + fileName.split('tests')[1];
        tasks.push(function(cb){
            _this.exec("jasmine-node " + file, function(error, stdout, stderr) {

                var parsedOutput = _this.parser.Parse(file, stdout);
                _this.output.OutputTestResult(file, parsedOutput);

                addToFinalResults(_this,parsedOutput);

                cb();
            });
        });
    });

    this.async.parallel(tasks, function(){
        callback();
    });
};

Runner.prototype.GetFinalResults = function() {
    return this.finalResults;
};
