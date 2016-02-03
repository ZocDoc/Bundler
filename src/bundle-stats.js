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
    path = require('path'),
    collection = require('./collection'),
    HASH_FILE_NAME = 'bundle-hashes.json',
    DEBUG_FILE_NAME = 'bundle-debug.json',
    EXPORTS_FILE_NAME = 'bundle-exports.json',
    LOCALIZATION_FILE_NAME = 'bundle-localization-strings.json',
    LESS_IMPORTS_FILE = 'bundle-less-imports.json',
    AB_FILE_NAME = 'bundle-ab-configs.json';

function BundleStatsCollector(
    fileSystem
) {
    this.Path = path;
    this.FileSystem = fileSystem || fs;
    this.GenerateHash = function (fileText) {
        return hasher.createHash('md5').update(fileText).digest('hex');
    };
    this.HashCollection = { };
    this.DebugCollection = { };
    this.ExportsCollection = { };
    this.LocalizedStrings = { };
    this.AbConfigs = {};
    this.LessImports = {};
    this.MustacheLocalizationRegex = new RegExp("\{\{# *i18n *}}[^\{]*\{\{/ *i18n *}}", "gim");
    this.JsLocalizationRegex = new RegExp("(// @localize .*|i18n.t\\((\"|')[^(\"|')]*(\"|')\\))", "g");
    this.JsAbConfigRegex = new RegExp("AB.(isOn|getVariant)\\((\"|')[^(\"|')]*(\"|')\\)", "g");
    this.LocalizationStartRegex = new RegExp("\{\{# *i18n *}}", "gim");
    this.LocalizationEndRegex = new RegExp("\{\{/ *i18n *}}", "gim");
    this.JsLocalizationRegexStart1 = new RegExp("// @localize ", "i");
    this.JsLocalizationRegexStart2 = new RegExp("i18n.t\\((\"|')", "i");
    this.JsLocalizationEndRegex = new RegExp("(\"|')\\)", "gim");
    this.JsAbConfigRegexStart = new RegExp("AB.(isOn|getVariant)\\((\"|')", "i");

    this.LessImportRegex = new RegExp("@import url\\((\"|')[^(\"|')]*(\"|')\\)", "g");
    this.LessImportRegexStart = new RegExp("@import url\\((\"|')", "i");
    this.LessImportRegexEnd = new RegExp("(\"|')\\)", "gim");

    this.Console = { log: function () { } };
    this.Prefix = '';
}

exports.BundleStatsCollector = BundleStatsCollector;
exports.HASH_FILE_NAME = HASH_FILE_NAME;
exports.DEBUG_FILE_NAME = DEBUG_FILE_NAME;
exports.EXPORTS_FILE_NAME = EXPORTS_FILE_NAME;
exports.LOCALIZATION_FILE_NAME = LOCALIZATION_FILE_NAME;
exports.AB_FILE_NAME = AB_FILE_NAME;
exports.LESS_IMPORTS_FILE = LESS_IMPORTS_FILE;

var GetOutputFile = function (outputdirectory, filename) {
    var seperator = '/';
    if (outputdirectory[outputdirectory.length - 1] == seperator) {
        seperator = '';
    }
    return outputdirectory + seperator + filename;
}

BundleStatsCollector.prototype.setFilePrefix = function(prefix) {
    this.Prefix = prefix;
};

var getFileName = function(collector, fileName) {
    return collector.Prefix + fileName;
};

BundleStatsCollector.prototype.LoadStatsFromDisk = function (outputdirectory) {

    var _this = this,
        loadFromDisk = function(fs, outputdirectory, fileName) {

        var ret;
        var outputFile = GetOutputFile(outputdirectory, fileName);
        try {
            var file = fs.readFileSync(outputFile, 'utf8')
            ret = JSON.parse(file);
        }
        catch (err) {
            ret = {};
        }
        return ret;
    }

    _this.HashCollection = collection.createHash(loadFromDisk(_this.FileSystem, outputdirectory, getFileName(this,HASH_FILE_NAME)));
    _this.DebugCollection = collection.createDebug(loadFromDisk(_this.FileSystem, outputdirectory, getFileName(this,DEBUG_FILE_NAME)));
    _this.ExportsCollection = collection.createExports(loadFromDisk(_this.FileSystem, outputdirectory, getFileName(this,EXPORTS_FILE_NAME)));
    _this.LocalizedStrings = collection.createLocalizedStrings(loadFromDisk(_this.FileSystem, outputdirectory, getFileName(this,LOCALIZATION_FILE_NAME)));
    _this.AbConfigs = collection.createAbConfigs(loadFromDisk(_this.FileSystem, outputdirectory, getFileName(this,AB_FILE_NAME)));
    _this.LessImports = collection.createLessImports(loadFromDisk(_this.FileSystem, outputdirectory, getFileName(this,LESS_IMPORTS_FILE)));
};

