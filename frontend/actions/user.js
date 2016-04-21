var AppDispatcher = require('../dispatcher/dispatcher');
var UserConstants = require('../constants/user');

module.exports = {
  receiveUsers: function(users) {
    AppDispatcher.dispatch({
      action: users,
      actionType: UserConstants.RECEIVE_USERS
    });
  },
  changeUserSort: function(sortBy) {
    AppDispatcher.dispatch({
      action: sortBy,
      actionType: UserConstants.CHANGE_USER_SORT
    });
  },
  changeUserSearchTerm: function(searchTerm) {
    AppDispatcher.dispatch({
      action: searchTerm,
      actionType: UserConstants.CHANGE_USER_SEARCH_TERM
    });
  }
};
