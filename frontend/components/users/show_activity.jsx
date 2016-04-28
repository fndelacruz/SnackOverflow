var React = require('react');
var UserStore = require('../../stores/user');
var UserActions = require('../../actions/user');
var SortNav = require('../shared/sort_nav');
var ShowActivitySummary = require('./show_activity_summary');
var hashHistory = require('react-router').hashHistory;

var USER_SHOW_ACTIVITY_TABS = ['summary', 'answers', 'questions', 'tags', 'badges', 'favorites', 'reputation'];

var UserShowActivity = React.createClass({
  handleSortChange: function(tab) {
    var path = '/users/' + this.props.id + '/' + tab;
    hashHistory.push(path);
  },
  renderMain: function() {
    switch (this.props.active) {
      case 'summary':
        return (<ShowActivitySummary />);
      default:
        return (
          <div>todo: {this.props.active}</div>
        );
    }
  },
  render: function(tab) {
    return (
      <div>
        <SortNav
          tabShift='left'
          links={USER_SHOW_ACTIVITY_TABS}
          active={this.props.active}
          handleSortChange={this.handleSortChange}/>
        {this.renderMain()}
      </div>
    );
  }
});

module.exports = UserShowActivity;
