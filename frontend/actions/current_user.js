var AppDispatcher = require('../dispatcher/dispatcher');
var CurrentUserConstants = require('../constants/current_user');

module.exports = {
  receiveCurrentUser: function(currentUser) {
    AppDispatcher.dispatch({
      action: currentUser,
      actionType: CurrentUserConstants.RECEIVED_CURRENT_USER
    });
  }
};
