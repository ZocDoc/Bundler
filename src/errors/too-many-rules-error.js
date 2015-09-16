var _ = require('underscore');

var TooManyRulesError = function(file, numSelectors) {
    this.file = file;
    this.message = file + ' has ' + numSelectors + ' rules, but IE only allows 4095';

    var err = Error.call(this, this.message);
    err.name = this.name = 'TooManyRulesError';
    this.stack = err.stack;
};

_.extend(TooManyRulesError.prototype, Error.prototype);

module.exports = TooManyRulesError;