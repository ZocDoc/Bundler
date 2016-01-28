
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
    this.Utility.CreateFile(this.Givens.TestDirectory, "test." + this.Suffix + ".bundle", this.Givens.BundleContents);
    this.Utility.Bundle(this.Givens.TestDirectory, this.Givens.CommandLineOptions);
};