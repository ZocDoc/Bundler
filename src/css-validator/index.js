var path = require('path');
var StyleStats = require('stylestats');
var TooManySelectorsError = require('../errors/too-many-selectors-error');
var FileTooBigError = require('../errors/file-too-big-error');
var Promise = require('bluebird');

var MAX_CSS_SELECTORS = 4095;
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
    rules: false,
    selectors: true,
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
        //throw new FileTooBigError(bundle, kbSize);
    }

};

var validateSelectors = function(bundle, result) {

    if (result.selectors > MAX_CSS_SELECTORS) {
        throw new TooManySelectorsError(bundle, result.selectors);
    }

};

var validate = function(bundle, css) {

    return new Promise(function(resolve, reject) {

        if (!shouldValidate(bundle)) {
            resolve(css);
            return;
        }

        var stats = new StyleStats(css.code, cssStatsSettings);

        stats.parse(function onCssStatsParsed(err, result) {

            // If it's an error about an empty stylesheet, don't throw.
            // This occurs on new bundles that have no styles yet.
            // Otherwise, bubble the error up.
            if (err && err.message !== 'Rule is not found.') {
                reject(err);
                return;
            }

            validateFileSize(bundle, result);
            validateSelectors(bundle, result);

            resolve(css);

        });

    });

};

exports.validate = validate;