
function TestUtility(
  exec,
  fs,
  runs,
  waitsFor,
  logger
)
{
    this.Exec = exec;
    this.Console = logger || { log: function () { } };
    this.runFunc = runs;
    this.waitFunc = waitsFor;
    this.FileSystem = fs;
    this.Error = '';
};

exports.TestUtility = TestUtility;

TestUtility.prototype.RunCommandSync = function (cmd, execCallback) {
    var _this = this,
        finishedCommand;

    _this.Console.log('called run command');

    _this.runFunc(function () {

      finishedCommand = false;
      _this.Console.log('Running command: ' + cmd);
      _this.Exec(cmd
            , function(error, stdout, stderr) {
                (execCallback || function () { })(error, stdout, stderr);

                if (stdout) { _this.Console.log("stdOut: (" + stdout + ")"); }
                if (stderr) {
                    _this.Console.log("stdErr: (" + stderr + ")");
                    _this.Error = stderr;
                }
                if (error) {
                    _this.Error = error;
                    _this.Console.log("error: (" + error + ")");
                }

                finishedCommand = true;
                _this.Console.log('Finished command: ' + cmd);
            });
   });

    _this.waitFunc(function () {
        return finishedCommand;
     },
     "Running command did not complete",
     10000
  );
};

TestUtility.prototype.Wait = function (duration) {
    var _this = this,
        doneWaiting;

    _this.runFunc(function () {

        finishedCommand = false;
        _this.Console.log('Waiting for milliseconds: ' + duration);
        setTimeout(function () {
                doneWaiting = true;
            },
            duration);
    });

    _this.waitFunc(function () {
        return doneWaiting;
    },
     "Waited longer than 5 seconds.",
     10000
  );
};

var cleanDirectory = function(fs, dir) {

	var files = fs.readdirSync(dir);

	files.forEach(function(directoryItem) {

		var fullPath = dir + '/' + directoryItem;
		var stats = fs.statSync(fullPath);
		if(stats.isDirectory()) {
			cleanDirectory(fs, fullPath);
		}
		else {
			fs.unlinkSync(fullPath);
		}
	});
	fs.rmdirSync(dir);
}

TestUtility.prototype.CleanDirectory = function (dir) {
    var _this = this;
    _this.runFunc(function () {
        if (_this.FileSystem.existsSync(dir)) {
			cleanDirectory(_this.FileSystem, dir);
        }
    });
}

TestUtility.prototype.CreateFile = function (dir, fileName, contents) {
    var _this = this;
    _this.runFunc(function () {
        var fullPath = dir + '/' + fileName;

        var stream = _this.FileSystem.createWriteStream(fullPath, 'utf8');
        stream.once('open', function (fd) {
            stream.write(contents);
            stream.end();
        });
    });
}

TestUtility.prototype.CreateDirectory = function (dir) {
    var _this = this;
    _this.runFunc(function () {
        _this.FileSystem.mkdirSync(dir);
    });
}

TestUtility.prototype.ReadFile = function (dir, fileName) {
    var _this = this;
    _this.runFunc(function () {
        return _this.FileSystem.readFileSync(dir + '/' + fileName, 'utf8');
    });
}

TestUtility.prototype.VerifyFileContents = function (dir, fileName, expectedContents) {
    var _this = this;
    _this.runFunc(function () {
        var bundleContents = _this.FileSystem.readFileSync(dir + '/' + fileName, 'utf8');
        expect(bundleContents).toBe(expectedContents);
    });
}

TestUtility.prototype.Bundle = function (dir, options) {
    var _this = this;
    _this.runFunc(function () {
        _this.RunCommandSync("node ../src/bundler.js ./" + dir + " " + (options || ""));
    });
}

TestUtility.prototype.VerifyErrorIs = function (errorText) {
    var _this = this;
    _this.runFunc(function () {

        var error = _this.Error;
        if(_this.Error.stack) {
            error = _this.Error.stack;
        }

        var hasError = error.indexOf(errorText) >= 0;
        expect(hasError).toBe(true);
    });
}

var verifyFile = function (_this, dir, file, isThere) {
    _this.runFunc(function () {
        var exists = _this.FileSystem.existsSync(dir + "/" + file);
        expect(exists).toBe(isThere);
    });
};

TestUtility.prototype.VerifyFileDoesNotExist = function (dir, file) {
    verifyFile(this, dir, file, false);
}

TestUtility.prototype.VerifyFileExists = function (dir, file) {
    verifyFile(this, dir, file, true);
}

TestUtility.prototype.ValidateJsonInFile = function (dir, file, validationFunc) {
    var _this = this;
    _this.runFunc(function () {
        var contents = _this.FileSystem.readFileSync(dir + "/" + file, 'utf8');
        var json = JSON.parse(contents);
        validationFunc(json);
    });
}
