var React = require('react');
var ShowActivitySummaryItem = require('./show_activity_summary_item');

var ShowActivitySummary = React.createClass({
  render: function() {
    return (
      <div className='show-activity-summary-container group'>
        <ShowActivitySummaryItem
          title={'Answers'}
          items={this.props.given_answers}
          subTabs={['votes', 'newest']}
          count={23}
          userId={this.props.id} />
        <ShowActivitySummaryItem
          title={'Reputation'}
          count={53}
          userId={this.props.id} />
        <ShowActivitySummaryItem
          title={'Questions'}
          items={this.props.questions}
          subTabs={['votes', 'newest']}
          count={513}
          userId={this.props.id} />
        <ShowActivitySummaryItem
        title={'Tags'}
          items={this.props.associated_tags_sorted_by_answer_score}
          count={12}
          userId={this.props.id} />
        <ShowActivitySummaryItem
        title={'Badges'}
          items={this.props.badgings}
          subTabs={['recent', 'class', 'name']}
          count={6}
          userId={this.props.id} />
        <ShowActivitySummaryItem
          title={'Votes Cast'}
          items={this.props.votes}
          count={354}
          userId={this.props.id} />
      </div>
    );
  }
});

module.exports = ShowActivitySummary;
