var fs = require('fs');

function exists(path, cb) {

    fs.stat(path, function(err) {

        if (!err) {
            cb(undefined, true);
        } else if (err.code === 'ENOENT') {
            cb(undefined, false);
        } else {
            cb(err);
        }

    });

}

module.exports = exists;