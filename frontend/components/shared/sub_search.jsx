var React = require('react');

var SubSearch = React.createClass({
  render: function() {
    return (
      <div className='sub-search-container group'>
        <div className='sub-search-input-label'>
          Search:
        </div>
        <input
          type='text'
          value={this.props.search}
          onChange={this.props.handleSearchChange}
          className='sub-search-input' />
      </div>
    );
  }
});

module.exports = SubSearch;
