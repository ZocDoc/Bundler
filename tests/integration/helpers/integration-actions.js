
function Actions(
  testUtility,
  givens,
  suffix
)
{
    this.Utility = testUtility;
    this.Givens = givens;
    this.Suffix = suffix;
};

exports.Actions = Actions;

Actions.prototype.Bundle = function() {
    var bundle;

    if (this.Givens.BundleFileOptions.length) {
        bundle = "#options " + this.Givens.BundleFileOptions.join(', ') + "\n" + this.Givens.BundleContents;
    } else {
        bundle = this.Givens.BundleContents;
    }

    this.Utility.CreateFile(this.Givens.TestDirectory, "test." + this.Suffix + ".bundle", bundle);
    this.Utility.Bundle(this.Givens.TestDirectory, this.Givens.BundleOptions);
};