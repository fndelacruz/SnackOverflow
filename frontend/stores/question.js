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
      // console.log('sorting by', _questionSortBy);
      sortQuestionsByNewest(questions);
      break;
    case 'featured':
      // console.log('sorting by', _questionSortBy);
      console.error('TODO');
      break;
    case 'frequent':
      // console.log('sorting by', _questionSortBy);
      console.error('TODO');
      break;
    case 'votes':
      // console.log('sorting by', _questionSortBy);
      sortQuestionsByVotes(questions);
      break;
    case 'active':
      // console.log('sorting by', _questionSortBy);
      console.error('TODO');
      break;
    case 'views':
      // console.log('sorting by', _questionSortBy);
      sortQuestionsByViews(questions);
      break;
  }
  return questions; // TODO: take this out after implementing the rest of sort options
};

QuestionStore.getQuestion = function(questionId) {
  if (!Object.keys(_questions).length) {
    return {};
  }
  var answers = _questions[questionId].answers;
    switch (_sortAnswersBy) {
      case 'active':
      // console.log('sorting answers by', _sortAnswersBy);
      sortAnswersByActive(answers);
      break;
      case 'oldest':
      // console.log('sorting answers by', _sortAnswersBy);
      sortAnswersByOldest(answers);
      break;
      case 'votes':
      // console.log('sorting answers by', _sortAnswersBy);
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

// var _answers = {};
var _sortAnswersBy = 'votes';

// function resetAnswers(answers) {
//   _answers = {};
//   answers.forEach(function(answer) {
//     _answers[answer.id] = answer;
//   });
// }

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

// function resetAnswer(answer) {
//   _answers[answer.id] = answer;
// }

// QuestionStore.allAnswers = function(questionId) {
//   // var answers = Object.keys(_questions[questionId].answers).map(function(id) {
//   //   return _answers[id];
//   // });
//   var answers = _questions[questionId].answers;
//   // debugger
//   if (!answers) {
//     return [];
//   }
//   switch (_sortAnswersBy) {
//     case 'active':
//       // console.log('sorting answers by', _sortAnswersBy);
//       sortAnswersByActive(answers);
//       break;
//     case 'oldest':
//       // console.log('sorting answers by', _sortAnswersBy);
//       sortAnswersByOldest(answers);
//       break;
//     case 'votes':
//       // console.log('sorting answers by', _sortAnswersBy);
//       sortAnswersByVotes(answers);
//       break;
//   }
//   return answers;
// };

// AnswerStore.getAnswer = function(answerId) {
//   return $.extend({}, _answers[answerId]);
// };

QuestionStore.getAnswerSortBy = function() {
  return _sortAnswersBy;
};

module.exports = QuestionStore;
