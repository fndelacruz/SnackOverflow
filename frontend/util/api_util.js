var CurrentUserActions = require('../actions/current_user');
var CurrentUserConstants = require('../constants/current_user');
var QuestionActions = require('../actions/question');

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
  },
  fetchQuestions: function() {
    $.ajax({
      method: 'GET',
      url: 'api/questions',
      dataType: 'json',
      success: function(questions) {
        QuestionActions.receiveQuestions(questions);
      },
      error: function() {
        debugger
      }
    });
  }
};
