var Store = require('flux/utils').Store;
var AppDispatcher = require('../dispatcher/dispatcher');
var CurrentUserConstants = require('../constants/current_user');
var CurrentUserStore = new Store(AppDispatcher);
var Util = require('../util/util');

var _currentUser;
var _updateSubmissionErrors = [];
var _submissionComplete;
var _signupModalOn = false;
var _currentUserErrors = null;

function resetCurrentUser(currentUser) {
  if (currentUser.id) {
    currentUser.notifications.forEach(Util.formatDateHelper);
  } else {
    _currentUserErrors = currentUser.errors;
  }
  _currentUser = currentUser;
}

function resetUpdateSubmissionErrors(errors) {
  _updateSubmissionErrors = errors;
}

CurrentUserStore.getSignupModalOnStatus = function() {
  return _signupModalOn;
};

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
      break;
    case CurrentUserConstants.RECEIVED_CURRENT_USER_UPDATE_STATUS_BAD:
      resetUpdateSubmissionErrors(payload.action);
      _submissionComplete = true;
      break;
    case CurrentUserConstants.RESET_UPDATE_SUBMISSION_STATUS:
      _submissionComplete = false;
      break;
    case CurrentUserConstants.TOGGLE_SIGNUP_MODAL_ON:
      if (_signupModalOn) {
        _signupModalOn = false;
      } else {
        _signupModalOn = { warning: payload.action };
      }
      break;
  }
  this.__emitChange();
};

module.exports = CurrentUserStore;
