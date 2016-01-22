var getMatches = require('./get-matches');

var JS_COMMENT_REGEX = /\/\/\s?@abconfig (.*)/g;
var JS_CODE_REGEX = /AB\.(?:isOn|getVariant)\(\s?(?:"|')([^"']+)(?:"|')\s?\)/gm;

/**
 * @param {string} code
 * @returns {Array<string>}
 */
function parse(code) {

    return getMatches(code, JS_COMMENT_REGEX)
        .concat(getMatches(code, JS_CODE_REGEX));

}

module.exports = parse;