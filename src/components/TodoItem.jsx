/** @jsx React.DOM */
var React = require('react');
var _ = require('lodash');

var TodoItem = React.createClass({

  propTypes: {
    item: React.PropTypes.shape({
      startTime: React.PropTypes.oneOfType([
                   React.PropTypes.string,
                   React.PropTypes.number]),
      text: React.PropTypes.string
    }),
    onChange: React.PropTypes.func.isRequired
  },

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
      // if you force Number here then typing becomes awkward
      {startTime: event.target.value}));
  },
  handleTextChange: function(event) {
    this.props.onChange(_.assign(
      _.clone(this.props.item),
      {text: event.target.value}));
  }
});

module.exports = TodoItem;
