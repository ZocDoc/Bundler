var sprity = require('sprity');
var minimist = require('minimist');
var path = require('path');

var options = minimist(process.argv.splice(2));

var spriteTilesPath = path.join(options.imagesPath, '**', '*.png');

var generatedSpritePath = options.spriteOutputPath;

var lessTemplatePath = path.join('.', 'templates', 'sprite-less-template.hbs');

var lessAbsolutePath = path.join(options.lessOutputPath, 'sprites.mixin.generated.less');
var lessRelativePath = path.relative(generatedSpritePath, lessAbsolutePath);

sprity.create({
    src: spriteTilesPath,
    split: true,
    out: generatedSpritePath,
    spriteUrlBase: options.spriteUrlBase,
    name: 'sprite',
    prefix: 'sgv-icon',
    'style-indent-size': 4,
    template: lessTemplatePath,
    style: lessRelativePath,
    orientation: 'binary-tree',
    dimension: [{
        ratio: 1, dpi: 72
    }, {
        ratio: 2, dpi: 192
    }],
    logger: console
}, function(err) {
    if (err) {
        console.error(err);
    }
});