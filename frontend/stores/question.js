var Store = require('flux/utils').Store;
var AppDispatcher = require('../dispatcher/dispatcher');
var QuestionConstants = require('../constants/question');
var QuestionStore = new Store(AppDispatcher);
var Util = require('../util/util');
var ApiUtil = require('../util/api_util');

/* Questions */

var _questions = {};
var _questionSortBy = 'newest';
var _tagName = null;

function formatDateHelper(item) {
  item.created_at = new Date(item.created_at);
  item.updated_at = new Date(item.updated_at);
}

function formatDates(question) {
  formatDateHelper(question);

  question.comments.forEach(formatDateHelper);
  Util.sortBy(question.comments, 'created_at', true);

  question.answers.forEach(function(answer) {
    formatDateHelper(answer);
    answer.comments.forEach(formatDateHelper);
    Util.sortBy(answer.comments, 'created_at', true);
  });
}

function resetQuestions(questions) {
  _questions = {};
  questions.forEach(function(question) {
    formatDates(question);
    _questions[question.id] = question;
  });
}

function changeQuestionSort(questionSortBy) {
  _questionSortBy = questionSortBy;
}

function resetQuestion(question) {
  formatDates(question);
  _questions[question.id] = question;
}

function setTagName(tagName) {
  _tagName = tagName;
}

QuestionStore.allQuestions = function() {
  var questions = Object.keys(_questions).map(function(id) {
    return _questions[id];
  });

  if (_tagName) {
    questions = questions.filter(function(question) {
      var tags = question.tags.map(function(tag) {
        return tag.name;
      });
      return tags.indexOf(_tagName) !== -1;
    });
  }

  switch (_questionSortBy) {
    // TODO: DRY this enumeration of sort types. combine with the array literal
    // QuestionIndexItem. move to util constants?
    case 'newest':
      Util.sortBy(questions, 'created_at', true);
      break;
    case 'featured':
      console.error('TODO');
      break;
    case 'frequent':
      console.error('TODO');
      break;
    case 'votes':
      Util.sortBy(questions, 'vote_count', true);
      break;
    case 'active':
      console.error('TODO');
      break;
    case 'views':
      Util.sortBy(questions, 'view_count', true);
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
      Util.sortBy(answers, 'created_at');
      break;
    case 'votes':
      Util.sortBy(answers, 'vote_count', true);
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
      ApiUtil.fetchCurrentUser();
      break;
    case QuestionConstants.CHANGE_QUESTION_SORT:
      changeQuestionSort(payload.action);
      break;
    case QuestionConstants.RECEIVE_QUESTION:
      resetQuestion(payload.action);
      ApiUtil.fetchCurrentUser();
      break;
    case QuestionConstants.CHANGE_ANSWER_SORT:
      changeAnswerSort(payload.action);
      break;
    case QuestionConstants.SET_TAG_NAME:
      setTagName(payload.action);
      break;
  }
  this.__emitChange();
};

/* Answers */

var _sortAnswersBy = 'votes';

function changeAnswerSort(sortAnswersBy) {
  _sortAnswersBy = sortAnswersBy;
}

function sortAnswersByActive(answers) {
  alert('TODO sortAnswersByActive');
}

QuestionStore.getAnswerSortBy = function() {
  return _sortAnswersBy;
};

module.exports = QuestionStore;
