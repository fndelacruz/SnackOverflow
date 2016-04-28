var React = require('react');

var ShowActivitySummaryItem = React.createClass({
  render: function() {
    return (
      <div className='show-activity-summary-item-container'>
        <div className='user-show-common-header'>
          <span className='user-show-common-header-label'>
            {this.props.title}
          </span>
          <span className='user-show-common-header-count'>
            {this.props.count}
          </span>
        </div>
        <div className='show-activity-summary-item-main'>
          main placeholder
        </div>
        <div className='show-activity-summary-item-footer'>

        </div>
      </div>
    );
  }
});

module.exports = ShowActivitySummaryItem;
