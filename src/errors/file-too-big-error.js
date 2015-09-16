var _ = require('underscore');

var FileTooBigError = function(file, kbSize) {
    this.file = file;
    this.message = file + ' is ' + kbSize + 'kb, but IE only allows up to 278kb';

    var err = Error.call(this, this.message);
    err.name = this.name = 'FileTooBigError';
    this.stack = err.stack;
};

_.extend(FileTooBigError.prototype, Error.prototype);

module.exports = FileTooBigError;