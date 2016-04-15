var Store = require('flux/utils').Store;
var AppDispatcher = require('../dispatcher/dispatcher');
var QuestionConstants = require('../constants/question');
var QuestionStore = new Store(AppDispatcher);

var _questions = {};

function resetQuestions(questions) {
  _questions = {};
  questions.forEach(function(question) {
    _questions[question.id] = question;
  });
}

QuestionStore.all = function() {
  return Object.keys(_questions).map(function(id) {
    return _questions[id];
  });
};

QuestionStore.__onDispatch = function(payload) {
  switch (payload.actionType) {
    case QuestionConstants.RECEIVE_QUESTIONS:
      resetQuestions(payload.action);
      break;
  }
  this.__emitChange();
};

module.exports = QuestionStore;
