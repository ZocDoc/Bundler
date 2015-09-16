var _ = require('underscore');
var path = require('path');
var StyleStats = require('stylestats');
var TooManyRulesError = require('../errors/too-many-rules-error');
var FileTooBigError = require('../errors/file-too-big-error');

var MAX_CSS_RULES = 4095;
var MAX_FILE_SIZE_KB = 278;

var cssStatsSettings = {
    published: false,
    paths: false,
    stylesheets: false,
    styleElements: false,
    size: true,
    dataUriSize: false,
    ratioOfDataUriSize: false,
    gzippedSize: false,
    simplicity: false,
    rules: true,
    selectors: false,
    declarations: false,
    averageOfIdentifier: false,
    mostIdentifier: false,
    mostIdentifierSelector: false,
    averageOfCohesion: false,
    lowestCohesion: false,
    lowestCohesionSelector: false,
    totalUniqueFontSizes: false,
    uniqueFontSizes: false,
    totalUniqueFontFamilies: false,
    uniqueFontFamilies: false,
    totalUniqueColors: false,
    uniqueColors: false,
    idSelectors: false,
    universalSelectors: false,
    unqualifiedAttributeSelectors: false,
    userSpecifiedSelectors: false,
    importantKeywords: false,
    floatProperties: false,
    mediaQueries: false
};

var whitelistedBundleNames = ['mobile', 'csr', 'pulse'];

var shouldValidate = function(bundle) {

    var bundleName = path.basename(bundle).toLowerCase();

    for (var i = 0; i < whitelistedBundleNames.length; i++) {
        if (bundleName.indexOf(whitelistedBundleNames[i]) > -1) {
            return false;
        }
    }

    return true;

};

var validateFileSize = function(bundle, result) {

    var kbSize = result.size / 1024;

    if (kbSize > MAX_FILE_SIZE_KB) {
        throw new FileTooBigError(bundle, kbSize);
    }

};

var validateRules = function(bundle, result) {

    if (result.rules > MAX_CSS_RULES) {
        throw new TooManyRulesError(bundle, result.rules);
    }

};

var validate = function(bundle, css, cb) {

    if (!shouldValidate(bundle)) {
        cb();
        return;
    }

    var stats = new StyleStats(css, cssStatsSettings);

    stats.parse(function onCssStatsParsed(err, result) {

        if (err) {
            cb(err);
            return;
        }

        validateFileSize(bundle, result);
        validateRules(bundle, result);

        cb();

    });

};

module.exports = {
    validate: validate
};