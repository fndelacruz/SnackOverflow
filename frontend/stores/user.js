var AppDispatcher = require('../dispatcher/dispatcher');
var Store = require('flux/utils').Store;
var UserConstants = require('../constants/user');
var Util = require('../util/util');

var UserStore = new Store(AppDispatcher);

var _users = {};
var _sortBy = 'reputation';

function resetUsers(users) {
  _users = {};
  users.forEach(function(user) {
    _users[user.id] = user;
  });
}

function resetSortBy(sortBy) {
  _sortBy = sortBy;
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
      Util.sortBy(users, 'id', true);
      break;
    case 'voters':
      Util.sortBy(users, 'vote_count', true);
      break;
  }
  return users;
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
  }
  this.__emitChange();
};

module.exports = UserStore;
