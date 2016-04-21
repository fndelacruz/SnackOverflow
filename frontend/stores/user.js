var AppDispatcher = require('../dispatcher/dispatcher');
var Store = require('flux/utils').Store;
var UserConstants = require('../constants/user');
var Util = require('../util/util');

var UserStore = new Store(AppDispatcher);

var _users = {};
var _sortBy = 'reputation';
var _searchTerm = '';

function resetUsers(users) {
  _users = {};
  users.forEach(function(user) {
    user.created_at = new Date(user.created_at);
    _users[user.id] = user;
  });
}

function resetSortBy(sortBy) {
  _sortBy = sortBy;
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

function sortBy(users, sortType, isDescending) {
  users.sort(function(a, b) {
    if (a.reputation < b.reputation) {
      return -1;
    } else if (a.reputation > b.reputation) {
      return 1;
    } else if (a.reputation === b.reputation) {
      return 0;
    }
  });
}

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
  }
};

module.exports = UserStore;
