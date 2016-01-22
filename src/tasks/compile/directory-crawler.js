var fs = require('fs');
var path = require('path');

var cache = {};

function crawl(directory) {

    directory = path.resolve(path.normalize(directory));

    if (cache[directory]) {
        return cache[directory];
    }

    var directories = [directory];

    var directoryQueue = [directory];
    while (directoryQueue.length) {

        var currentDirectory = directoryQueue.shift();

        var subDirectories = fs.readdirSync(currentDirectory).map(function(file) {
            return path.join(currentDirectory, file);
        }).filter(function(file) {
            return fs.statSync(file).isDirectory();
        });

        directories = directories.concat(subDirectories);
        directoryQueue = directoryQueue.concat(subDirectories);

    }

    cache[directory] = directories;

    return directories;

}

module.exports = {
    crawl: crawl
};