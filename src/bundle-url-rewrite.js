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

var ext = require('./string-extensions.js'),
    fs = require("fs"),
    hasher = require('crypto');

  getSplit = function(fileName) {
      return fileName.indexOf('/') < 0 ? '\\' : '/';
  };

function BundleUrlRewriter(
    fileSystem,
    outputRoot,
    rootPath,
    hashDirectory
) {
    fileSystem = fileSystem || fs;

    if(!outputRoot.endsWith('/')) {
        outputRoot = outputRoot + '/';
    }

    if(hashDirectory && !hashDirectory.endsWith('/')) {
        hashDirectory = hashDirectory + '/';
    }

    if (!rootPath.endsWith('/')) {
        rootPath = rootPath + '/';
    }

    var generateHashOfFile = function (filepath) {
        var fileText = fileSystem.readFileSync(filepath);
        return {
           text: fileText,
           hash: hasher.createHash('md5').update(fileText).digest('hex')
         };
    };

    var writeFile = function(filePath, fileText) {
        fileSystem.writeFileSync(filePath, fileText);
    };

    this.rewriteUrl = function (url) {
        var cleanedUrl = url.replace("url(", "").replace(/\)/g, "").replace(/'/g, "").replace(/"/g, "");

        var fileUrl;
        var urlHashMatch = cleanedUrl.match(this.hashRegex);
        if (urlHashMatch) {
            fileUrl = urlHashMatch[1];
        } else {
            fileUrl = cleanedUrl;
        }

		    var filepath = rootPath + fileUrl;

        var exists = fileSystem.existsSync(filepath);
        if (!exists) {
            return cleanedUrl;
        }

        var fileHash = generateHashOfFile(filepath).hash;

    		var seperator = '__/';
    		if(cleanedUrl.startsWith('/')) {
    			seperator = '__';
    		}

        return outputRoot + 'version__' + fileHash + seperator + cleanedUrl;
    };

    this.rewriteHashedUrl = function (url) {
        var cleanedUrl = url.replace("url(", "").replace(/\)/g, "").replace(/'/g, "").replace(/"/g, "");

        var fileUrl;
        var urlHashMatch = cleanedUrl.match(this.hashRegex);
        if (urlHashMatch) {
            fileUrl = urlHashMatch[1];
        } else {
            fileUrl = cleanedUrl;
        }

		    var filepath = rootPath + fileUrl;

        var exists = fileSystem.existsSync(filepath);
        if (!exists) {
            return cleanedUrl;
        }

        var fileHash = generateHashOfFile(filepath);
        var split = getSplit(filepath);
        var fileName = filepath.split(split).pop();

        writeFile(hashDirectory + fileHash.hash + fileName, fileHash.text);
        return outputRoot + fileHash.hash + fileName;
    };

    var fileExtensions = [
        'eot',
        'gif',
        'jpg',
        'jpeg',
        'otf',
        'png',
        'svg',
        'ttf',
        'woff'
    ];

    this.hashRegex = new RegExp('([^\\?]*)\\??#(.*)');
    this.urlRegex = new RegExp('url\\([^\\)]*?\\.(?:' + fileExtensions.join('|') + ')(?:\\??#[^\\)]*)?[\'"]?\\)', 'ig');
}

exports.BundleUrlRewriter = BundleUrlRewriter;


BundleUrlRewriter.prototype.VersionUrls = function (cssFileText) {
    var _this = this;

    (cssFileText.match(_this.urlRegex) || []).forEach(function (url) {
        var rewrittenUrl = "url('" + _this.rewriteUrl(url) + "')";
        cssFileText = cssFileText.replace(url, rewrittenUrl);
    });

    return cssFileText;
};

BundleUrlRewriter.prototype.VersionHashUrls = function (cssFileText) {
    var _this = this;

    (cssFileText.match(_this.urlRegex) || []).forEach(function (url) {
        var rewrittenUrl = "url('" + _this.rewriteHashedUrl(url) + "')";
        cssFileText = cssFileText.replace(url, rewrittenUrl);
    });

    return cssFileText;
};
