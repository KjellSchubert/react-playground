/** @jsx React.DOM */
var React = require('react');
var TodoItem = require('./TodoItem.jsx');

var _nextAvailableUid = 0;
var generateUid = function() {
  // see http://fb.me/react-warning-keys
  // Here id is assumed to be a unique object identifier assigned by and
  // downloaded from the backend, which is undefined for locally added objs.
  // This here assumes the server ids are never prefixed with "local".
  return "local" + (_nextAvailableUid++);
};

var TodoList = React.createClass({

  propTypes: {
    items: React.PropTypes.array.isRequired,
    onChange: React.PropTypes.func.isRequired
  },

  getInitialState: function() {
    // filterText is not persisted on the server, it filters todo items in
    // the current view.
    // So it belongs in this.state.
    return { filterText: "" };
  },

  render: function () {
    var self = this;
    var outerDivStyle = {display: "flex"};
    var itemNodes =
      this.props.items
      .filter(function(item) { 
        return item.text.indexOf(self.state.filterText) != -1;
      })
      .map(function(item) {
        return (
          <div style={outerDivStyle}
               key={item.id}
          >
            <TodoItem 
               item={item}
               onChange={self.handleItemChange}
            />
            <button onClick={self.handleDeleteItem.bind(null, item.id)}>
              Delete
            </button>
          </div>
        );
      });
    return (
      <div>
        <div>
          <span>filter text:</span>
          <input 
             type="text"
             value={this.state.filterText}
             onChange={this.handleChangeFilter}
          />
        </div>
        {itemNodes}
        <button onClick={this.handleAddItem}>Add</button>
      </div>
    );
  },
  handleItemChange: function(modifiedItem) {
    // return shallow clone, with the modifiedItem substituted in
    var modifiedItems = this.props.items.map(function(item) {
      return item.id == modifiedItem.id ? modifiedItem : item;
    });
    this.props.onChange(modifiedItems);
  },
  handleDeleteItem: function(deletedItemId) {
    // return shallow clone, with delete item omitted
    var modifiedItems = this.props.items.filter(function(item) {
      return item.id != deletedItemId;
    });
    this.props.onChange(modifiedItems);
  },
  handleAddItem: function() {
    var clone = this.props.items.slice(0);
    var newItem = {
      // has no ID yet since backend didn't assign one yet
      id: generateUid(),
      startTime: 0,
      text: "",
    };
    var modifiedItems = clone.concat([newItem]);
    this.props.onChange(modifiedItems);
  },
  handleChangeFilter: function(event) {
    this.setState({filterText: event.target.value});
  }
});

module.exports = TodoList;
