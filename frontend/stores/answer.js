var Store = require('flux/utils').Store;
var AppDispatcher = require('../dispatcher/dispatcher');
var AnswerConstants = require('../constants/answer');
var AnswerStore = new Store(AppDispatcher);

var _answers = {};
var _sortBy = 'votes';

function resetAnswers(answers) {
  _answers = {};
  answers.forEach(function(answer) {
    _answers[answer.id] = answer;
  });
}

function changeAnswerSort(sortBy) {
  _sortBy = sortBy;
}

function sortByOldest(answers) {
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

function sortByVotes(answers) {
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

function sortByActive(answers) {
  alert('TODO');
}

// function resetAnswer(answer) {
//   _answers[answer.id] = answer;
// }

AnswerStore.all = function() {
  var answers = Object.keys(_answers).map(function(id) {
    return _answers[id];
  });
  switch (_sortBy) {
    case 'active':
      console.log('sorting by', _sortBy);
      sortByActive(answers);
      break;
    case 'oldest':
      console.log('sorting by', _sortBy);
      sortByOldest(answers);
      break;
    case 'votes':
      console.log('sorting by', _sortBy);
      sortByVotes(answers);
      break;
  }
  return answers;
};

// AnswerStore.getAnswer = function(answerId) {
//   return $.extend({}, _answers[answerId]);
// };

AnswerStore.getSortBy = function() {
  return _sortBy;
};

AnswerStore.__onDispatch = function(payload) {
  switch (payload.actionType) {
    case AnswerConstants.RECEIVE_ANSWERS:
      resetAnswers(payload.action);
      break;
    case AnswerConstants.CHANGE_ANSWER_SORT:
      changeAnswerSort(payload.action);
      break;
    //
    // NOTE: I think it is better to fetch all answers instead of a single
    // answer because AnswerActions will trigger ApiUtil.fetchQuestion, which
    // grabs all answers anyway. This also has the desirable side effect of
    // showing all updates to all answers (new votes, comments, answers, etc.)
    //
    // case AnswerConstants.RECEIVE_ANSWER:
    //   resetAnswer(payload.action);
    //   break;
  }
  this.__emitChange();
};

module.exports = AnswerStore;
