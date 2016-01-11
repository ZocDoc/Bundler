var hogan = require('hogan.js-template/lib/hogan.js');
var path = require('path');
var Promise = require('bluebird');

/**
 * @param {object} options
 * @param {string} options.code
 * @param {string} options.filePath
 * @param {boolean} options.useTemplateDirs
 * @returns {bluebird}
 */
function compile(options) {

    return new Promise(function(resolve, reject) {

        try {

            var templateName = getTemplateName(options.filePath, options.useTemplateDirs);

            var compiledTemplate = compileTemplate(options.code);

            var templateObject = '{ code: ' + compiledTemplate + ', partials: {}, subs: {} }';

            var result = 'window["JST"] = window["JST"] || {};'
                + ' JST[\''
                + templateName
                + '\'] = new Hogan.Template(' + templateObject + ');';

            resolve(result);

        } catch (err) {

            reject(err);

        }

    });

}

function getTemplateName(filePath, useTemplateDirs) {

    var templateName = path.basename(filePath, path.extname(filePath));

    if (useTemplateDirs){
        var splitPath = filePath.replace('.mustache', '').split(path.sep);
        var templateIndex = splitPath.indexOf('templates');
        templateName = splitPath.slice(templateIndex + 1).join('-');
    }

    return templateName;

}

function compileTemplate(code) {

    return hogan.compile(code, {
        asString: true
    });

}

module.exports = compile;