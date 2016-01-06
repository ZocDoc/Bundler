var sprity = require('sprity');
var minimist = require('minimist');
var path = require('path');

var options = minimist(process.argv.splice(2));

var srcPath = path.join(options.imagesPath, '**', '*.png');

sprity.create({
    src: srcPath,
    split: true,
    spriteOutputPath: options.spriteOutputPath,
    cssOutputPath: options.lessOutputPath,
    spriteUrlBase: options.spriteUrlBase,
    name: 'sprite',
    style: 'sprites.mixin.generated.less',
    orientation: 'binary-tree',
    prefix: 'sgv-icon',
    'style-indent-size': 4,
    processor: 'less',
    template: 'sprite-less-template.hbs',
    'dimension': [{
        ratio: 1, dpi: 72
    }, {
        ratio: 2, dpi: 192
    }]
}, function(err) {
    if (err) {
        console.error(err);
    }
});