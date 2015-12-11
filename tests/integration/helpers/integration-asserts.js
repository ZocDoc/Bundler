
function Asserts(
  testUtility,
  givens,
  suffix
)
{
    this.Utility = testUtility;
    this.Givens = givens;
    this.Suffix = suffix;
};

exports.Asserts = Asserts;

Asserts.prototype.verifyBundleIs = function(expectedContents) {
    this.Utility.VerifyFileContents(this.Givens.OutputDirectory, "test.min." + this.Suffix, expectedContents);
};

Asserts.prototype.verifyFileAndContentsAre = function (directory, file, expectedContents) {
    this.Utility.VerifyFileContents(directory, file, expectedContents);
};

Asserts.prototype.verifyFileDoesNotExist = function (directory, file) {
    this.Utility.VerifyFileDoesNotExist(directory, file);
};

Asserts.prototype.verifyFileExists = function (directory, file) {
    this.Utility.VerifyFileExists(directory, file);
};

Asserts.prototype.verifyErrorOnBundle = function (errorText) {
    this.Utility.VerifyErrorIs(errorText);
};

Asserts.prototype.verifyJson = function (directory, file, jsonVerificationFunc) {
    this.Utility.ValidateJsonInFile(directory, file, jsonVerificationFunc);
};