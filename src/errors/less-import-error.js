var _ = require('underscore');

var LessImportError = function(file, importFile) {
    this.file = file;
    this.importFile = importFile;
    this.message = file + ' imports styleguide file ' + this.importFile;

    var err = Error.call(this, this.message);
    err.name = this.name = 'LessImportError';
    this.stack = err.stack;
};

_.extend(LessImportError.prototype, Error.prototype);

module.exports = LessImportError;