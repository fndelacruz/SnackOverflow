var React = require('react');
function handleTitleTruncate(title) {
  if (title.length > 70) {
    return title.slice(0, 70) + '...';
  } else {
    return title;
  }
}

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
          {handleTitleTruncate(this.props.title)}
        </div>
      </div>
    );
  }
});

module.exports = ShowActivitySummaryItemLineItem;
