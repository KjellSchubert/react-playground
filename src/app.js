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

// viewmodel composition example, with local data model (no server comm).
// None of the components use this.state, so each update to a single todo 
// item (changing a single letter in each item) will send an onChange event 
// up the chain, which will then re-render this completely new copy of a todo 
// list. Is this efficient? Unsure.
var TodoList = require('./components/TodoList.jsx');
var todoItems = [ 
  { id: 123, startTime: 5, text: "do things"}, 
  { id: 456, startTime: 7, text: "do stuff"}, 
];
var renderTodoList = function(todoItems) {
  console.log("renderTodoList called with " + JSON.stringify(todoItems));
  React.renderComponent(
    <TodoList 
      items={todoItems} 
      onChange={renderTodoList}
    />,
    document.getElementById('todoListReact'));
};
renderTodoList(todoItems);

