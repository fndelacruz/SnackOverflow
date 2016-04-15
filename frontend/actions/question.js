var QuestionConstants = require('../constants/question');
var AppDispatcher = require('../dispatcher/dispatcher');

module.exports = {
  receiveQuestions: function(questions) {
    AppDispatcher.dispatch({
      action: questions,
      actionType: QuestionConstants.RECEIVE_QUESTIONS
    });
  }
};
