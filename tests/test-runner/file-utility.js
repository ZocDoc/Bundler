
function FileUtility(fileSystem, path) {
    this.fileSystem = fileSystem;
    this.path = path;
};

exports.FileUtility = FileUtility

FileUtility.prototype.GetTestFiles = function(directory, callback) {
    var results = [];
    var _this = this;
    _this.fileSystem.readdir(directory, function(err, list) {
        if (err) return callback(err);
        var pending = list.length;
        if (!pending) return callback(null, results);
        list.forEach(function(file) {
            file =_this.path.resolve(directory, file);
            _this.fileSystem.stat(file, function(err, stat) {
                if (stat && stat.isDirectory()) {
                    _this.GetTestFiles(file, function(err, res) {
                        results = results.concat(res);
                        if (!--pending) callback(null, results);
                    });
                } else {
                    results.push(file);
                    if (!--pending) callback(null, results);
                }
            });
        });
    });
};