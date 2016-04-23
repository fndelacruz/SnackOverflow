var React = require('react');
var UserStore = require('../../stores/user');
var ApiUtil = require('../../util/api_util');
var SortNav = require('../shared/sort_nav');
var UserShowProfile = require('./show_profile');
var UserShowActivity = require('./show_activity');

var USER_SHOW_SORT_TYPES = ['Profile', 'Activity'];

var _callbackId;
var UserShow = React.createClass({
  getInitialState: function() {
    return {
      user: UserStore.getUser(this.props.params.userId),
      tab: USER_SHOW_SORT_TYPES[0]
    };
  },
  componentDidMount: function() {
    _callbackId = UserStore.addListener(this.onChange);
    ApiUtil.fetchUser(this.props.params.userId);
  },
  componentWillReceiveProps: function(newProps) {
    ApiUtil.fetchUser(newProps.params.userId);
  },
  componentWillUnmount: function() {
    _callbackId.remove();
  },
  onChange: function() {
    this.setState({ user: UserStore.getUser(this.props.params.userId) });
  },
  handleSortChange: function(link) {
    if (this.state.tab !== link) {
      this.setState({ tab: link });
    }
  },
  handleTab: function() {
    if (this.state.tab === 'Profile') {
      return (<UserShowProfile {...this.state.user} />);
    } else if (this.state.tab === 'Activity') {
      return (<UserShowActivity {...this.state.user} />);
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
