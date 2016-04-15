var QuestionConstants = require('../constants/question');
var AppDispatcher = require('../dispatcher/dispatcher');

module.exports = {
  receiveQuestions: function(questions) {
    AppDispatcher.dispatch({
      action: questions,
      actionType: QuestionConstants.RECEIVE_QUESTIONS
    });
  },
  changeQuestionSort: function(sortBy) {
    AppDispatcher.dispatch({
      action: sortBy,
      actionType: QuestionConstants.CHANGE_QUESTION_SORT
    });
  }
};
