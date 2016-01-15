var testDirectory = 'js-test-suite';
var integrationTest = require('./helpers/jasmine-wrapper.js');
var test = new integrationTest.Test(integrationTest.TestType.Js, testDirectory);

test.describeIntegrationTest("Js Bundling:", function() {

    it("Given js files, then they are concatenated into the output bundle.", function() {

        test.given.FileToBundle('file1.js',    'var file1 = "file1";');
        test.given.FileToBundle('file2.js',    'var file2 = "file2";');
        test.given.FileNotInBundle('file3.js', 'var file3 = "file3";');

        test.actions.Bundle();

        test.assert.verifyBundleIs(
            ';var file1="file1";\n' +
            ';var file2="file2";\n'
        );

    });

    it("Given mustache files, then they are concatenated into the output bundle.", function() {

        test.given.FileToBundle('file1.mustache',    '<div> {{a}} </div>');
        test.given.FileToBundle('file2.mustache',    '<div> {{b}} </div>');
        test.given.FileNotInBundle('file3.mustache', '<div> {{c}} </div>');

        test.actions.Bundle();

        test.assert.verifyBundleIs(
            ';window.JST=window.JST||{},JST.file1=new Hogan.Template({code:function(i,n,a){var e=this;return e.b(a=a||""),e.b("<div> "),e.b(e.v(e.f("a",i,n,0))),e.b(" </div>"),e.fl()},partials:{},subs:{}});\n' +
            ';window.JST=window.JST||{},JST.file2=new Hogan.Template({code:function(i,n,b){var e=this;return e.b(b=b||""),e.b("<div> "),e.b(e.v(e.f("b",i,n,0))),e.b(" </div>"),e.fl()},partials:{},subs:{}});\n'
        );

    });

    it("Given jsx files, then they are concatenated into the output bundle.", function() {

        test.given.FileToBundle('file1.jsx',
                  'var file1 = React.createClass({'
                + '   render: function() {'
                + '   return <div>file1 {this.props.name}</div>;'
                + '  }'
                + '});');
        test.given.FileNotInBundle('file2.jsx',
            'var file2 = React.createClass({'
                + '   render: function() {'
                + '   return <div>file2 {this.props.name}</div>;'
                + '  }'
                + '});');
        test.given.FileToBundle('file3.jsx',
            'var file3 = React.createClass({'
                + '   render: function() {'
                + '   return <div>file3 {this.props.name}</div>;'
                + '  }'
                + '});');

        test.actions.Bundle();

        test.assert.verifyBundleIs(
            ';var file1=React.createClass({displayName:"file1",render:function(){return React.createElement("div",null,"file1 ",this.props.name)}});\n' +
            ';var file3=React.createClass({displayName:"file3",render:function(){return React.createElement("div",null,"file3 ",this.props.name)}});\n'
        );

    });

    it('Given es6 files, then they are concatenated into the output bundle.', function() {

        test.given.FileToBundle('file1.es6',
            'var odds = evens.map(v => v + 1);');
        test.given.FileToBundle('file2.es6',
            'class Foo extends Bar {'
          + '  constructor(foo) {'
          + '     super();'
          + '     this.foo = foo;'
          + '  }'
          + '}');
        test.given.FileToBundle('file3.es6',
            'var name = "Bob", time = "today";'
          + 'var combined = `Hello ${name}, how are you ${time}?`;');

        test.actions.Bundle();

        test.assert.verifyBundleIs(
            ';"use strict";var odds=evens.map(function(e){return e+1});\n' +
            ';"use strict";function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function _possibleConstructorReturn(t,e){if(!t)throw new ReferenceError("this hasn\'t been initialised - super() hasn\'t been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}function _inherits(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}var Foo=function(t){function e(t){_classCallCheck(this,e);var o=_possibleConstructorReturn(this,Object.getPrototypeOf(e).call(this));return o.foo=t,o}return _inherits(e,t),e}(Bar);\n' +
            ';"use strict";var name="Bob",time="today",combined="Hello "+name+", how are you "+time+"?";\n'
        );

    });

    it('Given es6 react files, then they are concatenated into the output bundle.', function() {

        test.given.FileToBundle('file1.es6',
            'class Photo extends React.Component { render() { } }');
        test.given.FileToBundle('file2.es6',
            'class Modal extends React.Component { render() { } }');
        test.given.FileToBundle('file3.es6',
            'class Example extends React.Component { render() { } }');

        test.actions.Bundle();

        test.assert.verifyBundleIs(
            ';"use strict";function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _possibleConstructorReturn(e,t){if(!e)throw new ReferenceError("this hasn\'t been initialised - super() hasn\'t been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function _inherits(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}var _createClass=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),Photo=function(e){function t(){return _classCallCheck(this,t),_possibleConstructorReturn(this,Object.getPrototypeOf(t).apply(this,arguments))}return _inherits(t,e),_createClass(t,[{key:"render",value:function(){}}]),t}(React.Component);\n' +
            ';"use strict";function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _possibleConstructorReturn(e,t){if(!e)throw new ReferenceError("this hasn\'t been initialised - super() hasn\'t been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function _inherits(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}var _createClass=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),Modal=function(e){function t(){return _classCallCheck(this,t),_possibleConstructorReturn(this,Object.getPrototypeOf(t).apply(this,arguments))}return _inherits(t,e),_createClass(t,[{key:"render",value:function(){}}]),t}(React.Component);\n' +
            ';"use strict";function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _possibleConstructorReturn(e,t){if(!e)throw new ReferenceError("this hasn\'t been initialised - super() hasn\'t been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function _inherits(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}var _createClass=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),Example=function(e){function t(){return _classCallCheck(this,t),_possibleConstructorReturn(this,Object.getPrototypeOf(t).apply(this,arguments))}return _inherits(t,e),_createClass(t,[{key:"render",value:function(){}}]),t}(React.Component);\n'
        );

    });

    it("Given invalid mustache, an error is thrown.", function() {

        test.given.FileToBundle('file1.mustache',    '<div> {{#i}} </div>');

        test.actions.Bundle();

        test.assert.verifyErrorOnBundle('Error: missing closing tag: i');

    });

    it("Given mixed file types (js, mustache, jsx), then they are concatenated into the output bundle.", function() {

        test.given.FileToBundle('file1.mustache',    '<div> {{a}} </div>');
        test.given.FileToBundle('file2.js',    'var file2 = "file2";');
        test.given.FileToBundle('file3.jsx',
            'var file3 = React.createClass({'
                + '   render: function() {'
                + '   return <div>file3 {this.props.name}</div>;'
                + '  }'
                + '});');

        test.actions.Bundle();

        test.assert.verifyBundleIs(
            ';window.JST=window.JST||{},JST.file1=new Hogan.Template({code:function(i,n,a){var e=this;return e.b(a=a||""),e.b("<div> "),e.b(e.v(e.f("a",i,n,0))),e.b(" </div>"),e.fl()},partials:{},subs:{}});\n' +
            ';var file2="file2";\n' +
            ';var file3=React.createClass({displayName:"file3",render:function(){return React.createElement("div",null,"file3 ",this.props.name)}});\n'
        );

    });
});
