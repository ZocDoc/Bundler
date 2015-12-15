
function Outputter(console, parameters, timer) {
    this.console = console;
    this.parameters = parameters;
    this.timer = timer;
};

exports.Outputter = Outputter;

Outputter.prototype.OutputTestResult = function(fileName, parsedOutput)
{
    this.console.log('\tFinished: '  + fileName.replace(".\\", "")
        + '\n\t\tTime:\t' + parsedOutput.time
        + '\n\t\tPassed:\t' + parsedOutput.passed
        + '\n\t\tFailed:\t' + parsedOutput.failed
        + (parsedOutput.errors ? "\n\t\tErrors: " + parsedOutput.errors : "")
        + "\n");
};

Outputter.prototype.OutputFinalResult = function(finalResults)
{
    var time = this.timer.Finish();

    this.console.log('Finished All Tests');
    this.console.log('');
    this.console.log('\tTotal Time:\t%d seconds', time.toFixed(3));
    this.console.log('\tTotal Tests:\t' +  finalResults.total);
    this.console.log('\tPassed Tests:\t' +  finalResults.passed);
    this.console.log('\tFailed Tests:\t' +  finalResults.failed);
    this.console.log('\n');
};