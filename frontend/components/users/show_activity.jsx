var React = require('react');
var UserStore = require('../../stores/user');
var UserActions = require('../../actions/user');
var SortNav = require('../shared/sort_nav');
var ShowActivitySummary = require('./show_activity_summary');
var hashHistory = require('react-router').hashHistory;
var ShowActivityDetail = require('./show_activity_detail');
var USER_SHOW_ACTIVITY_TABS = ['summary', 'answers', 'questions', 'tags', 'badges', 'favorites', 'reputation'];

var UserShowActivity = React.createClass({
  handleSortChange: function(tab) {
    if (this.props.active !== tab) {
      var path = '/users/' + this.props.id + '/' + tab;
      hashHistory.push(path);
    }
  },
  renderMain: function() {
    var items;
    switch (this.props.active) {
      case 'summary':
        return (
          <ShowActivitySummary
            handleViewMoreClick={this.props.handleViewMoreClick}
            {...this.props} />
        );
      case 'answers':
        items = this.props.given_answers;
        break;
      case 'reputation':
        items = this.props.reputations;
        break;
      default:
        items = this.props[this.props.active];
    }
    return (
      <ShowActivityDetail
        items={items}
        title={this.props.active}/>
    );
  },
  render: function(tab) {
    return (
      <div className='show-activity-container'>
        <SortNav
          tabShift='left'
          links={USER_SHOW_ACTIVITY_TABS}
          active={this.props.active}
          handleSortChange={this.handleSortChange} />
        {this.renderMain()}
      </div>
    );
  }
});

module.exports = UserShowActivity;
