var hogan = require('hogan.js-template/lib/hogan.js');
var path = require('path');

/**
 * @param {object} options
 * @param {string} options.code
 * @param {string} options.filePath
 * @param {boolean} options.useTemplateDirs
 * @param {function} options.callback
 */
function compile(options) {

    var templateName = getTemplateName(options.filePath, options.useTemplateDirs);

    var compiledTemplate = compileTemplate(options.code);

    var templateObject = '{ code: ' + compiledTemplate + ', partials: {}, subs: {} }';

    var result = 'window["JST"] = window["JST"] || {};'
        + ' JST[\''
        + templateName
        + '\'] = new Hogan.Template(' + templateObject + ');';

    options.callback(result);

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