var _ = require('underscore');

var TooManySelectorsError = function(file, numSelectors) {
    this.file = file;
    this.message = file + ' has ' + numSelectors + ' selectors, but IE only allows 4095';

    var err = Error.call(this, this.message);
    err.name = this.name = 'TooManySelectorsError';
    this.stack = err.stack;
};

_.extend(TooManySelectorsError.prototype, Error.prototype);

module.exports = TooManySelectorsError;