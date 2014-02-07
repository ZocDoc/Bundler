
var ext = require('../string-extensions.js');

function BundlerTestCase(
  testDir,
  extension,
  outputDirectory,
  exec, 
  runs, 
  waitsFor,
  fs
) {
   this.runFunc = runs;
   this.waitFunc = waitsFor;
   this.Exec = exec;
   this.TestDirectory = testDir;
   this.FinishedBundlerRun = false;
   this.Extension = extension;
   this.Error = null;
   this.StdOut = null;
   this.StdError = null;
   this.Options = '';
   this.FileSystem = fs;
   this.Console = { log: function () { } };
   this.TestRootDirectory = __dirname;
   this.OutputDirectory = outputDirectory || '';
   this.ExpectedFile = "expected-results/" + this.TestDirectory + "/verify" + this.Extension;
   this.TestFile = "test-cases/" + this.TestDirectory + this.OutputDirectory + "/test.min" + this.Extension;
   this.CommandOptions = '';
};

exports.BundlerTestCase = BundlerTestCase;
exports.Type = { Javascript: '.js', Css: '.css' }

BundlerTestCase.prototype.GetFile = function(fileName){
        var _this = this;
        _this.Console.log(fileName);
        return _this.FileSystem.readFileSync(
            fileName,
                    {
	            encoding: 'utf8' 
            }
        );
};

BundlerTestCase.prototype.VerifySetUp = function() { };

BundlerTestCase.prototype.RunBundlerAndVerifyOutput = function() {
  var _this = this;
  _this.CleanDirectory(); 
  _this.VerifySetUp();

  _this.runFunc(function () {

      var cmd = "node ../bundler.js " + _this.Options + " test-cases/" + _this.TestDirectory + _this.CommandOptions;
      _this.Console.log('Running: ' + cmd);
      _this.Exec(cmd
       , function(error, stdout, stderr) {
	        _this.Error = error;
            _this.StdOut = stdout;
            _this.StdError = stderr;

            if (_this.StdOut) { _this.Console.log("stdOut: (" + _this.StdOut + ")"); }
            if (_this.StdError) { _this.Console.log("stdErr: (" + _this.StdError + ")"); }
            if (_this.Error) { _this.Console.log("stdErr: (" + _this.Error + ")"); }
		
            _this.FinishedBundlerRun = true;
          });
	});
 
  _this.waitFunc(function() {
        return _this.FinishedBundlerRun;
     }, 
     "Bundler did not complete", 
     750);

  _this.runFunc(function() {	  
    _this.VerifyBundle();
    _this.FinishedVerify = true;
  });
  
  _this.waitFunc(function() {
        return _this.FinishedVerify;
      }, 
      "Verify did not complete", 
      750);

   _this.CleanDirectory();
};

BundlerTestCase.prototype.VerifyBundle = function() {	
  var _this = this;
  _this.runFunc(function() {
        var expectedFile = _this.GetFile(_this.ExpectedFile);
        var resultFile = _this.GetFile(_this.TestFile);
 
        _this.Console.log('Expected File:');
        _this.Console.log(expectedFile);
	
        _this.Console.log('Test File:');
        _this.Console.log(resultFile);

        expect(resultFile).toBe(expectedFile);
    }, 
    function() {
 	_this.VerifyFinished = true;
  });

};          
  
BundlerTestCase.prototype.VerifyFileState = function (files, shouldExist, ignoreOutputDirectory) {
    var _this = this;
    var outputdir = ignoreOutputDirectory ? '' : _this.OutputDirectory;
    var baseTestFile = "test-cases/" + _this.TestDirectory + outputdir + "/";

    _this.Console.log("Verify the min files are "
	            + (shouldExist ? "" : "not ") + "in " + baseTestFile + "."
            );

    for (var i = 0; i < files.length; i++) {
        _this.CheckIfFileExists(baseTestFile, files[i], shouldExist);
    }

    if (_this.OutputDirectory && !ignoreOutputDirectory) {
        _this.Console.log("Make sure nothing was put in the main directories.")
        _this.VerifyFileState(files, false, true);
    }

}

BundlerTestCase.prototype.CheckIfFileExists = function(directory, file, shouldExist) {
    var _this = this;

    var isThere = _this.FileSystem.existsSync(directory + file + _this.Extension);
    var intendedStatus = shouldExist ? ' and should be there' : ' and should not be there.';
    _this.Console.log(file + " is " + (isThere ? "there" : "not there") + intendedStatus);
    expect(isThere).toBe(shouldExist);
}

BundlerTestCase.prototype.SetUpCacheFileTest = function (shouldMinifyBundle, files) {
    var _this = this;
    var minShouldExist = false;

    _this.VerifySetUp = function () {
        var minFiles = files || ["file1.min", "file2.min", "file3.min"];
        _this.VerifyFileState(minFiles, minShouldExist)
    };

    _this.VerifyBundle = function () {
        minShouldExist = true;
        _this.VerifySetUp();
        _this.VerifyFileState(["test.min"], shouldMinifyBundle);
    };
}

BundlerTestCase.prototype.SetUpHashTest = function (shouldHash) {
    var _this = this,
        directory =  "test-cases/" + _this.TestDirectory + _this.OutputDirectory;
    if (shouldHash) {
        _this.TestFile = directory + '/bundle-hashes.json';
    }
    else {

        _this.VerifyBundle = function () {
            var file = directory + 'bundle-hashes.json';
            _this.Console.log('Hash file should not be present: ' + file)
            _this.VerifyFileState([file], false);
        };
    }
}

BundlerTestCase.prototype.SetUpDebugFileTest = function (shouldHash) {
    var _this = this,
        directory =  "test-cases/" + _this.TestDirectory + _this.OutputDirectory;
    if (shouldHash) {
        _this.TestFile = directory + '/bundle-debug.json';
    }
    else {

        _this.VerifyBundle = function () {
            var file = directory + 'bundle-debug.json';
            _this.Console.log('Debug files file should not be present: ' + file)
            _this.VerifyFileState([file], false);
        };
    }
}

BundlerTestCase.prototype.CleanDirectory = function() {
    var _this = this, finished = true;

    _this.runFunc(function() {	  
        var unlinkFiles = function (file, currentDir) {

            if (file.match(/min/g)
                || file == 'test.js'
                || file == 'test.css'
                || file == 'bundle-hashes.json'
                || file == 'bundle-debug.json'
                || (file.startsWith('mustache') && file.endsWith('.js'))
                || (file.startsWith('less') && file.endsWith('.css'))) {
                _this.FileSystem.unlinkSync(currentDir + '/' + file);

                _this.Console.log(file + ' has been removed.');
            }
            else if (file.startsWith('folder')) {
                var subdirectory = currentDir + "/" + file;
                _this.FileSystem
                        .readdirSync(subdirectory)
                        .forEach(function (file) { unlinkFiles(file, subdirectory) });
            }
        };

        _this.Console.log('Cleaning the directory');
        var directory = _this.TestRootDirectory + "/test-cases/" + _this.TestDirectory;
        _this.FileSystem
                .readdirSync(directory)
                .forEach(function (file) { unlinkFiles(file, directory) });

        finished = true;
    });
  
  _this.waitFunc(function () {
          return finished;
      }, 
      "Clean did not complete", 
      750);

  _this.runFunc(function () { _this.Console.log("Clean Complete"); });
};
