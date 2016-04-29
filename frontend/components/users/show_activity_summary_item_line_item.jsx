var React = require('react');
var ShowActivitySummaryItemLineItem = React.createClass({
  render: function() {
    return (
      <div className='show-activity-summary-item-line-item group'>
        <div className='show-activity-summary-item-line-item-counter'>
          {this.props.count}
        </div>
        <div
          onClick={this.props.handleClick}
          className='show-activity-summary-item-line-item-title link'>
          {this.props.title}
        </div>
        {this.props.createdAt.toLocaleString()}
      </div>
    );
  }
});

module.exports = ShowActivitySummaryItemLineItem;
