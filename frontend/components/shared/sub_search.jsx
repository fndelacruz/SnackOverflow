var React = require('react');

var SubSearch = React.createClass({
  renderLoading: function() {
    // debugger
    if (!this.props.indexLoaded) {
      return (
        <div className='sub-search-loading'>
          <div className='icon-loading' />
        </div>
      );
    }
  },
  render: function() {
    return (
      <div className='sub-search-container group'>
        <div className='sub-search-input-label'>
          Search:
        </div>
        <input
          autoFocus
          type='text'
          value={this.props.search}
          onChange={this.props.handleSearchChange}
          className='sub-search-input' />
        {this.renderLoading()}
      </div>
    );
  }
});
// <div className='sub-search-loading'>loadingPlaceHolder</div>

module.exports = SubSearch;
