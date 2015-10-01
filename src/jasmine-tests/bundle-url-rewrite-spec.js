var exec = require('child_process').exec,
    fs = require('fs'),
    bundleUrlRewrite = require('../bundle-url-rewrite.js');

describe("BundleUrlRewriter - ", function () {

    var fileSystem, getUrlRewriter, _exists, _filesToText, rootPath, outputRoot, _cssFileText, _outputFileText;

    beforeEach(function () {

        outputRoot = "combined";
        rootPath = "root/images/";
        _cssFileText = null;

        _filesToText = {};
        _exists = false;
        fileSystem = {};
        fileSystem.existsSync = function() { return _exists; };
        fileSystem.readFileSync = function (path) {
            return _filesToText[path];
        };

        getUrlRewriter = function() {
            spyOn(fileSystem, 'existsSync').andCallThrough();
            spyOn(fileSystem, 'readFileSync').andCallThrough();
            var util = new bundleUrlRewrite.BundleUrlRewriter(fileSystem, outputRoot, rootPath);
            return util;
        };
    });

    describe("VersionUrls: ", function () {

        var fileContents1 = "AN IMAGE FILE 1",
            fileContents2 = "Something else that is an image too.",
            fileContents3 = "Another file",
            fileContents4 = "Yet another file";

        it("Given an image that doesnt exist, the image is not versioned.", function() {

            var cssFileText = ".s { background: url('img/alert-03.jpg') center no-repeat; }";

            givenImageDoesNotExist();
            givenCssFileText(cssFileText);

            versionUrls();

            verifyOutputTextIs(cssFileText);
        });

        it("Given an image that does exist, it reads the image off disk.", function () {

            givenFile('img/an-image.jpg', fileContents1);
            givenCssFileText(".s { background: url('img/an-image.jpg') center no-repeat; }");

            versionUrls();

            expect(fileSystem.readFileSync).toHaveBeenCalledWith(rootPath + "img/an-image.jpg");
        });

        it("Given an image that does exist, it is versioned.", function () {

            givenFile('img/an-image.jpg', fileContents1);
            givenCssFileText(".s { background: url('img/an-image.jpg') center no-repeat; }");

            versionUrls();

            verifyOutputTextIs(".s { background: url('combined/version__18458d2016656fdb823ed3ef01b8f8da__/img/an-image.jpg') center no-repeat; }");
        });
		
		it("Gifs should work.", function () {

			givenFile('img/an-image.gif', fileContents1);
            givenCssFileText("url(img/an-image.gif) url(img/an-image.gif)");

            versionUrls();

            verifyOutputTextIs("url('combined/version__18458d2016656fdb823ed3ef01b8f8da__/img/an-image.gif') url('combined/version__18458d2016656fdb823ed3ef01b8f8da__/img/an-image.gif')");
        });
		
		it("Pngs should work.", function () {

			givenFile('img/an-image.png', fileContents1);
            givenCssFileText("url(img/an-image.png) url(img/an-image.png)");

            versionUrls();

            verifyOutputTextIs("url('combined/version__18458d2016656fdb823ed3ef01b8f8da__/img/an-image.png') url('combined/version__18458d2016656fdb823ed3ef01b8f8da__/img/an-image.png')");
        });
			
		it("Jpgs should work.", function () {

			givenFile('img/an-image.jpg', fileContents1);
            givenCssFileText("url(img/an-image.jpg) url(img/an-image.jpg)");

            versionUrls();

            verifyOutputTextIs("url('combined/version__18458d2016656fdb823ed3ef01b8f8da__/img/an-image.jpg') url('combined/version__18458d2016656fdb823ed3ef01b8f8da__/img/an-image.jpg')");
        });

        it('Svgs should work.', function() {

            givenFile('fonts/a-font.svg', fileContents1);
            givenCssFileText('url(fonts/a-font.svg) url(fonts/a-font.svg)');

            versionUrls();

            verifyOutputTextIs("url('combined/version__18458d2016656fdb823ed3ef01b8f8da__/fonts/a-font.svg') url('combined/version__18458d2016656fdb823ed3ef01b8f8da__/fonts/a-font.svg')");

        });

        it('Ttfs should work.', function() {

            givenFile('fonts/a-font.ttf', fileContents1);
            givenCssFileText('url(fonts/a-font.ttf) url(fonts/a-font.ttf)');

            versionUrls();

            verifyOutputTextIs("url('combined/version__18458d2016656fdb823ed3ef01b8f8da__/fonts/a-font.ttf') url('combined/version__18458d2016656fdb823ed3ef01b8f8da__/fonts/a-font.ttf')");

        });

        it('Woffs should work.', function() {

            givenFile('fonts/a-font.woff', fileContents1);
            givenCssFileText('url(fonts/a-font.woff) url(fonts/a-font.woff)');

            versionUrls();

            verifyOutputTextIs("url('combined/version__18458d2016656fdb823ed3ef01b8f8da__/fonts/a-font.woff') url('combined/version__18458d2016656fdb823ed3ef01b8f8da__/fonts/a-font.woff')");

        });

        it('Eots should work.', function() {

            givenFile('fonts/a-font.eot', fileContents1);
            givenCssFileText('url(fonts/a-font.eot) url(fonts/a-font.eot)');

            versionUrls();

            verifyOutputTextIs("url('combined/version__18458d2016656fdb823ed3ef01b8f8da__/fonts/a-font.eot') url('combined/version__18458d2016656fdb823ed3ef01b8f8da__/fonts/a-font.eot')");

        });

        it('Otfs should work.', function() {

            givenFile('fonts/a-font.otf', fileContents1);
            givenCssFileText('url(fonts/a-font.otf) url(fonts/a-font.otf)');

            versionUrls();

            verifyOutputTextIs("url('combined/version__18458d2016656fdb823ed3ef01b8f8da__/fonts/a-font.otf') url('combined/version__18458d2016656fdb823ed3ef01b8f8da__/fonts/a-font.otf')");

        });

        it('URLs with hashes are parsed correctly.', function() {

            givenFile('fonts/a-font.otf', fileContents1);
            givenCssFileText('url(fonts/a-font.otf#foobar)');

            versionUrls();

            verifyOutputTextIs("url('combined/version__18458d2016656fdb823ed3ef01b8f8da__/fonts/a-font.otf#foobar')");

        });

        it("Image urls with double quotes are parsed correctly.", function () {

            givenFile('img/an-image.jpg', fileContents1);
            givenCssFileText('.s { background: url("img/an-image.jpg") center no-repeat; }');

            versionUrls();

            verifyOutputTextIs(".s { background: url('combined/version__18458d2016656fdb823ed3ef01b8f8da__/img/an-image.jpg') center no-repeat; }");
        });

        it("Image urls with no quotes are parsed correctly.", function () {

            givenFile('img/another-image.jpg', fileContents1);
            givenCssFileText('.s { background: url(img/another-image.jpg) center no-repeat; }');

            versionUrls();

            verifyOutputTextIs(".s { background: url('combined/version__18458d2016656fdb823ed3ef01b8f8da__/img/another-image.jpg') center no-repeat; }");
        });

        it("Extra slashes are not added if one already exists.", function () {

            givenFile('/img/another-image.jpg', fileContents1);
            givenCssFileText('.s { background: url(/img/another-image.jpg) center no-repeat; }');

            versionUrls();

            verifyOutputTextIs(".s { background: url('combined/version__18458d2016656fdb823ed3ef01b8f8da__/img/another-image.jpg') center no-repeat; }");
        });

        it('Simple font faces are parsed correctly.', function() {

            givenFile('/fonts/a-font/a-font.eot', fileContents1);
            givenFile('/fonts/a-font/a-font.woff', fileContents2);
            givenCssFileText('@font-face{font-family:a-font;src:url(/fonts/a-font/a-font.eot);src:url(/fonts/a-font/a-font.woff);}');

            versionUrls();

            verifyOutputTextIs('@font-face{font-family:a-font;src:url(\'combined/version__18458d2016656fdb823ed3ef01b8f8da__/fonts/a-font/a-font.eot\');src:url(\'combined/version__570e1018fd20af9e8e22c860a43d0ac3__/fonts/a-font/a-font.woff\');}');

        });

        it('Complex font faces are parsed correctly.', function() {

            givenFile('/fonts/a-font/a-font.eot', fileContents1);
            givenFile('/fonts/a-font/a-font.woff', fileContents2);
            givenFile('/fonts/a-font/a-font.ttf', fileContents3);
            givenFile('/fonts/a-font/a-font.svg', fileContents4);
            givenCssFileText("@font-face{font-family:a-font;src:url(/fonts/a-font/a-font.eot);"
                + "src:url(/fonts/a-font/a-font.eot?#iefix) format('embedded-opentype'),"
                + "url(/fonts/a-font/a-font.woff) format('woff'),"
                + "url(/fonts/a-font/a-font.ttf) format('truetype'),"
                + "url(/fonts/a-font/a-font.svg#a-font) format('svg');"
                + "font-weight:400;font-style:normal}");

            versionUrls();

            verifyOutputTextIs("@font-face{font-family:a-font;src:url('combined/version__18458d2016656fdb823ed3ef01b8f8da__/fonts/a-font/a-font.eot');"
                + "src:url('combined/version__18458d2016656fdb823ed3ef01b8f8da__/fonts/a-font/a-font.eot?#iefix') format('embedded-opentype'),"
                + "url('combined/version__570e1018fd20af9e8e22c860a43d0ac3__/fonts/a-font/a-font.woff') format('woff'),"
                + "url('combined/version__74cc7c5a37619838cb7ead3a3450a690__/fonts/a-font/a-font.ttf') format('truetype'),"
                + "url('combined/version__9887ec636a69b4da275d315709ad8280__/fonts/a-font/a-font.svg#a-font') format('svg');"
                + "font-weight:400;font-style:normal}");

        });

        it("Multiple images in a single file are all versioned.", function () {

            givenFile('img/an-image.jpg', fileContents1);
            givenFile('img/another-image.jpg', fileContents2);
            givenCssFileText('.a { background: url(img/another-image.jpg) center no-repeat; }\n'
                            + '.b { background: url("img/an-image.jpg") center no-repeat; }\n'
                            + '.c { background: url("img/another-image.jpg") no-repeat; }\n');

            versionUrls();

            verifyOutputTextIs(".a { background: url('combined/version__570e1018fd20af9e8e22c860a43d0ac3__/img/another-image.jpg') center no-repeat; }\n"
                            + ".b { background: url('combined/version__18458d2016656fdb823ed3ef01b8f8da__/img/an-image.jpg') center no-repeat; }\n"
                            + ".c { background: url('combined/version__570e1018fd20af9e8e22c860a43d0ac3__/img/another-image.jpg') no-repeat; }\n");
        });


        var givenImageDoesNotExist = function () {
            _exists = false;
        };

        var givenFile = function (fileName, fileContents) {
            _exists = true;
            _filesToText[rootPath + fileName] = fileContents;
        };

        var givenCssFileText = function (text) {
            _cssFileText = text;
        };
     
        var versionUrls = function () {
            _outputFileText = getUrlRewriter().VersionUrls(_cssFileText);
        };

        var verifyOutputTextIs = function (expectedFile) {
            expect(_outputFileText).toBe(expectedFile);
        }

    });
});