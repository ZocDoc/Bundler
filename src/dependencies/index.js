var precinct = require('precinct');

var natives = process.binding('natives');

function getDependencies(code) {

    return precinct(code, 'commonjs').filter(function(dep) {

        return !natives[dep];

    })

}

module.exports = getDependencies;