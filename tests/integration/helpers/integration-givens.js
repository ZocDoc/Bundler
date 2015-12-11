
function Givens(
  testUtility
)
{
    this.Utility = testUtility;
    this.BundleOptions = "";
    this.BundleContents = "";
    this.TestDirectory = "";
    this.BaseTestDirectory = "";
    this.ImportDirectory = "";
    this.StagingDirectory = "";
};

exports.Givens = Givens;

Givens.prototype.CleanTestSpace = function(testDirBase) {

    this.BaseTestDirectory = testDirBase;
    this.TestDirectory = testDirBase + '/test';
    this.ImportDirectory = testDirBase + '/import';
    this.Utility.CleanDirectory(this.BaseTestDirectory);
    this.Utility.CreateDirectory(this.BaseTestDirectory);
    this.Utility.CreateDirectory(this.TestDirectory);
    this.Utility.CreateDirectory(this.ImportDirectory);
    this.BundleOptions = "";
    this.BundleContents = "";
    this.StagingDirectory = "";
    this.OutputDirectory = "./" + this.TestDirectory;
};

Givens.prototype.FileNotInBundle = function (fileName, contents) {
    this.Utility.CreateFile(this.TestDirectory, fileName, contents);
};

Givens.prototype.FileNotInBundleInSubDirectory = function (subDirectory, file, contents) {
    var fullDir = this.TestDirectory + "/" + subDirectory;
    this.Utility.CreateFile(fullDir, file, contents);
};

Givens.prototype.FileToBundle = function (fileName, contents) {
    this.FileNotInBundle(fileName, contents);
    this.ExistingFileToBundle(fileName);
};

Givens.prototype.ExistingFileToBundle = function (fileName) {
    this.BundleContents = this.BundleContents + fileName + "\n";
};

Givens.prototype.DirectoryToBundle = function(directoryName) {
    this.BundleContents = this.BundleContents + directoryName + "\n";
};

Givens.prototype.SubDirectory = function (directory) {
    var subDir = this.TestDirectory + "/" + directory;
    this.Utility.CreateDirectory(subDir);
};

Givens.prototype.BundleOption = function (option) {
    this.BundleOptions += " " + option;
};

Givens.prototype.OutputDirectoryIs = function (directory) {
    var rootedDir = this.BaseTestDirectory + '/' + directory;
    this.Utility.CreateDirectory(rootedDir);
    this.OutputDirectory = "./" + rootedDir;

    this.BundleOption("-outputdirectory:" + this.OutputDirectory);
};

Givens.prototype.StagingDirectoryIs = function (directory) {
    var rootedDir = this.BaseTestDirectory + '/' + directory;
    this.Utility.CreateDirectory(rootedDir);
    this.StagingDirectory = "./" + rootedDir;

    this.BundleOption("-stagingdirectory:" + this.StagingDirectory);
};

Givens.prototype.ImportFile = function(fileName, contents) {
    this.Utility.CreateFile(this.ImportDirectory, fileName, contents);
};

Givens.prototype.ImportFile = function(fileName, contents) {
    this.Utility.CreateFile(this.ImportDirectory, fileName, contents);
};

var updateFile = function (_this, dir, fileName, contents) {
    _this.Utility.Wait(1000);
    _this.Utility.CreateFile(dir, fileName, contents);
};

Givens.prototype.UpdatedFile = function(fileName, contents) {
    updateFile(this, this.TestDirectory, fileName, contents);
};

Givens.prototype.UpdatedImport = function(fileName, contents) {
    updateFile(this, this.ImportDirectory, fileName, contents);
};