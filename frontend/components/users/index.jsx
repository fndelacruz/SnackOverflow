var React = require('react');
var SortNav = require('../shared/sort_nav');
var UserStore = require('../../stores/user');
var UserActions = require('../../actions/user');
var ApiUtil = require('../../util/api_util');

var USER_SORT_TYPES = ['reputation', 'new users', 'voters'];

var _callbackId;

var UsersIndex = React.createClass({
  getInitialState: function() {
    return {
      users: UserStore.all(),
      sortBy: UserStore.getSortBy()
    };
  },
  componentDidMount: function() {
    _callbackId = UserStore.addListener(this.onChange);
    ApiUtil.fetchUsers();
  },
  componentWillUnmount: function() {
    _callbackId.remove();
  },
  handleSortChange: function(sortBy) {
    UserActions.changeUserSort(sortBy);
  },
  onChange: function() {
    this.setState({
      users: UserStore.all(),
      sortBy: UserStore.getSortBy()
    });
  },
  render: function() {
    return (
      <div>
        <SortNav
          links={USER_SORT_TYPES}
          active={this.state.sortBy}
          header='Users'
          handleSortChange={this.handleSortChange}/>
        <ul>
          {this.state.users.map(function(user) {
            return (
              <li key={'user-' + user.id}>
                {user.id + ': ' + user.display_name +
                  ', reputation: ' + user.reputation +
                  ', vote_count: ' + user.vote_count}
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
});

module.exports = UsersIndex;
