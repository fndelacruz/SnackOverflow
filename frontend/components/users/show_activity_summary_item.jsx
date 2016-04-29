var React = require('react');
var MiniNav = require('../shared/mini_nav');
var ShowActivitySummaryItemLineItem = require('./show_activity_summary_item_line_item');
var hashHistory = require('react-router').hashHistory;
var UserStore = require('../../stores/user');
var UserActions = require('../../actions/user');
var Util = require('../../util/util');

var ShowActivitySummaryItem = React.createClass({
  getInitialState: function() {
    if (this.props.subTabs) {
      return { subTab: UserStore.getActivitySortBy(this.props.title) };
    } else {
      return null;
    }
  },
  handleClick: function(tab) {
    UserActions.resetActivitySortBy({ type: this.props.title, tab: tab });
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
        var answers = this.props.items;
        switch (this.state.subTab) {
          case 'votes':
            Util.sortBy(answers, 'vote_count', true);
            break;
          case 'newest':
            Util.sortBy(answers, 'created_at', true);
            break;
        }
        return (answers.slice(0,5).map(function(answer) {
          var path = 'questions/' + answer.question_id;

          return (
            <ShowActivitySummaryItemLineItem
              key={'answer-' + answer.id}
              handleClick={function() { hashHistory.push(path); }}
              title={answer.title}
              createdAt={answer.created_at}
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
  handleMoreClick: function() {
    var path = '/users/' + this.props.userId + '/' +
      this.props.title.toLowerCase();
    hashHistory.push(path);
  },
  render: function() {
    if (!this.props.items) {
      return <div />;
    }
    var headerLabelClass = 'user-show-common-header-label';
    var footer, onClick;

    if (this.props.title !== 'Votes Cast') {
      headerLabelClass += ' link';
      footer = (
        <span
          onClick={this.handleMoreClick}
          className='show-activity-summary-item-footer link'>
          View more →
        </span>
      );
      onClick = this.handleMoreClick;
    }

    return (
      <div className='show-activity-summary-item-container'>
        <div className='user-show-common-header'>
          <span className={headerLabelClass} onClick={onClick}>
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
        {footer}
      </div>
    );
  }
});

module.exports = ShowActivitySummaryItem;
