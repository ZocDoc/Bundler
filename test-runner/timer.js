
function Timer(process) {
    this.process = process;
    this.start = null;
    this.end = null;
};

exports.Timer = Timer

Timer.prototype.Start = function() {
    this.start = this.process.hrtime();
};

Timer.prototype.Finish = function() {
    var end = this.process.hrtime(this.start);
    return end[0] + (end[1] / 1e9);
};