var Store = require('flux/utils').Store;
var AppDispatcher = require('../dispatcher/dispatcher');
var QuestionConstants = require('../constants/question');
var QuestionStore = new Store(AppDispatcher);

/* Questions */

var _questions = {};
var _questionSortBy = 'newest';

function resetQuestions(questions) {
  _questions = {};
  questions.forEach(function(question) {
    _questions[question.id] = question;
  });
}

function changeQuestionSort(questionSortBy) {
  _questionSortBy = questionSortBy;
}

function sortQuestionsByNewest(questions) {
  // NOTE: Sorting by id as proxy for created_at
  questions.sort(function(a, b){
    if (a.id < b.id) {
      return 1;
    } else if (a.id > b.id) {
      return -1;
    } else {
      return 0;
    }
  });
}

function sortQuestionsByVotes(questions) {
  questions.sort(function(a, b){
    if (a.vote_count < b.vote_count) {
      return 1;
    } else if (a.vote_count > b.vote_count) {
      return -1;
    } else {
      return 0;
    }
  });
}

function sortQuestionsByViews(questions) {
  questions.sort(function(a, b){
    if (a.view_count < b.view_count) {
      return 1;
    } else if (a.view_count > b.view_count) {
      return -1;
    } else {
      return 0;
    }
  });
}

function resetQuestion(question) {
  _questions[question.id] = question;
}

QuestionStore.allQuestions = function() {
  var questions = Object.keys(_questions).map(function(id) {
    return _questions[id];
  });
  switch (_questionSortBy) {
    // TODO: DRY this enumeration of sort types. combine with the array literal
    // QuestionIndexItem. move to util constants?
    case 'newest':
      sortQuestionsByNewest(questions);
      break;
    case 'featured':
      console.error('TODO');
      break;
    case 'frequent':
      console.error('TODO');
      break;
    case 'votes':
      sortQuestionsByVotes(questions);
      break;
    case 'active':
      console.error('TODO');
      break;
    case 'views':
      sortQuestionsByViews(questions);
      break;
  }
  return questions;
};

QuestionStore.getQuestion = function(questionId) {
  if (!Object.keys(_questions).length) {
    return {};
  }
  var answers = _questions[questionId].answers;
    switch (_sortAnswersBy) {
      case 'active':
      sortAnswersByActive(answers);
      break;
      case 'oldest':
      sortAnswersByOldest(answers);
      break;
      case 'votes':
      sortAnswersByVotes(answers);
      break;
    }
  return $.extend({}, _questions[questionId]);
};

QuestionStore.getQuestionSortBy = function() {
  return _questionSortBy;
};

QuestionStore.__onDispatch = function(payload) {
  switch (payload.actionType) {
    case QuestionConstants.RECEIVE_QUESTIONS:
      resetQuestions(payload.action);
      break;
    case QuestionConstants.CHANGE_QUESTION_SORT:
      changeQuestionSort(payload.action);
      break;
    case QuestionConstants.RECEIVE_QUESTION:
      resetQuestion(payload.action);
      break;
    case QuestionConstants.CHANGE_ANSWER_SORT:
      changeAnswerSort(payload.action);
      break;
  }
  this.__emitChange();
};

/* Answers */

var _sortAnswersBy = 'votes';

function changeAnswerSort(sortAnswersBy) {
  _sortAnswersBy = sortAnswersBy;
}

function sortAnswersByOldest(answers) {
  // NOTE: Sorting by id as proxy for created_at
  answers.sort(function(a, b){
    if (a.id > b.id) {
      return 1;
    } else if (a.id < b.id) {
      return -1;
    } else {
      return 0;
    }
  });
}

function sortAnswersByVotes(answers) {
  answers.sort(function(a, b){
    if (a.vote_count < b.vote_count) {
      return 1;
    } else if (a.vote_count > b.vote_count) {
      return -1;
    } else {
      return 0;
    }
  });
}

function sortAnswersByActive(answers) {
  alert('TODO');
}

QuestionStore.getAnswerSortBy = function() {
  return _sortAnswersBy;
};

module.exports = QuestionStore;
