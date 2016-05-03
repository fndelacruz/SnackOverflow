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
    var items = this.props.items;
    switch (this.props.title) {
      case 'Answers': case 'Questions':
        switch (this.state.subTab) {
          case 'votes':
            Util.sortBy(items, 'vote_count', true);
            break;
          case 'newest':
            Util.sortBy(items, 'created_at', true);
            break;
        }
        return (items.slice(0,5).map(function(item) {
          var path = 'questions/' + item.question_id;
          if (this.props.title === 'Answers') {
            path += '/answer/' + item.id;
          }
          var key = this.props.title === 'Answers' ? 'answer-' : 'question-';

          return (
            <ShowActivitySummaryItemLineItem
              key={key + item.id}
              handleClick={function() { hashHistory.push(path); }}
              title={item.title}
              createdAt={item.created_at}
              count={item.vote_count} />
          );
        }.bind(this)));
      case 'Reputation':
        return (items.slice(0,5).map(function(item) {
          var path = 'questions/' + item.question_id;
          if (item.votable_type === 'Answer') {
            path += '/answer/' + item.votable_id;
          }
          var key = 'vote-' + item.id + '-reputation-' + item.reputation;
          return (
            <ShowActivitySummaryItemLineItem
              key={key + item.id}
              handleClick={function() { hashHistory.push(path); }}
              title={item.title}
              createdAt={item.created_at}
              count={item.reputation} />
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
    if (!this.props.items) {
      return <div />;
    }
    var headerLabelClass = 'user-show-common-header-label';
    var footer, onClick;

    if (this.props.title !== 'Votes Cast') {
      headerLabelClass += ' link';
      footer = (
        <span
          onClick={this.props.handleViewMoreClick}
          className='show-activity-summary-item-footer link'>
          View more →
        </span>
      );
      onClick = this.props.handleViewMoreClick;
    }

    return (
      <div className='show-activity-summary-item-container'>
        <div className='user-show-common-header'>
          <span className={headerLabelClass} onClick={onClick}>
            {this.props.title}
          </span>
          <span className='user-show-common-header-count'>
            {this.props.items ? this.props.items.length : 'undefined'}
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
