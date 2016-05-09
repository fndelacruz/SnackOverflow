var React = require('react');

var RemovableTagStub = React.createClass({
  render: function() {
    return (
      <span className='removable-tag-stub-container'>
        <span className='removable-tag-stub-name'>
          {this.props.name}
        </span>
        <span
          onClick={this.props.handleRemoveTag}
          className='removable-tag-stub-cancel'>
          x
        </span>
      </span>
    );
  }
});

module.exports = RemovableTagStub;
