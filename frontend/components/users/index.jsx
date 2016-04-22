var React = require('react');
var SortNav = require('../shared/sort_nav');
var UserStore = require('../../stores/user');
var UserActions = require('../../actions/user');
var ApiUtil = require('../../util/api_util');
var UsersIndexItem = require('./index_item');
var SubSearch = require('../shared/sub_search');

var USER_SORT_TYPES = ['reputation', 'new users', 'voters'];

var _callbackId;

var UsersIndex = React.createClass({
  getInitialState: function() {
    return {
      users: UserStore.all(),
      sortBy: UserStore.getSortBy(),
      search: ''
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
  handleSearchChange: function(e) {
    var searchValue = e.currentTarget.value;
    UserActions.changeUserSearchTerm(searchValue);
    this.setState({ search: searchValue });
  },
  render: function() {
    var users = this.state.users.map(function(user) {
      return (
        <UsersIndexItem
          user={user}
          sortBy={this.state.sortBy}
          key={'user-' + user.id}/>
      );
    }.bind(this));
    return (
      <div className='users-index-container'>
        <SortNav
          tabShift='right'
          links={USER_SORT_TYPES}
          active={this.state.sortBy}
          header='Users'
          handleSortChange={this.handleSortChange}/>
        <SubSearch
          search={this.state.search}
          handleSearchChange={this.handleSearchChange}/>
        <div className='users-index-item-container'>
          {users}
        </div>
      </div>
    );
  }
});

module.exports = UsersIndex;