BundleStatsCollector.prototype.SaveStatsToDisk = function (outputdirectory) {

    var _this = this,
        saveToDisk = function(fs, outputdirectory, fileName, data) {
            var outputFile = GetOutputFile(outputdirectory, fileName);
            fs.writeFileSync(outputFile, JSON.stringify(data, null, 4))
        };

    saveToDisk(_this.FileSystem, outputdirectory, getFileName(this,HASH_FILE_NAME), _this.HashCollection);
    saveToDisk(_this.FileSystem, outputdirectory, getFileName(this,DEBUG_FILE_NAME), _this.DebugCollection);
    saveToDisk(_this.FileSystem, outputdirectory, getFileName(this,EXPORTS_FILE_NAME), _this.ExportsCollection);
    saveToDisk(_this.FileSystem, outputdirectory, getFileName(this,LOCALIZATION_FILE_NAME), _this.LocalizedStrings);
    saveToDisk(_this.FileSystem, outputdirectory, getFileName(this,AB_FILE_NAME), _this.AbConfigs);
    saveToDisk(_this.FileSystem, outputdirectory, getFileName(this,LESS_IMPORTS_FILE), _this.LessImports);
}

BundleStatsCollector.prototype.AddFileHash = function (bundleName, bundleContents) {
    var hash = this.GenerateHash(bundleContents);

    this.HashCollection.add(bundleName, hash);
};

var parseAndAddToCollection = function(bundleName, text, collection, parseRegex, cleaningFunc) {

    var parsed = [];
    (text.match(parseRegex) || []).forEach(function(item) {
        parsed.push(cleaningFunc(item));
    });

    for(var i=0; i <parsed.length; i++) {
        collection.add(bundleName, parsed[i]);
    }

    return parsed;
};

BundleStatsCollector.prototype.ClearStatsForBundle = function(bundleName) {
    this.DebugCollection.clear(bundleName);
    this.LocalizedStrings.clear(bundleName);
    this.AbConfigs.clear(bundleName);
};

BundleStatsCollector.prototype.AddDebugFile = function (bundleName, fileName) {
    this.DebugCollection.add(bundleName, fileName);
};

BundleStatsCollector.prototype.AddExport = function (bundleName, exportName, filePath) {
    var exp = {};
    exp[filePath] = exportName;
    this.ExportsCollection.add(bundleName, exp);
};

BundleStatsCollector.prototype.ParseJsonForStats = function (bundleName, filePath, text) {

    var directory = this.Path.dirname(filePath),
        file = this.Path.basename(filePath),
        json,
        resolvedPath;

    if (file !== 'package.json') {
        return;
    }

    json = JSON.parse(text);

    if (!json.name || !json.main) {
        return;
    }

    resolvedPath = this.Path.normalize(this.Path.join(directory, json.main));

    this.AddExport(bundleName, json.name, resolvedPath);

};

BundleStatsCollector.prototype.ParseMustacheForStats = function (bundleName, text) {
    var _this = this;

    parseAndAddToCollection(
        bundleName,
        text,
        _this.LocalizedStrings,
        _this.MustacheLocalizationRegex,
        function(item) {
            return item.replace(_this.LocalizationStartRegex,'')
                .replace(_this.LocalizationEndRegex, '')
                .replace(/(\r\n|\n|\r)/gim, '');
        }
    );
};

var parseLessForImports = function (_this, fileName, text) {

    return parseAndAddToCollection(
        fileName,
        text,
        _this.LessImports,
        _this.LessImportRegex,
        function (item) {
            return item.replace(_this.LessImportRegexStart, '')
                       .replace(_this.LessImportRegexEnd, '');
        }
    );
};

BundleStatsCollector.prototype.SearchForLessImports = function (fileName, text) {

    var _this = this,
        originalFile = fileName;

    var depth = 0;
    var parsed = [{ file: fileName, imports: parseLessForImports(_this, originalFile, text) }];
    var importList = [];

    //search for nested imports up to 10 levels deep.
    while (parsed.length > 0) {

        if (depth == 10) {
            throw new Error("Found import with 10 levels of nesting.  This is likely a circular nesting.")
        }

        var nextLevel = [];
        for (var j = 0; j < parsed.length; j++) {
            for (var i = 0; i < parsed[j].imports.length; i++) {

                var dirName = _this.Path.dirname(parsed[j].file);
                var resolvedImport = _this.Path.resolve(dirName, parsed[j].imports[i]);
                text = _this.FileSystem.readFileSync(resolvedImport, 'utf8');

                importList.push(resolvedImport);
                nextLevel.push({ file: resolvedImport, imports: parseLessForImports(_this, originalFile, text) || [] });
            }
        }

        parsed = nextLevel;
        depth++;
    }

    _this.LessImports.clear(fileName);
    for (var i = 0; i < importList.length; i++) {
        _this.LessImports.add(fileName, importList[i]);
    }
};

BundleStatsCollector.prototype.GetImportsForFile = function (fileName) {
    return this.LessImports.get(fileName);
};

BundleStatsCollector.prototype.ParseJsForStats = function (bundleName, text) {
    var _this = this;

    parseAndAddToCollection(
        bundleName,
        text,
        _this.LocalizedStrings,
        _this.JsLocalizationRegex,
        function(item) {
            return item.replace(_this.JsLocalizationRegexStart1,'')
                       .replace(_this.JsLocalizationRegexStart2, '')
                       .replace(_this.JsLocalizationEndRegex, '');
        }
    );

    parseAndAddToCollection(
        bundleName,
        text,
        _this.AbConfigs,
        _this.JsAbConfigRegex,
        function(item) {
            return item.replace(_this.JsAbConfigRegexStart, '')
                .replace(_this.JsLocalizationEndRegex, '');
        }
    );

};