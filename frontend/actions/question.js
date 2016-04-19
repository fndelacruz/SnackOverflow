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
  },
  receiveQuestion: function(question) {
    AppDispatcher.dispatch({
      action: question,
      actionType: QuestionConstants.RECEIVE_QUESTION
    });
  },
  changeAnswerSort: function(sortBy) {
    AppDispatcher.dispatch({
      action: sortBy,
      actionType: QuestionConstants.CHANGE_ANSWER_SORT
    });
  }
};
