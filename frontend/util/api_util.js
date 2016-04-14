var CurrentUserActions = require('../actions/current_user');
var CurrentUserConstants = require('../constants/current_user');
module.exports = {
  fetchCurrentUser: function() {
    $.ajax({
      method: 'GET',
      url: '/api/users/current',
      dataType: 'json',
      success: function(currentUser) {
        CurrentUserActions.receiveCurrentUser(currentUser);
      },
      error: function() {
        debugger
      }
    });
  }
};
