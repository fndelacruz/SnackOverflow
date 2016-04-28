var React = require('react');
var UserStore = require('../../stores/user');
var ApiUtil = require('../../util/api_util');
var SortNav = require('../shared/sort_nav');
var UserShowProfile = require('./show_profile');
var UserShowActivity = require('./show_activity');
var hashHistory = require('react-router').hashHistory;

var USER_SHOW_SORT_TYPES = ['Profile', 'Activity'];
var USER_SHOW_ACTIVITY_TABS = ['summary', 'answers', 'questions', 'tags', 'badges', 'favorites', 'reputation'];

var _callbackId;
var UserShow = React.createClass({
  getInitialState: function() {
    var tab = USER_SHOW_SORT_TYPES[0];
    var activeTab = USER_SHOW_ACTIVITY_TABS[0];
    if (this.props.params.tab) {
      if (USER_SHOW_ACTIVITY_TABS.indexOf(this.props.params.tab) !== -1) {
        tab = 'Activity';
        activityTab = this.props.params.tab;
      }
    }

    return {
      user: UserStore.getUser(this.props.params.userId),
      tab: tab,
      active: activeTab
    };
  },
  componentDidMount: function() {
    _callbackId = UserStore.addListener(this.onChange);
    ApiUtil.fetchUser(this.props.params.userId);
  },
  componentWillReceiveProps: function(newProps) {
    if (this.props.params.userId !== newProps.params.userId) {
      ApiUtil.fetchUser(newProps.params.userId);
    } else if (newProps.params.tab !== this.props.params.tab) {
      if (USER_SHOW_ACTIVITY_TABS.indexOf(newProps.params.tab) !== -1) {
        this.setState({ tab: 'Activity', active: newProps.params.tab });
      } else {
        this.setState({ tab: 'Profile' });
      }
    }
  },
  componentWillUnmount: function() {
    _callbackId.remove();
  },
  onChange: function() {
    this.setState({ user: UserStore.getUser(this.props.params.userId) });
  },
  handleSortChange: function(link) {
    if (this.state.tab !== link) {
      if (link === 'Profile') {
        var path = '/users/' + this.state.user.id;
        hashHistory.push(path);
      }
      this.setState({ tab: link });
    }
  },
  handleTab: function() {
    if (this.state.tab === 'Profile') {
      return (<UserShowProfile {...this.state.user} />);
    } else if (this.state.tab === 'Activity') {
      return (
        <UserShowActivity
          {...this.state.user}
          active={this.state.active} />
      );
    }
  },
  render: function() {
    return (
      <div className='user-show-container'>
        <SortNav
          tabShift='left'
          links={USER_SHOW_SORT_TYPES}
          active={this.state.tab}
          handleSortChange={this.handleSortChange}/>

        {this.handleTab()}
      </div>
    );
  }
});

module.exports = UserShow;
