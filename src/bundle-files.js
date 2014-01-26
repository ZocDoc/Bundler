/*
MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

String.prototype.endsWith = function (suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};
String.prototype.startsWith = function (str) {
    return this.indexOf(str) === 0;
};
String.prototype.endsWithAny = function (endings) {
    var str = this;
    return endings.some(function (ending) { return str.endsWith(ending); });
};
String.prototype.NormalizeSlash = function () {
    if (this.endsWith("/")) {
        return this.substring(0, this.length - 1);
    }
    return this;
};

function BundleFiles() {
    this.files = [];
};

exports.BundleFiles = BundleFiles;
exports.BundleType = { Javascript: "Javascript", Css: "Css" };


BundleFiles.prototype.jsMatches = function (fileName, bundleDir, recursive, path) {

    if (!fileName.startsWith(bundleDir)) return '#';
    if (!fileName.endsWithAny(['.js', '.coffee', '.ls', '.ts', '.mustache'])) return '#';
    if (fileName.endsWith('.min.js')) return '#';
    if (!recursive && (path.dirname(fileName) !== bundleDir)) return '#';
    return fileName.substring(bundleDir.length + 1);
};

BundleFiles.prototype.cssMatches = function(fileName, bundleDir, recursive, path) {

    if (!fileName.startsWith(bundleDir)) return '#';
    if (!fileName.endsWithAny(['.css', '.less', '.sass', '.scss', '.styl'])) return '#';
    if (fileName.endsWith('.min.css')) return '#';
    if (!recursive && (path.dirname(fileName) !== bundleDir)) return '#';
    return fileName.substring(bundleDir.length + 1);
};


BundleFiles.prototype.addFiles = function (filesToAdd) {
    var _this = this;
    _this.files = _this.files.concat(filesToAdd);
};

BundleFiles.prototype.addFile = function (fileToAdd) {
    var _this = this;
    _this.files.push(fileToAdd);
};

BundleFiles.prototype.getBundles = function (fileType) {
    var _this = this;
    if (fileType == exports.BundleType.Javascript) {
        return _this.files.filter(function (file) { return file.endsWith(".js.bundle"); });
    }
    else {
        return _this.files.filter(function (file) { return file.endsWith(".css.bundle"); });
    }
};

BundleFiles.prototype.getFilesInDirectory = function (fileType, bundleDir, currentDir) {
    var _this = this,
        matcher = fileType == exports.BundleType.Javascript ? _this.jsMatches : _this.cssMatches,
        output = [];

    bundleDir = bundleDir.NormalizeSlash();
    currentDir = currentDir.NormalizeSlash();

    _this.files.map(function (fileName) {
        var match = matcher(fileName, bundleDir, true);
        return currentDir + '/' + match;
    })
    .forEach(function (name) {

        if (!name.endsWith('#')) {
            output.push(name);
        }
    });

    return output;
};

BundleFiles.prototype.getFilesInFolder = function (fileType, bundleDir, recursive, path) {
    var _this = this,
        matcher = fileType == exports.BundleType.Javascript ? _this.jsMatches : _this.cssMatches;

    return _this.files.map(function (fileName) {
        return matcher(fileName, bundleDir, recursive, path);
    });
}

