var _ = require('underscore');

function order(files, deps) {

    var fileOrder = {};

    _.each(files, function(file, filePath) {
        addFile(filePath, fileOrder, files, deps);
    });

    return fileOrder;

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

module.exports = order;