
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
   this.Console = { log: function() { } };
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
	
            _this.Console.log("stdOut: (" + stdout + ")");
            _this.Console.log("stdErr: (" + stderr + ")");
            _this.Console.log("Error:  (" + error  + ")");
		
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
    var _this = this,
        finishedClean = {};

  _this.runFunc(function() {	  
    _this.Console.log('Cleaning the directory');

    finishedClean.minFiles = false;
    _this.Exec("rm -v test-cases/" + _this.TestDirectory  + "/*min*"
        , function(error, stdout, stderr){
            _this.Console.log(stdout);
            finishedClean.minFiles = true;
            });

    finishedClean.testFile = false;
    _this.Exec("rm -v test-cases/" + _this.TestDirectory + "/test" + _this.Extension
        , function (error, stdout, stderr) {
            _this.Console.log(stdout);
            finishedClean.testFile = true;
        });

    if (_this.Extension == exports.Type.Javascript) {

        finishedClean.mustache = false;
        _this.Exec("rm -v test-cases/" + _this.TestDirectory + "/mustache*.js"
                , function (error, stdout, stderr) {
                    _this.Console.log(stdout);
                    finishedClean.mustache = true;
                });
       
        finishedClean.mustacheFolder = false;
        _this.Exec("rm -v test-cases/" + _this.TestDirectory + "/folder1/mustache*.js"
                , function (error, stdout, stderr) {
                    _this.Console.log(stdout);
                    finishedClean.mustacheFolder = true;
                });
    }
    else if (_this.Extension == exports.Type.Css) {

        finishedClean.less = false;
        _this.Exec("rm -v test-cases/" + _this.TestDirectory + "/less*.css"
              , function (error, stdout, stderr) {
                  _this.Console.log(stdout);
                  finishedClean.less = true;
              });

        finishedClean.lessFolder = false;
        _this.Exec("rm -v test-cases/" + _this.TestDirectory + "/folder1/less*.css"
              , function (error, stdout, stderr) {
                  _this.Console.log(stdout);
                  finishedClean.lessFolder = true;
              });
    }

  });
  
  _this.waitFunc(function () {
          var finished = true;
          for (var key in finishedClean) {
              finished = finished && finishedClean[key];
          }

          if(finished) { _this.Console.log('Wait for clean completed'); }

          return finished;
      }, 
      "Clean did not complete", 
      750);


  _this.Console.log("Clean Complete");
};
