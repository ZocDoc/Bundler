var Handlebars = require('handlebars');
var hogan = require('hogan.js-template/lib/hogan.js');
var path = require('path');
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));

var TemplateType = {
    Global: 'global',
    Require: 'require'
};

var outputTemplates = {};

/**
 * @param {object} options
 * @param {string} options.code
 * @param {string} options.inputPath
 * @param {boolean} options.useTemplateDirs
 * @param {boolean} options.require
 * @returns {Promise}
 */
function compile(options) {

    return new Promise(function(resolve, reject) {

        try {

            var templateName = getTemplateName(options.inputPath, options.useTemplateDirs);
            var compiledTemplate = compileTemplate(options.code);

            getOutputTemplate(options.require ? TemplateType.Require : TemplateType.Global)
                .then(function (outputTemplate) {

                    var result = outputTemplate({
                        templateName: templateName,
                        compiledTemplate: compiledTemplate
                    }).replace(/\r\n/g, '\n');

                    resolve({
                        code: result
                    });

                });

        } catch (err) {

            reject(err);

        }

    });

}

function getOutputTemplate(templateType) {

    if (outputTemplates[templateType]) {

        return new Promise(function(resolve) {

            resolve(outputTemplates[templateType]);

        });

    }

    var templateName;

    switch (templateType) {

        case TemplateType.Global:
            templateName = 'mustache-global.hbs';
            break;

        case TemplateType.Require:
            templateName = 'mustache-require.hbs';
            break;

    }

    var templatePath = path.join(__dirname, templateName);

    return fs.readFileAsync(templatePath)
        .then(function(templateText) {
            outputTemplates[templateType] = Handlebars.compile(templateText.toString('utf8'));
            return outputTemplates[templateType];
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