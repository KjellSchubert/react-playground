/** @jsx React.DOM */

var React = require('react');

// simplest React component: no class decl'ed just static html. Not very
// useful of course, just for educational purposes:
React.renderComponent(<p>Hi I am static React content</p>, 
    document.getElementById('staticReact'));

// simple inline hello world class:
var HelloMessage = React.createClass({
  render: function () {
    return <h1>Hello {this.props.message}!</h1>;
  }
});
React.renderComponent(<HelloMessage message="World" />,
    document.getElementById('inlineReact'));

// like previous, but using browserify to organize React components into
// their own files:
var HelloMessage = require('./components/HelloMessage.jsx');
React.renderComponent(<HelloMessage message="World" />,
    document.getElementById('componentizedReact'));

