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
var _indexLoaded;

var _activityAnswerSortBy = 'votes';
var _activityQuestionSortBy = 'votes';
var _activityBadgeSortBy = 'recent';

function resetUsers(users) {
  _users = {};
  _indexLoaded = true;
  users.forEach(function(user) {
    Util.formatDateHelper(user);
    _users[user.id] = user;
  });
}

function resetUser(user) {
  Util.formatDateHelper(user);
  ['questions', 'given_answers', 'badges', 'reputations', 'favorites']
      .forEach(function(collection) {
    user[collection].forEach(Util.formatDateHelper);
  });
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
  _searchTerm = searchTerm.trim().toLowerCase();
}

UserStore.getActivitySortBy = function(type) {
  switch (type) {
    case 'Answers':
      return _activityAnswerSortBy;
    case 'Questions':
      return _activityQuestionSortBy;
    case 'Badges':
      return _activityBadgeSortBy;
  }
};

resetActivitySortBy = function(sortBy) {
  switch (sortBy.type) {
    case 'Answers':
      _activityAnswerSortBy = sortBy.tab;
      break;
    case 'Questions':
      _activityQuestionSortBy = sortBy.tab;
      break;
    case 'Badges':
      _activityBadgeSortBy = sortBy.tab;
      break;
  }
};

UserStore.getIndexLoaded = function() {
  return _indexLoaded;
};

UserStore.getPostsSelect = function() {
  return _postsSelect;
};

UserStore.getUser = function(userId) {
  if (!Object.keys(_users).length || !_users[userId]) {
    // NOTE: if ApiUti.fetchUsers did not yet succeed OR if user is not in the
    // store, do not attempt to fetch a user
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
      break;
    case UserConstants.CHANGE_USER_SORT:
      resetSortBy(payload.action);
      break;
    case UserConstants.CHANGE_USER_SEARCH_TERM:
      resetSearchTerm(payload.action);
      break;
    case UserConstants.RECEIVE_USER:
      resetUser(payload.action);
      break;
    case UserConstants.CHANGE_USER_POSTS_SORT:
      resetPostsSortBy(payload.action);
      break;
    case UserConstants.CHANGE_USER_POSTS_SELECT:
      resetPostsSelect(payload.action);
      break;
    case UserConstants.CHANGE_ACTIVITY_SORT_BY:
      resetActivitySortBy(payload.action);
      break;
  }
  this.__emitChange();
};

module.exports = UserStore;
