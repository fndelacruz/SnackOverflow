var React = require('react');
var ShowActivitySummaryItem = require('./show_activity_summary_item');

var ShowActivitySummary = React.createClass({
  render: function() {
    return (
      <div className='show-activity-summary-container group'>
        <ShowActivitySummaryItem
          handleViewMoreClick={this.props.handleViewMoreClick.bind(null, 'answers')}
          title={'Answers'}
          items={this.props.given_answers}
          subTabs={['votes', 'newest']}
          userId={this.props.id} />
        <ShowActivitySummaryItem
          handleViewMoreClick={this.props.handleViewMoreClick.bind(null, 'reputation')}
          title={'Reputation'}
          items={this.props.reputations}
          userId={this.props.id} />
        <ShowActivitySummaryItem
          handleViewMoreClick={this.props.handleViewMoreClick.bind(null, 'questions')}
          title={'Questions'}
          items={this.props.questions}
          subTabs={['votes', 'newest']}
          userId={this.props.id} />
        <ShowActivitySummaryItem
          handleViewMoreClick={this.props.handleViewMoreClick.bind(null, 'tags')}
          title={'Tags'}
          items={this.props.tags}
          userId={this.props.id} />
        <ShowActivitySummaryItem
          handleViewMoreClick={this.props.handleViewMoreClick.bind(null, 'badges')}
          title={'Badges'}
          items={this.props.badges}
          subTabs={['recent', 'class', 'name']}
          userId={this.props.id} />
        <ShowActivitySummaryItem
          title={'Votes Cast'}
          items={this.props.votes}
          userId={this.props.id} />
      </div>
    );
  }
});

module.exports = ShowActivitySummary;
