var testDirectory = 'js-test-suite';
var integrationTest = require('./helpers/jasmine-wrapper.js');
var test = new integrationTest.Test(integrationTest.TestType.Js, testDirectory);

test.describeIntegrationTest("Js Bundling:", function() {

    beforeEach(function() {

        test.given.OutputDirectoryIs('output-dir');

    });

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
            ';(function(){this.JST=this.JST||{},this.JST.file1=new this.Hogan.Template({code:function(i,t,s){var a=this;return a.b(s=s||""),a.b("<div> "),a.b(a.v(a.f("a",i,t,0))),a.b(" </div>"),a.fl()},partials:{},subs:{}})}).call(this);\n' +
            ';(function(){this.JST=this.JST||{},this.JST.file2=new this.Hogan.Template({code:function(i,t,s){var n=this;return n.b(s=s||""),n.b("<div> "),n.b(n.v(n.f("b",i,t,0))),n.b(" </div>"),n.fl()},partials:{},subs:{}})}).call(this);\n'
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
            ';"use strict";var file1=React.createClass({displayName:"file1",render:function(){return React.createElement("div",null,"file1 ",this.props.name)}});\n' +
            ';"use strict";var file3=React.createClass({displayName:"file3",render:function(){return React.createElement("div",null,"file3 ",this.props.name)}});\n'
        );

    });

    it('Given es6 files, then they are concatenated into the output bundle.', function() {

        test.given.FileToBundle('file1.es6',
            'var odds = evens.map(v => v + 1);');
        test.given.FileToBundle('file2.es6',
            'let x = 5;');
        test.given.FileToBundle('file3.es6',
            'var name = "Bob", time = "today";'
          + 'var combined = `Hello ${name}, how are you ${time}?`;');

        test.actions.Bundle();

        test.assert.verifyBundleIs(
            ';"use strict";var odds=evens.map(function(e){return e+1});\n' +
            ';"use strict";var x=5;\n' +
            ';"use strict";var name="Bob",time="today",combined="Hello "+name+", how are you "+time+"?";\n'
        );

    });

    it('Given es6 react files, then they are concatenated into the output bundle.', function() {

        test.given.FileToBundle('file1.es6',
            'var file1 = React.createClass({'
            + '   render() {'
            + '   return <div>file1 {this.props.name}</div>;'
            + '  }'
            + '});');
        test.given.FileToBundle('file2.es6',
            'var file2 = React.createClass({'
            + '   render() {'
            + '   return <div>file2 {this.props.name}</div>;'
            + '  }'
            + '});');
        test.given.FileToBundle('file3.es6',
            'var file3 = React.createClass({'
            + '   render() {'
            + '   return <div>file3 {this.props.name}</div>;'
            + '  }'
            + '});');

        test.actions.Bundle();

        test.assert.verifyBundleIs(
            ';"use strict";var file1=React.createClass({displayName:"file1",render:function(){return React.createElement("div",null,"file1 ",this.props.name)}});\n' +
            ';"use strict";var file2=React.createClass({displayName:"file2",render:function(){return React.createElement("div",null,"file2 ",this.props.name)}});\n' +
            ';"use strict";var file3=React.createClass({displayName:"file3",render:function(){return React.createElement("div",null,"file3 ",this.props.name)}});\n'
        );

    });

    it("Given json files, then they are not concatenated into the output bundle.", function() {

        test.given.FileToBundle('file1.json', '{"foo":true}');
        test.given.FileToBundle('file2.json', '{"bar":1}');

        test.actions.Bundle();

        test.assert.verifyBundleIs('');

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
            ';(function(){this.JST=this.JST||{},this.JST.file1=new this.Hogan.Template({code:function(i,t,s){var a=this;return a.b(s=s||""),a.b("<div> "),a.b(a.v(a.f("a",i,t,0))),a.b(" </div>"),a.fl()},partials:{},subs:{}})}).call(this);\n' +
            ';var file2="file2";\n' +
            ';"use strict";var file3=React.createClass({displayName:"file3",render:function(){return React.createElement("div",null,"file3 ",this.props.name)}});\n'
        );

    });
});
