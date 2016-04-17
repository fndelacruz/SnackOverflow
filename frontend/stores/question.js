var Store = require('flux/utils').Store;
var AppDispatcher = require('../dispatcher/dispatcher');
var QuestionConstants = require('../constants/question');
var QuestionStore = new Store(AppDispatcher);

var _questions = {};
var _sortBy = 'newest';

function resetQuestions(questions) {
  _questions = {};
  questions.forEach(function(question) {
    _questions[question.id] = question;
  });
}

function changeQuestionSort(sortBy) {
  _sortBy = sortBy;
}

function sortByNewest(questions) {
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

function sortByVotes(questions) {
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

function sortByViews(questions) {
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

QuestionStore.all = function() {
  var questions = Object.keys(_questions).map(function(id) {
    return _questions[id];
  });
  switch (_sortBy) {
    // TODO: DRY this enumeration of sort types. combine with the array literal
    // QuestionIndexItem. move to util constants?
    case 'newest':
      console.log('sorting by', _sortBy);
      sortByNewest(questions);
      break;
    case 'featured':
      console.log('sorting by', _sortBy);
      console.error('TODO');
      break;
    case 'frequent':
      console.log('sorting by', _sortBy);
      console.error('TODO');
      break;
    case 'votes':
      console.log('sorting by', _sortBy);
      sortByVotes(questions);
      break;
    case 'active':
      console.log('sorting by', _sortBy);
      console.error('TODO');
      break;
    case 'views':
      console.log('sorting by', _sortBy);
      sortByViews(questions);
      break;
  }
  return questions; // TODO: take this out after implementing the rest of sort options
};

QuestionStore.getQuestion = function(questionId) {
  return $.extend({}, _questions[questionId]);
};

QuestionStore.getSortBy = function() {
  return _sortBy;
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
  }
  this.__emitChange();
};

module.exports = QuestionStore;
