var _ = require('underscore');

function index(files) {

    var indices = {},
        index = 1;

    _.each(files, function(file, filePath) {
        indices[filePath] = index++;
    });

    return indices;

}

function addFile(filePath, fileOrder, files, deps) {

    if (fileOrder[filePath]) {
        return;
    }

    _.each(deps[filePath], function(dep) {
        if (dep.isPath) {
            addFile(dep.name, fileOrder, files, deps);
        }
    });

    fileOrder[filePath] = _.keys(fileOrder).length + 1;

}

module.exports = index;