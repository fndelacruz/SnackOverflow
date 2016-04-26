var AppDispatcher = require('../dispatcher/dispatcher');
var Store = require('flux/utils').Store;
var UserConstants = require('../constants/user');
var Util = require('../util/util');

var UserStore = new Store(AppDispatcher);

var _users = {};
var _sortBy = 'reputation';
var _searchTerm = '';
var _postsSortBy = 'Votes';
var _postsSelect = 'All';

function resetUsers(users) {
  _users = {};
  users.forEach(function(user) {
    Util.formatDateHelper(user);
    _users[user.id] = user;
  });
}

function resetUser(user) {
  Util.formatDateHelper(user);
  user.questions.forEach(Util.formatDateHelper);
  user.given_answers.forEach(Util.formatDateHelper);
  user.posts = user.questions.concat(user.given_answers);
  Util.sortBy(user.posts, 'vote_reputation', true); // by default, sorts by vote_count
  _users[user.id] = user;
}

function resetPostsSortBy(sortBy) {
  _postsSortBy = sortBy;
}

function resetSortBy(sortBy) {
  _sortBy = sortBy;
}

function resetPostsSelect(select) {
  _postsSelect = select;
}

function resetSearchTerm(searchTerm) {
  if (searchTerm.length >= 3) {
    _searchTerm = searchTerm;
    this.__emitChange();
  } else if (searchTerm.length < 3 && _searchTerm !== '') {
    _searchTerm = '';
    this.__emitChange();
  }
}

UserStore.getPostsSelect = function() {
  return _postsSelect;
};

UserStore.getUser = function(userId) {
  if (!Object.keys(_users).length) {
    // NOTE: if ApiUti.fetchUsers did not yet succeed, do not attempt to fetch
    // a user
    return {};
  }
  if (typeof _users[userId].posts === 'undefined') {
    // NOTE: if ApiUtil.fetchUser did not yet succeed, do not yet deal with
    // sorting objects that don't exist here yet
    return $.extend({}, _users[userId]);
  }
  switch (_postsSelect) {
    case 'All':
      _users[userId].posts = _users[userId].questions
        .concat(_users[userId].given_answers);
      break;
    case 'Questions':
      _users[userId].posts = _users[userId].questions;
      break;
    case 'Answers':
      _users[userId].posts = _users[userId].given_answers;
      break;
  }
  switch (_postsSortBy) {
    case 'Votes':
      Util.sortBy(_users[userId].posts, 'vote_count', true);
      break;
    case 'Newest':
      Util.sortBy(_users[userId].posts, 'created_at', true);
      break;
  }
  return $.extend({}, _users[userId]);
};

UserStore.getPostsSortBy = function() {
  return _postsSortBy;
};

UserStore.all = function() {
  users = Object.keys(_users).map(function(userId) {
    return _users[userId];
  });
  switch (_sortBy) {
    case 'reputation':
      Util.sortBy(users, 'reputation', true);
      break;
    case 'new users':
      Util.sortBy(users, 'created_at', true);
      break;
    case 'voters':
      Util.sortBy(users, 'vote_count', true);
      break;
  }

  if (_searchTerm.length) {
    return users.filter(function(user) {
      return user.display_name.toLowerCase().search(_searchTerm) !== -1;
    });
  } else {
    return users;
  }
};

UserStore.getSortBy = function() {
  return _sortBy;
};

UserStore.__onDispatch = function(payload) {
  switch (payload.actionType) {
    case UserConstants.RECEIVE_USERS:
      resetUsers(payload.action);
      this.__emitChange();
      break;
    case UserConstants.CHANGE_USER_SORT:
      resetSortBy(payload.action);
      this.__emitChange();
      break;
    case UserConstants.CHANGE_USER_SEARCH_TERM:
      resetSearchTerm.call(this, payload.action.toLowerCase());
      break;
    case UserConstants.RECEIVE_USER:
      resetUser(payload.action);
      this.__emitChange();
      break;
    case UserConstants.CHANGE_USER_POSTS_SORT:
      resetPostsSortBy(payload.action);
      this.__emitChange();
      break;
    case UserConstants.CHANGE_USER_POSTS_SELECT:
      resetPostsSelect(payload.action);
      this.__emitChange();
      break;
  }
};

module.exports = UserStore;
