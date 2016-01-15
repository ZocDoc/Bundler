var processAsync = require('./process-async');

module.exports = {
    with: function(fileType, processFn) {
        return function(options) {
            return processAsync(fileType, options, processFn);
        };
    }
};