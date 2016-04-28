var React = require('react');
var ShowActivitySummaryItem = require('./show_activity_summary_item');

var ShowActivitySummary = React.createClass({
  render: function() {
    return (
      <div className='show-activity-summary-container group'>
        <ShowActivitySummaryItem title={'Answers'} count={23}/>
        <ShowActivitySummaryItem title={'Reputation'} count={53}/>
        <ShowActivitySummaryItem title={'Questions'} count={513}/>
        <ShowActivitySummaryItem title={'Tags'} count={12}/>
        <ShowActivitySummaryItem title={'Badges'} count={6}/>
        <ShowActivitySummaryItem title={'Votes Cast'} count={354}/>
      </div>
    );
  }
});

module.exports = ShowActivitySummary;
