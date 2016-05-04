var React = require('react');
var MiniNav = require('../shared/mini_nav');
var ShowActivitySummaryItemLineItem = require('./show_activity_summary_item_line_item');
var ShowActivityTagItem = require('./show_activity_tag_item');
var hashHistory = require('react-router').hashHistory;
var UserStore = require('../../stores/user');
var UserActions = require('../../actions/user');
var Util = require('../../util/util');
var BadgeStub = require('../badges/stub');

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
              handleClick={hashHistory.push.bind(this, path)}
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
              handleClick={hashHistory.push.bind(this, path)}
              title={item.title}
              createdAt={item.created_at}
              count={item.reputation} />
          );
        }.bind(this)));
      case 'Tags':
        return (items.slice(0,10).map(function(item) {
          // TODO: handleClick as search query
          return (
            <ShowActivityTagItem
              key={'tag-' + item.name}
              handleClick={function() {alert('TODO handleTagClick');}}
              {...item} />
          );
        }));
      case 'Badges':
        switch (this.state.subTab) {
          case 'recent':
            Util.sortBy(items, 'created_at', true);
            break;
          case 'class':
            Util.sortBy(items, 'rank', true);
            break;
          case 'name':
            Util.sortBy(items, 'name');
            break;
        }
        return (items.slice(0,10).map(function(item) {
          // TODO: handleClick as search query
          var multipler;
          if (item.count > 1) {
            multipler = (
              <div className='show-activity-badge-item-count'>
                {'x ' + item.count}
              </div>
            );
          }
          return (
            <div
              className='show-activity-badge-item-container'
              key={'tag-' + item.name}
              handleClick={function() {alert('TODO handleBadgeClick');}}>
              <BadgeStub badge={item} />
              {multipler}
            </div>
          );
        }));
      case 'Votes Cast':
        var byType = (
          <div className='show-activity-votes-cast-data-container'>
            {['question', 'answer', 'comment'].map(function(type) {
              return (
                <div
                  key={'vote-container-' + type}
                  className='show-activity-votes-cast-data-element'>
                  <span className='show-activity-votes-cast-data-label'>
                    {type + ':'}
                  </span>
                  <span className='show-activity-votes-cast-data-value'>
                    {' ' + items[type]}
                  </span>
                </div>
              );
            })}
          </div>
        );

        var byTimeInterval = (['month', 'week', 'day'].map(function(timeInterval) {
          return (
            <div
              key={'vote-container-' + timeInterval}
              className='show-activity-votes-cast-element'>
              <div className='show-activity-votes-cast-label'>
                {timeInterval}
              </div>
              <div className='show-activity-votes-cast-data-container'>
                <div className='show-activity-votes-cast-data-element'>
                  <span className='show-activity-votes-cast-data-value'>
                    {items[timeInterval]}
                  </span>
                </div>
              </div>
            </div>
          );
        }));
        return (
          <div className='show-activity-votes-cast-container group'>
            <div className='show-activity-votes-cast-element'>
              <div className='show-activity-votes-cast-label'>
                all time
              </div>
              <div className='show-activity-votes-cast-data-container'>
                <div className='show-activity-votes-cast-data-element'>
                  <span className='show-activity-votes-cast-data-label'>
                    up:
                  </span>
                  <span className='show-activity-votes-cast-data-value'>
                    {' ' + items.up}
                  </span>
                </div>
                <div className='show-activity-votes-cast-data-element'>
                  <span className='show-activity-votes-cast-data-label'>
                    down:
                  </span>
                  <span className='show-activity-votes-cast-data-value'>
                    {' ' + items.down}
                  </span>
                </div>
              </div>
            </div>

            <div className='show-activity-votes-cast-element'>
              <div className='show-activity-votes-cast-label'>
                by type
              </div>
              {byType}
            </div>

            {byTimeInterval}
          </div>
        );
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

    switch (this.props.title) {
      case 'Answers': case 'Reputation': case 'Questions':
        if (this.props.items.length >= 5) {
          footer = (
            <span
              onClick={this.props.handleViewMoreClick}
              className='show-activity-summary-item-footer link'>
              View more →
            </span>
          );
        }
        break;
      case 'Tags': case 'Badges':
        if (this.props.items.length >= 10) {
          footer = (
            <span
              onClick={this.props.handleViewMoreClick}
              className='show-activity-summary-item-footer link'>
              View more →
            </span>
          );
        }
        break;
    }
    if (this.props.title !== 'Votes Cast') {
      headerLabelClass += ' link';
      onClick = this.props.handleViewMoreClick;
    }

    var items = this.props.items, count;
    if (items) {
      switch (this.props.title) {
        case 'Badges':
          count = 0;
          for (var badge in items) {
            count += items[badge].count;
          }
          break;
        case 'Votes Cast':
          count = this.props.items.total;
          break;
        default:
          count = items.length;
      }
    }

    return (
      <div className='show-activity-summary-item-container'>
        <div className='show-activity-header'>
          <span className={headerLabelClass} onClick={onClick}>
            {this.props.title}
          </span>
          <span className='user-show-common-header-count'>
            {count}
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
