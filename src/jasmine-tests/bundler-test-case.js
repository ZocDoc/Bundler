
String.prototype.startsWith = function (str) {
    return this.indexOf(str) === 0;
};
String.prototype.endsWith = function (suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

function BundlerTestCase(
  testDir,
  extension,
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
};

exports.BundlerTestCase = BundlerTestCase;
exports.Type = { Javascript: '.js', Css: '.css' }

BundlerTestCase.prototype.GetFile = function(fileName){
  var _this = this;
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

  _this.runFunc(function() { 
     _this.Exec("node ../bundler.js " + _this.Options + " test-cases/" + _this.TestDirectory
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
	  var expectedFile = _this.GetFile(
		"expected-results/" + _this.TestDirectory + "/verify" + _this.Extension
	  );
          var resultFile = _this.GetFile(
		"test-cases/" + _this.TestDirectory + "/test.min" + _this.Extension
	  );
 
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
  
BundlerTestCase.prototype.CleanDirectory = function() {
    var _this = this, finished = true;

    _this.runFunc(function() {	  
        var unlinkFiles = function (file, currentDir) {

            if (file.match(/min/g)
                || file == 'test.js'
                || file == 'test.css'
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
