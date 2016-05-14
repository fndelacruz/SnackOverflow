var React = require('react');
var UserStore = require('../../stores/user');
var ApiUtil = require('../../util/api_util');
var SortNav = require('../shared/sort_nav');
var UserShowProfile = require('./show_profile');
var UserShowActivity = require('./show_activity');
var hashHistory = require('react-router').hashHistory;
var CurrentUserStore = require('../../stores/current_user');
var UserShowSettings = require('./show_settings');
var NotFound = require('../shared/not_found');

var USER_SHOW_SORT_TYPES = ['Profile', 'Activity'];
var USER_SHOW_ACTIVITY_TABS = ['summary', 'answers', 'questions', 'tags', 'badges', 'favorites', 'reputation'];

var _callbackId;
var _callbackId2;
var UserShow = React.createClass({
  CurrentUserStore: CurrentUserStore,

  getInitialState: function() {
    var tab = USER_SHOW_SORT_TYPES[0];
    var activeTab = USER_SHOW_ACTIVITY_TABS[0];
    if (this.props.params.tab) {
      if (USER_SHOW_ACTIVITY_TABS.indexOf(this.props.params.tab) !== -1) {
        tab = 'Activity';
        activeTab = this.props.params.tab;
      } else if (this.props.params.tab === 'settings') {
        tab = 'Edit Profile Settings';
      } else {
        tab = 'Activity';
      }
    }

    return {
      user: UserStore.getUser(this.props.params.userId),
      tab: tab,
      active: activeTab,
      currentUser: this.CurrentUserStore.fetch()
    };
  },
  componentDidMount: function() {
    _callbackId = UserStore.addListener(this.onChange);
    _callbackId2 = CurrentUserStore.addListener(this.onCurrentUserChange);
    ApiUtil.fetchUser(this.props.params.userId);
  },
  componentWillReceiveProps: function(newProps) {
    if (this.props.params.userId !== newProps.params.userId) {
      ApiUtil.fetchUser(newProps.params.userId);
    } else if (newProps.params.tab !== this.props.params.tab) {
      if (USER_SHOW_ACTIVITY_TABS.indexOf(newProps.params.tab) !== -1) {
        this.setState({ tab: 'Activity', active: newProps.params.tab });
      } else if (newProps.params.tab === 'settings') {
        this.setState({ tab: 'Edit Profile Settings' });
      } else {
        this.setState({ tab: 'Profile' });
      }
    }
  },
  componentWillUnmount: function() {
    _callbackId.remove();
    _callbackId2.remove();
  },
  onCurrentUserChange: function() {
    this.setState({ currentUser: this.CurrentUserStore.fetch() });
  },
  onChange: function() {
    this.setState({ user: UserStore.getUser(this.props.params.userId) });
  },
  handleViewMoreClick: function(tab) {
    var path = '/users/' + this.props.params.userId + '/' + tab;
    hashHistory.push(path);
  },
  handleProfileActivityTab: function(link) {

    if (this.handleUserShowSortTypes().indexOf(link) !== -1 &&
        this.state.tab !== link) {
      var path = '/users/' + this.state.user.id;
      if (link === 'Activity') {
        path += '/summary';
      } else if (link === 'Edit Profile Settings') {
        path += '/settings';
      }

      hashHistory.push(path);
      this.setState({ tab: link });
    }
  },
  handleTab: function() {
    if (this.state.tab === 'Profile') {
      return (
        <UserShowProfile
          handleViewMoreClick={this.handleViewMoreClick}
          {...this.state.user} />
        );
    } else if (this.state.tab === 'Activity') {
      return (
        <UserShowActivity
          {...this.state.user}
          handleViewMoreClick={this.handleViewMoreClick}
          active={this.state.active} />
      );
    } else if (this.state.tab === 'Edit Profile Settings') {
      return (
        <UserShowSettings {...this.state.currentUser} />
      );
    }
  },
  handleUserShowSortTypes: function() {
    var adjustedUserShowSortTypes = USER_SHOW_SORT_TYPES;
    if (this.state.currentUser.id === this.state.user.id) {
      adjustedUserShowSortTypes = USER_SHOW_SORT_TYPES
        .concat('Edit Profile Settings');
    }
    return adjustedUserShowSortTypes;
  },
  render: function() {
    window.scrollTo(0, 0);
    var userInfo;
    if (!this.state.currentUser || !this.state.user) {
      return <div />;
    } else if (this.state.tab === 'Edit Profile Settings' &&
        parseInt(this.props.params.userId) !== this.state.currentUser.id) {
      return <NotFound />;
    }

    if (this.state.tab === 'Activity') {
      userInfo = {
        id: this.state.user.id,
        displayName: this.state.user.display_name
      };
    }
    return (
      <div className='user-show-container'>
        <SortNav
          userInfo={userInfo}
          tabShift='left'
          links={this.handleUserShowSortTypes()}
          active={this.state.tab}
          handleSortChange={this.handleProfileActivityTab}/>

        {this.handleTab()}
      </div>
    );
  }
});

module.exports = UserShow;
