var AppDispatcher = require('../dispatcher/dispatcher');
var CurrentUserConstants = require('../constants/current_user');
var UserConstants = require('../constants/user');

module.exports = {
  receiveCurrentUser: function(currentUser) {
    AppDispatcher.dispatch({
      action: currentUser,
      actionType: CurrentUserConstants.RECEIVED_CURRENT_USER
    });
  },
  receiveCurrentUserUpdateStatusOK: function(currentUser) {
    AppDispatcher.dispatch({
      action: currentUser,
      actionType: CurrentUserConstants.RECEIVED_CURRENT_USER_UPDATE_STATUS_OK
    });
    AppDispatcher.dispatch({
      action: currentUser,
      actionType: UserConstants.RECEIVE_USER_SHALLOW
    });
  },
  receiveCurrentUserUpdateStatusBAD: function(errors) {
    AppDispatcher.dispatch({
      action: JSON.parse(errors.responseText),
      actionType: CurrentUserConstants.RECEIVED_CURRENT_USER_UPDATE_STATUS_BAD
    });
  },
  resetUpdateSubmissionStatus: function() {
    AppDispatcher.dispatch({
      actionType: CurrentUserConstants.RESET_UPDATE_SUBMISSION_STATUS
    });
  },
  toggleSignupModalOn: function(warning) {
    AppDispatcher.dispatch({
      action: warning,
      actionType: CurrentUserConstants.TOGGLE_SIGNUP_MODAL_ON
    });
  }
};
