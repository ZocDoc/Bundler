Tests
===
This is a suite of tests written for jasmine-node.  To run them you must have node installed, and the jasmine-node module.  Once installed the tests can be run on the command line in the test folder with the command ```jasmine-node .```.

For best results run the command from the top-level tests directory.  

For example, to run just the unit tests:   
  
  * `PS C:\src\Bundler\tests> jasmine-node .\unit\`
  
Or to run a particular suite of tests:

  * `PS C:\src\Bundler\tests> jasmine-node .\unit\styleguide\styleguide-spec.js`

If you want to run all tests quickly, use the parallel test runner:

  * `PS C:\src\Bundler> node .\test-runner`

Integration Tests
===
The tests run well on node version `4.2.3`.

If you need to debug things, you can pass in the console so that it outputs debug information:

  * `var test = new integrationTest.Test(integrationTest.TestType.Js, testDirectory, console);`
