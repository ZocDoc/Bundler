
var exec = require('child_process').exec,
    fs = require('fs'),
    testHelper = require('./integration-test-helper.js'),
    givensHelper = require('./integration-givens.js'),
    actionsHelper = require('./integration-actions.js'),
    assertsHelper = require('./integration-asserts.js');

exports.TestType = {
    Css: 'css',
    Js: 'js',
    Undecided: 'undecided'
}

function Test(testType, testDirectory, logger) {
    this.utility = new testHelper.TestUtility(exec, fs, runs, waitsFor, logger);
    this.given = new givensHelper.Givens(this.utility);
    this.actions = new actionsHelper.Actions(this.utility, this.given, testType);
    this.assert = new assertsHelper.Asserts(this.utility, this.given, testType);
    this.testDirectory = testDirectory;
    var _this = this;
    this.describeIntegrationTest = function(name, testFunctions)
    {
        describe('Integration Test: ', function() {

            beforeEach(function () {
                _this.given.CleanTestSpace(_this.testDirectory);
            });

            afterEach(function () {
                _this.utility.CleanDirectory(_this.testDirectory);
            });

            describe(name,testFunctions);
        });

    };

    this.resetTestType = function(testType) {
        this.actions = new actionsHelper.Actions(this.utility, this.given, testType);
        this.assert = new assertsHelper.Asserts(this.utility, this.given, testType);
    };

};

exports.Test = Test;

