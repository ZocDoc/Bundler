var Handlebars = require('handlebars');
var hogan = require('hogan.js-template/lib/hogan.js');
var path = require('path');
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));

/**
 * @param {object} options
 * @param {string} options.code
 * @param {string} options.inputPath
 * @param {boolean} options.useTemplateDirs
 * @returns {bluebird}
 */
function compile(options) {

    var templateName = getTemplateName(options.inputPath, options.useTemplateDirs);
    var compiledTemplate = compileTemplate(options.code);

    return getOutputTemplate()
        .then(function(outputTemplate) {

            var result = outputTemplate({
                templateName: templateName,
                compiledTemplate: compiledTemplate
            }).replace(/\r\n/g, '\n');

            return {
                code: result
            };

        });

}

var template;

function getOutputTemplate() {

    if (template) {

        return Promise.method(function() {
            return template;
        });

    }

    var templatePath = path.join(__dirname, 'mustache.hbs');

    return fs.readFileAsync(templatePath)
        .then(function(templateText) {
            template = Handlebars.compile(templateText.toString('utf8'));
            return template;
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