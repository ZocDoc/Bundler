var getMatches = require('./get-matches');

var JS_COMMENT_REGEX = /\/\/\s?@localize (.*)/g;
var JS_CODE_REGEX = /i18n\.t\(\s?(?:"|')([^"']+)(?:"|')\s?\)/gm;
var MUSTACHE_REGEX = /\{\{#\s?i18n\s?}}\s?([^\{]+)\s?\{\{\/\s?i18n\s?}}/gm;

/**
 * @param {string} code
 * @returns {Array<string>}
 */
function parse(code) {

    return getMatches(code, JS_COMMENT_REGEX)
        .concat(getMatches(code, JS_CODE_REGEX))
        .concat(getMatches(code, MUSTACHE_REGEX));

}

module.exports = parse;