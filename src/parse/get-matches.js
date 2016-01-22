/**
 * @param {string} text
 * @param {RegExp} regex
 * @returns {Array<string>}
 */
function getMatches(text, regex) {

    var matches = [],
        match;

    while (match = regex.exec(text)) {
        matches.push(match[1].trim());
    }

    return matches;

}

module.exports = getMatches;