var fs = require('fs');

function readTextFilePs(filePath){
    return new Promise(function(resolve, reject) {

        fs.readFile(filePath, 'utf-8', function(err, fileContents) {
            if (err) {
                reject(err);
            }

            resolve(stripBOM(fileContents));
        });
    });
}

function readTextFile(filePath, cb) {

    fs.readFile(filePath, 'utf-8', function(err, fileContents) {

        if (err) {
            throw err;
        }

        cb(stripBOM(fileContents));

    });

}

function stripBOM(content) {

    // Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
    // because the buffer-to-string conversion in `fs.readFileSync()`
    // translates it to FEFF, the UTF-16 BOM.
    if (content.charCodeAt(0) === 0xFEFF) {
        content = content.slice(1);
    }

    return content;

}

module.exports = {
    readTextFile: readTextFile,
    readTextFilePs: readTextFilePs
};