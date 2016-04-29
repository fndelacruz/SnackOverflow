var React = require('react');
var ShowActivitySummaryItem = require('./show_activity_summary_item');

var ShowActivitySummary = React.createClass({
  render: function() {
    return (
      <div className='show-activity-summary-container group'>
        <ShowActivitySummaryItem
          items={this.props.given_answers}
          title={'Answers'}
          subTabs={['votes', 'activity', 'newest']}
          count={23} />
        <ShowActivitySummaryItem
          title={'Reputation'}
          count={53} />
        <ShowActivitySummaryItem
          items={this.props.questions}
          title={'Questions'}
          subTabs={['votes', 'activity', 'newest']}
          count={513} />
        <ShowActivitySummaryItem
          items={this.props.associated_tags_sorted_by_answer_score}
          title={'Tags'}
          count={12} />
        <ShowActivitySummaryItem
          items={this.props.badgings}
          title={'Badges'}
          subTabs={['recent', 'class', 'name']}
          count={6} />
        <ShowActivitySummaryItem
          item={this.props.votes}
          title={'Votes Cast'}
          count={354} />
      </div>
    );
  }
});

module.exports = ShowActivitySummary;
