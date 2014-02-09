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
    HASH_FILE_NAME = 'bundle-hashes.json',
    DEBUG_FILE_NAME = 'bundle-debug.json';

function BundleStatsCollector(fileSystem) {

    this.FileSystem = fileSystem || fs;
    this.GenerateHash = function (fileText) {
        return hasher.createHash('md5').update(fileText).digest('hex');
    };
    this.HashCollection = { };
    this.DebugCollection = { };
    this.Console = { log: function () { } };
}

exports.BundleStatsCollector = BundleStatsCollector;
exports.HASH_FILE_NAME = HASH_FILE_NAME;
exports.DEBUG_FILE_NAME = DEBUG_FILE_NAME;

BundleStatsCollector.prototype.GetOutputFile = function (outputdirectory, filename) {
    var seperator = '/';
    if (outputdirectory[outputdirectory.length - 1] == seperator) {
        seperator = '';
    }
    return outputdirectory + seperator + filename;
}

BundleStatsCollector.prototype.LoadFromDisk = function(fileName) {

    var _this = this, ret;
    try {
        var file = _this.FileSystem.readFileSync(fileName, 'utf8')
        ret = JSON.parse(file);
    }
    catch (err) {
        ret = {};
    }
    return ret;
}

BundleStatsCollector.prototype.LoadStatsFromDisk = function (outputdirectory) {

    var _this = this,
        hashFile = _this.GetOutputFile(outputdirectory, HASH_FILE_NAME),
        debugFile = _this.GetOutputFile(outputdirectory, DEBUG_FILE_NAME);

    _this.HashCollection = _this.LoadFromDisk(hashFile);
    _this.DebugCollection = _this.LoadFromDisk(debugFile);
};

BundleStatsCollector.prototype.SaveStatsToDisk = function (outputdirectory) {

    var _this = this,
        hashFile = _this.GetOutputFile(outputdirectory, HASH_FILE_NAME),
        debugFile = _this.GetOutputFile(outputdirectory, DEBUG_FILE_NAME);

    _this.FileSystem.writeFileSync(hashFile, JSON.stringify(_this.HashCollection, null, 4));
    _this.FileSystem.writeFileSync(debugFile, JSON.stringify(_this.DebugCollection, null, 4));
}

BundleStatsCollector.prototype.AddFileHash = function (bundleName, bundleContents) {

    var _this = this;
    var hash = _this.GenerateHash(bundleContents),
        bundleShortName = bundleName.split('/').pop();

    _this.HashCollection[bundleShortName] = hash;
}

BundleStatsCollector.prototype.AddDebugFile = function (bundleName, fileName) {
    
    var _this = this,
        bundleShortName = bundleName.split('/').pop();

    if(!_this.DebugCollection[bundleShortName])
    {
        _this.DebugCollection[bundleShortName] = [];
    }

    if(_this.DebugCollection[bundleShortName].indexOf(fileName) < 0) {
        _this.DebugCollection[bundleShortName].push(fileName);
    }
}