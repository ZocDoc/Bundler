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
            'let x = 5;');
        test.given.FileToBundle('file3.es6',
            'var name = "Bob", time = "today";'
          + 'var combined = `Hello ${name}, how are you ${time}?`;');

        test.actions.Bundle();

        test.assert.verifyBundleIs(
            ';var odds=evens.map(function(n){return n+1});\n' +
            ';var x=5;\n' +
            ';var name="Bob",time="today",combined="Hello "+name+", how are you "+time+"?";\n'
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
            ';var file1=React.createClass({displayName:"file1",render:function(){return React.createElement("div",null,"file1 ",this.props.name)}});\n' +
            ';var file2=React.createClass({displayName:"file2",render:function(){return React.createElement("div",null,"file2 ",this.props.name)}});\n' +
            ';var file3=React.createClass({displayName:"file3",render:function(){return React.createElement("div",null,"file3 ",this.props.name)}});\n'
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
