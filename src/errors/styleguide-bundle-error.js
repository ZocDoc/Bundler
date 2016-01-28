var _ = require('underscore');
var path = require('path');

var StyleguideBundleError = function(bundleFile, referencedFile) {
    this.bundleFile = bundleFile;
    this.reference = referencedFile;
    this.message = path.basename(this.bundleFile) + ' includes styleguide file ' + this.reference;

    var err = Error.call(this, this.message);
    err.name = this.name = 'StyleguideBundleError';
    this.stack = err.stack;
};

_.extend(StyleguideBundleError.prototype, Error.prototype);

module.exports = StyleguideBundleError;