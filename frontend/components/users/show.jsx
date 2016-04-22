var React = require('react');
var UserStore = require('../../stores/user');
var ApiUtil = require('../../util/api_util');
var SortNav = require('../shared/sort_nav');

var USER_SHOW_SORT_TYPES = ['Profile', 'Activity'];

var _callbackId;
var UserShow = React.createClass({
  getInitialState: function() {
    return {
      user: UserStore.getUser(this.props.params.userId),
      sortBy: USER_SHOW_SORT_TYPES[0]
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
    if (this.state.sortBy !== link) {
      this.setState({ sortBy: link });
    }
  },
  render: function() {
    return (
      <div className='user-show-container'>
        <SortNav
          tabShift='left'
          links={USER_SHOW_SORT_TYPES}
          active={this.state.sortBy}
          handleSortChange={this.handleSortChange}/>

        {JSON.stringify(this.state.user)}
      </div>
    );
  }
});

module.exports = UserShow;
