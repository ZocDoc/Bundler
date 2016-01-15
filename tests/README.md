Tests
===
This is a suite of tests written for jasmine-node.  To run them you must have node installed and must run ```npm install``` on this folder.

To run all the tests:

  * `PS C:\src\Bundler\tests> npm run test-all`

To run just the unit tests:

  * `PS C:\src\Bundler\tests> npm run test .\unit`

To run a specific suite of tests:

  * `PS C:\src\Bundler\tests> npm run test .\unit\styleguide\styleguide-spec.js`

Integration Tests
===
The tests run well on node version `4.2.3`.

If you need to debug things, you can pass in the console so that it outputs debug information:

  * `var test = new integrationTest.Test(integrationTest.TestType.Js, testDirectory, console);`
