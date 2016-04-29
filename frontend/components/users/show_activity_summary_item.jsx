var React = require('react');
var MiniNav = require('../shared/mini_nav');
var ShowActivitySummaryItemLineItem = require('./show_activity_summary_item_line_item');
var hashHistory = require('react-router').hashHistory;

var ShowActivitySummaryItem = React.createClass({
  getInitialState: function() {
    if (this.props.subTabs) {
      return { subTab: this.props.subTabs[0] };
    } else {
      return null;
    }
  },
  handleClick: function(tab) {
    this.setState({ subTab: tab });
  },
  renderSubTabs: function() {
    if (this.props.subTabs) {
      return (
        <MiniNav
          links={this.props.subTabs}
          handleClick={this.handleClick}
          active={this.state.subTab} />
      );
    }
  },
  renderElements: function() {
    switch (this.props.title) {
      case 'Answers':
        return (this.props.items.slice(0,5).map(function(answer) {
          var path = 'questions/' + answer.question_id;

          return (
            <ShowActivitySummaryItemLineItem
              handleClick={function() { hashHistory.push(path); }}
              title={answer.title}
              count={answer.vote_count} />
          );
        }.bind(this)));
      default:
        return (
          <div>
            renderElements placeholder
          </div>
        );
    }
  },
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
          {this.renderSubTabs()}
        </div>
        <div className='show-activity-summary-item-main'>
          {this.renderElements()}
        </div>
        <span className='show-activity-summary-item-footer link'>
          View more →
        </span>
      </div>
    );
  }
});

module.exports = ShowActivitySummaryItem;
