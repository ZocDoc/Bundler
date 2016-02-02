var parseDeps = require('../../../../src/concat/requireify/parse-dependencies');

describe('parse dependencies', function() {

    var files,
        result;

    beforeEach(function() {

        files = {};

    });
    
    it('Given files with no require statements, no dependencies are parsed', function() {
    
        givenFile({
            originalPath: 'C:\\foo\\file1.js',
            code: 'var x = 1;'
        });
        givenFile({
            originalPath: 'C:\\bar\\file2.js',
            code: 'module.exports = function(x) { return x * 2; };'
        });

        parseDependencies();

        assertResultIs({
            'C:\\foo\\file1.js': {
                originalPath: 'C:\\foo\\file1.js',
                code: 'var x = 1;',
                deps: {}
            },
            'C:\\bar\\file2.js': {
                originalPath: 'C:\\bar\\file2.js',
                code: 'module.exports = function(x) { return x * 2; };',
                deps: {}
            }
        });
    
    });

    it('Given file with require statement to js file in same directory, dependency is parsed.', function() {

        givenFile({
            originalPath: 'C:\\foo\\file1.js',
            code: 'module.exports = 1;'
        });
        givenFile({
            originalPath: 'C:\\foo\\file2.js',
            code: 'var f = require(\'./file1.js\');'
        });

        parseDependencies();

        assertResultIs({
            'C:\\foo\\file1.js': {
                originalPath: 'C:\\foo\\file1.js',
                code: 'module.exports = 1;',
                deps: {}
            },
            'C:\\foo\\file2.js': {
                originalPath: 'C:\\foo\\file2.js',
                code: 'var f = require(\'./file1.js\');',
                deps: {
                    './file1.js': {
                        name: 'C:\\foo\\file1.js',
                        isPath: true
                    }
                }
            }
        });

    });

    it('Given file with extension-less require statement pointing to js file in same directory, dependency is parsed.', function() {

        givenFile({
            originalPath: 'C:\\foo\\file1.js',
            code: 'module.exports = 1;'
        });
        givenFile({
            originalPath: 'C:\\foo\\file2.js',
            code: 'var f = require(\'./file1\');'
        });

        parseDependencies();

        assertResultIs({
            'C:\\foo\\file1.js': {
                originalPath: 'C:\\foo\\file1.js',
                code: 'module.exports = 1;',
                deps: {}
            },
            'C:\\foo\\file2.js': {
                originalPath: 'C:\\foo\\file2.js',
                code: 'var f = require(\'./file1\');',
                deps: {
                    './file1': {
                        name: 'C:\\foo\\file1.js',
                        isPath: true
                    }
                }
            }
        });

    });

    it('Given file with extension-less require statement pointing to es6 file in same directory, dependency is parsed.', function() {

        givenFile({
            originalPath: 'C:\\foo\\file1.es6',
            code: 'module.exports = 1;'
        });
        givenFile({
            originalPath: 'C:\\foo\\file2.js',
            code: 'var f = require(\'./file1\');'
        });

        parseDependencies();

        assertResultIs({
            'C:\\foo\\file1.es6': {
                originalPath: 'C:\\foo\\file1.es6',
                code: 'module.exports = 1;',
                deps: {}
            },
            'C:\\foo\\file2.js': {
                originalPath: 'C:\\foo\\file2.js',
                code: 'var f = require(\'./file1\');',
                deps: {
                    './file1': {
                        name: 'C:\\foo\\file1.es6',
                        isPath: true
                    }
                }
            }
        });

    });

    it('Given file with extension-less require statement pointing to subdirectory with js index file, dependency is parsed.', function() {

        givenFile({
            originalPath: 'C:\\foo\\bar\\index.js',
            code: 'module.exports = 1;'
        });
        givenFile({
            originalPath: 'C:\\foo\\file2.js',
            code: 'var f = require(\'./bar\');'
        });

        parseDependencies();

        assertResultIs({
            'C:\\foo\\bar\\index.js': {
                originalPath: 'C:\\foo\\bar\\index.js',
                code: 'module.exports = 1;',
                deps: {}
            },
            'C:\\foo\\file2.js': {
                originalPath: 'C:\\foo\\file2.js',
                code: 'var f = require(\'./bar\');',
                deps: {
                    './bar': {
                        name: 'C:\\foo\\bar\\index.js',
                        isPath: true
                    }
                }
            }
        });

    });

    it('Given file with extension-less require statement pointing to subdirectory with es6 index file, dependency is parsed.', function() {

        givenFile({
            originalPath: 'C:\\foo\\bar\\index.es6',
            code: 'module.exports = 1;'
        });
        givenFile({
            originalPath: 'C:\\foo\\file2.js',
            code: 'var f = require(\'./bar\');'
        });

        parseDependencies();

        assertResultIs({
            'C:\\foo\\bar\\index.es6': {
                originalPath: 'C:\\foo\\bar\\index.es6',
                code: 'module.exports = 1;',
                deps: {}
            },
            'C:\\foo\\file2.js': {
                originalPath: 'C:\\foo\\file2.js',
                code: 'var f = require(\'./bar\');',
                deps: {
                    './bar': {
                        name: 'C:\\foo\\bar\\index.es6',
                        isPath: true
                    }
                }
            }
        });

    });

    it('Given file with require statement to js file in different directory, dependency is parsed.', function() {

        givenFile({
            originalPath: 'C:\\bar\\file1.js',
            code: 'module.exports = 1;'
        });
        givenFile({
            originalPath: 'C:\\foo\\file2.js',
            code: 'var f = require(\'../bar/file1.js\');'
        });

        parseDependencies();

        assertResultIs({
            'C:\\bar\\file1.js': {
                originalPath: 'C:\\bar\\file1.js',
                code: 'module.exports = 1;',
                deps: {}
            },
            'C:\\foo\\file2.js': {
                originalPath: 'C:\\foo\\file2.js',
                code: 'var f = require(\'../bar/file1.js\');',
                deps: {
                    '../bar/file1.js': {
                        name: 'C:\\bar\\file1.js',
                        isPath: true
                    }
                }
            }
        });

    });

    it('Given file with require statement to es6 file in different directory, dependency is parsed.', function() {

        givenFile({
            originalPath: 'C:\\bar\\file1.es6',
            code: 'module.exports = 1;'
        });
        givenFile({
            originalPath: 'C:\\foo\\file2.js',
            code: 'var f = require(\'../bar/file1.es6\');'
        });

        parseDependencies();

        assertResultIs({
            'C:\\bar\\file1.es6': {
                originalPath: 'C:\\bar\\file1.es6',
                code: 'module.exports = 1;',
                deps: {}
            },
            'C:\\foo\\file2.js': {
                originalPath: 'C:\\foo\\file2.js',
                code: 'var f = require(\'../bar/file1.es6\');',
                deps: {
                    '../bar/file1.es6': {
                        name: 'C:\\bar\\file1.es6',
                        isPath: true
                    }
                }
            }
        });

    });

    it('Given file with extension-less require statement pointing to js file in different directory, dependency is parsed.', function() {

        givenFile({
            originalPath: 'C:\\bar\\file1.js',
            code: 'module.exports = 1;'
        });
        givenFile({
            originalPath: 'C:\\foo\\file2.js',
            code: 'var f = require(\'../bar/file1\');'
        });

        parseDependencies();

        assertResultIs({
            'C:\\bar\\file1.js': {
                originalPath: 'C:\\bar\\file1.js',
                code: 'module.exports = 1;',
                deps: {}
            },
            'C:\\foo\\file2.js': {
                originalPath: 'C:\\foo\\file2.js',
                code: 'var f = require(\'../bar/file1\');',
                deps: {
                    '../bar/file1': {
                        name: 'C:\\bar\\file1.js',
                        isPath: true
                    }
                }
            }
        });

    });

    it('Given file with extension-less require statement pointing to es6 file in different directory, dependency is parsed.', function() {

        givenFile({
            originalPath: 'C:\\bar\\file1.es6',
            code: 'module.exports = 1;'
        });
        givenFile({
            originalPath: 'C:\\foo\\file2.js',
            code: 'var f = require(\'../bar/file1\');'
        });

        parseDependencies();

        assertResultIs({
            'C:\\bar\\file1.es6': {
                originalPath: 'C:\\bar\\file1.es6',
                code: 'module.exports = 1;',
                deps: {}
            },
            'C:\\foo\\file2.js': {
                originalPath: 'C:\\foo\\file2.js',
                code: 'var f = require(\'../bar/file1\');',
                deps: {
                    '../bar/file1': {
                        name: 'C:\\bar\\file1.es6',
                        isPath: true
                    }
                }
            }
        });

    });

    it('Given file with extension-less require statement pointing to different directory with js index file, dependency is parsed.', function() {

        givenFile({
            originalPath: 'C:\\bar\\index.js',
            code: 'module.exports = 1;'
        });
        givenFile({
            originalPath: 'C:\\foo\\file2.js',
            code: 'var f = require(\'../bar\');'
        });

        parseDependencies();

        assertResultIs({
            'C:\\bar\\index.js': {
                originalPath: 'C:\\bar\\index.js',
                code: 'module.exports = 1;',
                deps: {}
            },
            'C:\\foo\\file2.js': {
                originalPath: 'C:\\foo\\file2.js',
                code: 'var f = require(\'../bar\');',
                deps: {
                    '../bar': {
                        name: 'C:\\bar\\index.js',
                        isPath: true
                    }
                }
            }
        });

    });

    it('Given file with extension-less require statement pointing to different directory with es6 index file, dependency is parsed.', function() {

        givenFile({
            originalPath: 'C:\\bar\\index.es6',
            code: 'module.exports = 1;'
        });
        givenFile({
            originalPath: 'C:\\foo\\file2.js',
            code: 'var f = require(\'../bar\');'
        });

        parseDependencies();

        assertResultIs({
            'C:\\bar\\index.es6': {
                originalPath: 'C:\\bar\\index.es6',
                code: 'module.exports = 1;',
                deps: {}
            },
            'C:\\foo\\file2.js': {
                originalPath: 'C:\\foo\\file2.js',
                code: 'var f = require(\'../bar\');',
                deps: {
                    '../bar': {
                        name: 'C:\\bar\\index.es6',
                        isPath: true
                    }
                }
            }
        });

    });

    it('Given file with non-relative require statement, dependency is parsed unchanged.', function() {

        givenFile({
            originalPath: 'C:\\bar\\index.js',
            code: 'require(\'foo\');'
        });

        parseDependencies();

        assertResultIs({
            'C:\\bar\\index.js': {
                originalPath: 'C:\\bar\\index.js',
                code: 'require(\'foo\');',
                deps: {
                    'foo': {
                        name: 'foo',
                        isPath: false
                    }
                }
            }
        });

    });

    it('Given file with multiple require statements, all dependencies are parsed.', function() {

        givenFile({
            originalPath: 'C:\\bar\\index.es6',
            code: 'module.exports = 1;'
        });
        givenFile({
            originalPath: 'C:\\foo\\file2.js',
            code: 'var f = require(\'../bar\'); var b = require(\'foobar\');'
        });

        parseDependencies();

        assertResultIs({
            'C:\\bar\\index.es6': {
                originalPath: 'C:\\bar\\index.es6',
                code: 'module.exports = 1;',
                deps: {}
            },
            'C:\\foo\\file2.js': {
                originalPath: 'C:\\foo\\file2.js',
                code: 'var f = require(\'../bar\'); var b = require(\'foobar\');',
                deps: {
                    '../bar': {
                        name: 'C:\\bar\\index.es6',
                        isPath: true
                    },
                    'foobar': {
                        name: 'foobar',
                        isPath: false
                    }
                }
            }
        });

    });

    it('Given file with relative require statement to file not in bundle, throws error.', function() {

        givenFile({
            originalPath: 'C:\\bar\\index.js',
            code: 'require(\'./foo.js\');'
        });

        expect(parseDependencies).toThrow();

    });

    var parseDependencies = function() {

        result = parseDeps(files);

    };

    var givenFile = function(file) {

        files[file.originalPath] = file;

    };

    var assertResultIs = function(expected) {

        expect(result).toEqual(expected);

    };

});