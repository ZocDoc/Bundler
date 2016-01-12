var processAsync = require('./process-async');

module.exports = {
    with: function(processFn) {
        return function(options) {
            return processAsync(options, processFn);
        };
    }
};