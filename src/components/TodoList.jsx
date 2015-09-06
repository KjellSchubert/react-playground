/** @jsx React.DOM */
var React = require('react');
var TodoItem = require('./TodoItem.jsx');

// props.items
// props.onChange
var TodoList = React.createClass({
  render: function () {
    var self = this;
    var itemNodes =
      this.props.items.map(function(item) {
        return (
          <TodoItem 
             key={item.id} // see http://fb.me/react-warning-keys
             item={item}
             onChange={self.handleItemChange}
          />);
      });
    return <div>{itemNodes}</div>;
  },
  handleItemChange: function(modifiedItem) {
    // return shallow clone, with the modifiedItem substituted in
    var modifiedItems = this.props.items.map(function(item) {
      return item.id == modifiedItem.id ? modifiedItem : item;
    });
    this.props.onChange(modifiedItems);
  }
});

module.exports = TodoList;
