var testDirectory = 'js-test-suite';
var integrationTest = require('./helpers/jasmine-wrapper.js');
var test = new integrationTest.Test(integrationTest.TestType.Js, testDirectory);

test.describeIntegrationTest("Js Bundling:", function() {

    it("Given js files, then they are concatenated into the output bundle.", function() {

        test.given.FileToBundle('file1.js',    'var file1 = "file1";');
        test.given.FileToBundle('file2.js',    'var file2 = "file2";');
        test.given.FileNotInBundle('file3.js', 'var file3 = "file3";');

        test.actions.Bundle();

        test.assert.verifyBundleIs(';var file1="file1"\n'
            + ';var file2="file2"\n');
    });

    it("Given mustache files, then they are concatenated into the output bundle.", function() {

        test.given.FileToBundle('file1.mustache',    '<div> {{a}} </div>');
        test.given.FileToBundle('file2.mustache',    '<div> {{b}} </div>');
        test.given.FileNotInBundle('file3.mustache', '<div> {{c}} </div>');

        test.actions.Bundle();

        test.assert.verifyBundleIs(';window.JST=window.JST||{},JST.file1=new Hogan.Template({code:function(a,b,c){var d=this;return d.b(c=c||""),d.b("<div> "),d.b(d.v(d.f("a",a,b,0))),d.b(" </div>"),d.fl()},partials:{},subs:{}})\n'
            + ';window.JST=window.JST||{},JST.file2=new Hogan.Template({code:function(a,b,c){var d=this;return d.b(c=c||""),d.b("<div> "),d.b(d.v(d.f("b",a,b,0))),d.b(" </div>"),d.fl()},partials:{},subs:{}})\n');
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

        test.assert.verifyBundleIs(';var file1=React.createClass({displayName:"file1",render:function(){return React.createElement("div",null,"file1 ",this.props.name)}})\n'
            + ';var file3=React.createClass({displayName:"file3",render:function(){return React.createElement("div",null,"file3 ",this.props.name)}})\n');
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
                ';"use strict";var odds=evens.map(function(a){return a+1})\n'
          + ';function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}'
          + 'function _possibleConstructorReturn(a,b){if(!a)throw new ReferenceError("this hasn\'t been initialised - super() hasn\'t been called");'
          + 'return!b||typeof b!="object"&&typeof b!="function"?a:b}function _inherits(a,b){if(typeof b!="function"&&b!==null)'
          + 'throw new TypeError("Super expression must either be null or a function, not "+typeof b);'
          + 'a.prototype=Object.create(b&&b.prototype,{constructor:{value:a,enumerable:!1,writable:!0,configurable:!0}})'
          + ',b&&(Object.setPrototypeOf?Object.setPrototypeOf(a,b):a.__proto__=b)}'
          + '"use strict";var Foo=function(a){function b(a){_classCallCheck(this,b);'
          + 'var c=_possibleConstructorReturn(this,Object.getPrototypeOf(b).call(this));'
          + 'return c.foo=a,c}return _inherits(b,a),b}(Bar)\n'
          + ';"use strict";var name="Bob",time="today",combined="Hello "+name+", how are you "+time+"?"\n'
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
            ';function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}'
          + 'function _possibleConstructorReturn(a,b){if(!a)throw new ReferenceError("this hasn\'t been initialised - super() hasn\'t been called");'
          + 'return!b||typeof b!="object"&&typeof b!="function"?a:b}function _inherits(a,b){if(typeof b!="function"&&b!==null)'
          + 'throw new TypeError("Super expression must either be null or a function, not "+typeof b);'
          + 'a.prototype=Object.create(b&&b.prototype,{constructor:{value:a,enumerable:!1,writable:!0,configurable:!0}}),b'
          + '&&(Object.setPrototypeOf?Object.setPrototypeOf(a,b):a.__proto__=b)}"use strict";'
          + 'var _createClass=function(){function a(a,b){for(var c=0;c<b.length;c++){var d=b[c];'
          + 'd.enumerable=d.enumerable||!1,d.configurable=!0,"value"in d&&(d.writable=!0),Object.defineProperty(a,d.key,d)}}'
          + 'return function(b,c,d){return c&&a(b.prototype,c),d&&a(b,d),b}}(),Photo=function(a){function b(){'
          + 'return _classCallCheck(this,b),_possibleConstructorReturn(this,Object.getPrototypeOf(b).apply(this,arguments))}'
          + 'return _inherits(b,a),_createClass(b,[{key:"render",value:function(){}}]),b}(React.Component)\n'
          + ';function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}'
          + 'function _possibleConstructorReturn(a,b){if(!a)throw new ReferenceError("this hasn\'t been initialised - super() hasn\'t been called");'
          + 'return!b||typeof b!="object"&&typeof b!="function"?a:b}function _inherits(a,b){if(typeof b!="function"&&b!==null)'
          + 'throw new TypeError("Super expression must either be null or a function, not "+typeof b);'
          + 'a.prototype=Object.create(b&&b.prototype,{constructor:{value:a,enumerable:!1,writable:!0,configurable:!0}}),b'
          + '&&(Object.setPrototypeOf?Object.setPrototypeOf(a,b):a.__proto__=b)}"use strict";'
          + 'var _createClass=function(){function a(a,b){for(var c=0;c<b.length;c++){var d=b[c];'
          + 'd.enumerable=d.enumerable||!1,d.configurable=!0,"value"in d&&(d.writable=!0),Object.defineProperty(a,d.key,d)}}'
          + 'return function(b,c,d){return c&&a(b.prototype,c),d&&a(b,d),b}}(),Modal=function(a){function b(){'
          + 'return _classCallCheck(this,b),_possibleConstructorReturn(this,Object.getPrototypeOf(b).apply(this,arguments))}'
          + 'return _inherits(b,a),_createClass(b,[{key:"render",value:function(){}}]),b}(React.Component)\n'
          + ';function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}'
          + 'function _possibleConstructorReturn(a,b){if(!a)throw new ReferenceError("this hasn\'t been initialised - super() hasn\'t been called");'
          + 'return!b||typeof b!="object"&&typeof b!="function"?a:b}function _inherits(a,b){if(typeof b!="function"&&b!==null)'
          + 'throw new TypeError("Super expression must either be null or a function, not "+typeof b);'
          + 'a.prototype=Object.create(b&&b.prototype,{constructor:{value:a,enumerable:!1,writable:!0,configurable:!0}}),b'
          + '&&(Object.setPrototypeOf?Object.setPrototypeOf(a,b):a.__proto__=b)}"use strict";'
          + 'var _createClass=function(){function a(a,b){for(var c=0;c<b.length;c++){var d=b[c];'
          + 'd.enumerable=d.enumerable||!1,d.configurable=!0,"value"in d&&(d.writable=!0),Object.defineProperty(a,d.key,d)}}'
          + 'return function(b,c,d){return c&&a(b.prototype,c),d&&a(b,d),b}}(),Example=function(a){function b(){'
          + 'return _classCallCheck(this,b),_possibleConstructorReturn(this,Object.getPrototypeOf(b).apply(this,arguments))}'
          + 'return _inherits(b,a),_createClass(b,[{key:"render",value:function(){}}]),b}(React.Component)\n'
        );

    });

    it("Given invalid mustache, an error is thrown.", function() {

        test.given.FileToBundle('file1.mustache',    '<div> {{#i}} </div>');

        test.actions.Bundle();

        test.assert.verifyErrorOnBundle('Error: missing closing tag: i')
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

        test.assert.verifyBundleIs(';window.JST=window.JST||{},JST.file1=new Hogan.Template({code:function(a,b,c){var d=this;return d.b(c=c||""),d.b("<div> "),d.b(d.v(d.f("a",a,b,0))),d.b(" </div>"),d.fl()},partials:{},subs:{}})\n'
            + ';var file2="file2"\n'
            + ';var file3=React.createClass({displayName:"file3",render:function(){return React.createElement("div",null,"file3 ",this.props.name)}})\n');
    });
});
