var Store = require('flux/utils').Store;
var AppDispatcher = require('../dispatcher/dispatcher');
var CurrentUserConstants = require('../constants/current_user');
var CurrentUserStore = new Store(AppDispatcher);

/*
 * TODO: add currentUser inbox, notifications
 */

var _currentUser;
var _updateSubmissionErrors = [];
var _submissionComplete;

function resetCurrentUser(currentUser) {
  _currentUser = currentUser;
}

function resetUpdateSubmissionErrors(errors) {
  _updateSubmissionErrors = errors;
}

CurrentUserStore.fetch = function() {
  if (_currentUser) {
    return $.extend({}, _currentUser);
  }
};

CurrentUserStore.getUpdateSubmissionErrors = function() {
  return _updateSubmissionErrors.slice();
};

CurrentUserStore.getSubmissionComplete = function() {
  return _submissionComplete;
};

CurrentUserStore.__onDispatch = function(payload) {
  switch (payload.actionType) {
    case CurrentUserConstants.RECEIVED_CURRENT_USER:
      resetCurrentUser(payload.action);
      break;
    case CurrentUserConstants.RECEIVED_CURRENT_USER_UPDATE_STATUS_OK:
      resetCurrentUser(payload.action);
      resetUpdateSubmissionErrors([]);
      _submissionComplete = true;
      console.log('ok');
      break;
    case CurrentUserConstants.RECEIVED_CURRENT_USER_UPDATE_STATUS_BAD:
      resetUpdateSubmissionErrors(payload.action);
      _submissionComplete = true;
      break;
    case CurrentUserConstants.RESET_UPDATE_SUBMISSION_STATUS:
      _submissionComplete = false;
      break;
  }
  this.__emitChange();
};

module.exports = CurrentUserStore;
