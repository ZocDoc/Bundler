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

var fs = require("fs"),
    hasher = require('crypto'),
    FILE_NAME = 'bundle-hashes.json';

function BundleHasher(fileSystem) {

    this.FileSystem = fileSystem || fs;
    this.GenerateHash = function (fileText) {
        return hasher.createHash('md5').update(fileText).digest('hex');
    };
    this.HashCollection = { };
    this.Console = { log: function () { } };
}

exports.BundleHasher = BundleHasher;
exports.FILE_NAME = FILE_NAME;

BundleHasher.prototype.GetOutputFile = function (outputdirectory) {
    var seperator = '/';
    if (outputdirectory[outputdirectory.length - 1] == seperator) {
        seperator = '';
    }
    return outputdirectory + seperator + FILE_NAME
}

BundleHasher.prototype.LoadFileHashFromDisk = function (outputdirectory) {

    var _this = this,
        hashFile = _this.GetOutputFile(outputdirectory);

    try {
        var file = _this.FileSystem.readFileSync(hashFile, 'utf8')
        this.HashCollection = JSON.parse(file);
    }
    catch (err) {
        this.HashCollection = {};
    }
};

BundleHasher.prototype.SaveFileHashesToDisk = function (outputdirectory) {

    var _this = this,
        hashFile = _this.GetOutputFile(outputdirectory),
        fileContents = JSON.stringify(_this.HashCollection);

    _this.FileSystem.writeFileSync(hashFile, fileContents);
}

BundleHasher.prototype.AddFileHash = function (bundleName, bundleContents) {
    
    var _this = this;
    var hash = _this.GenerateHash(bundleContents),
        bundleShortName = bundleName.split('/').pop();

    this.HashCollection[bundleShortName] = hash;
}