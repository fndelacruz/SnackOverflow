var Store = require('flux/utils').Store;
var AppDispatcher = require('../dispatcher/dispatcher');
var CurrentUserConstants = require('../constants/current_user');
var CurrentUserStore = new Store(AppDispatcher);
/*
 * TODO: add currentUser inbox, notifications
 */
var _currentUser;

function resetCurrentUser(currentUser) {
  _currentUser = currentUser;
}

CurrentUserStore.fetch = function() {
  if (_currentUser) {
    return $.extend({}, _currentUser);
  }
};

CurrentUserStore.__onDispatch = function(payload) {
  switch (payload.actionType) {
    case CurrentUserConstants.RECEIVED_CURRENT_USER:
      resetCurrentUser(payload.action);
      break;
  }
  this.__emitChange();
};

module.exports = CurrentUserStore;
