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
    var countValue = this.props.count;
    var counterClass = 'show-activity-summary-item-line-item-counter';
    if (this.props.isReputation) {
      if (this.props.count > 0) {
        countValue = '+' + countValue;
        counterClass += ' show-activity-summary-item-line-item-counter-vote-up';
      } else {
        counterClass += ' show-activity-summary-item-line-item-counter-vote-down';
      }
    }
    return (
      <div className='show-activity-summary-item-line-item group'>
        <div className={counterClass}>
          {countValue}
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
