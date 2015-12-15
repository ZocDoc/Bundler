
function Parser() {};

exports.Parser = Parser

var contains = function(text, searchFor) {
    var lowerCaseText = text.toLowerCase();
    var searchForLowerCase = searchFor.toLowerCase();
    return lowerCaseText.indexOf(searchForLowerCase) >= 0;
};

Parser.prototype.Parse = function(file, output) {

    var parsedOutput = {
        verbose: output,
        file: file,
        errors: null
    };

    var lines =  output.split("\n");

    lines.forEach(function(line) {

        var timeText = "Finished in";
        if(contains(line, timeText)) {
            parsedOutput.time = line.replace(timeText,"");
        }
        else if(contains(line, "assertions") && contains(line, "failure") && contains(line, "skipped")) {
            var metrics = line.split(',');
            metrics.forEach(function(metric){

                if(contains(metric, "tests")) {
                    var total = metric.replace(" tests", "")
                    parsedOutput.total = parseInt(total, 10);
                }
                else if(contains(metric, "failure") || contains(metric, "failures")) {
                    var failed = metric.replace("  failures", "").replace("  failure", "")
                    parsedOutput.failed = parseInt(failed, 10);
                }
            });
            parsedOutput.passed = parsedOutput.total - parsedOutput.failed;
        }
    });

    if(parsedOutput.failed > 0) {
        lines.splice(0,1);
        for(var i = lines.length -1; i--; i >=0) {
            if(lines[i] == '') {
                lines.splice(i,1);
            }
        }
        lines.splice(0,1);
        lines.splice(lines.length - 1, 1);
        lines.splice(lines.length - 1, 1);
        lines.splice(lines.length - 1, 1);
        parsedOutput.errors = '\n\t\t' + lines.join('\n\t\t')
    }

    return  parsedOutput;
};