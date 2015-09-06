/** @jsx React.DOM */
var React = require('react');
var _ = require('lodash');

// props.item
// props.onChange
var TodoItem = React.createClass({
  render: function () {
    return <div>
        <span>startTime:</span>
        <input 
          type="text" 
          value={this.props.item.startTime}
          onChange={this.handleStartTimeChange} />
        <span>text:</span>
        <input 
          type="text" 
          value={this.props.item.text}
          onChange={this.handleTextChange} />
      </div>;
  },
  handleStartTimeChange: function (event) {
    this.props.onChange(_.assign(
      _.clone(this.props.item),
      {startTime: event.target.value}));
  },
  handleTextChange: function(event) {
    this.props.onChange(_.assign(
      _.clone(this.props.item),
      {text: event.target.value}));
  }
});

module.exports = TodoItem;
