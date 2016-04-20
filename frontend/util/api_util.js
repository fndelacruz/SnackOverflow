var CurrentUserActions = require('../actions/current_user');
var CurrentUserConstants = require('../constants/current_user');
var QuestionActions = require('../actions/question');
var hashHistory = require('react-router').hashHistory;

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
  },
  fetchQuestion: function(questionId) {
    $.ajax({
      method: 'GET',
      url: 'api/questions/' + questionId,
      dataType: 'json',
      success: function(question) {
        QuestionActions.receiveQuestion(question);
      },
      error: function() {
        debugger
      }
    });
  },
  createVote: function(vote) {
    $.ajax({
      method: 'POST',
      url: '/api/votes',
      data: vote,
      dataType: 'json',
      success: function(question) {
        QuestionActions.receiveQuestion(question);
      },
      error: function() {
        debugger
      }
    });
  },
  destroyVote: function(voteId) {
    $.ajax({
      method: 'DELETE',
      url: '/api/votes/' + voteId,
      dataType: 'json',
      success: function(question) {
        QuestionActions.receiveQuestion(question);
      },
      error: function() {
        debugger
      }
    });
  },
  createFavorite: function(questionId) {
    $.ajax({
      method: 'POST',
      url: '/api/favorites',
      data: { 'favorite[question_id]': questionId },
      dataType: 'json',
      success: function(question) {
        QuestionActions.receiveQuestion(question);
      },
      error: function() {
        debugger
      }
    });
  },
  destroyFavorite: function(favoriteId) {
    $.ajax({
      method: 'DELETE',
      url: '/api/favorites/' + favoriteId,
      dataType: 'json',
      success: function(question) {
        QuestionActions.receiveQuestion(question);
      },
      error: function() {
        debugger
      }
    });
  },
  createComment: function(comment, callback) {
    $.ajax({
      method: 'POST',
      url: '/api/comments',
      data: comment,
      dataType: 'json',
      success: function(question) {
        QuestionActions.receiveQuestion(question);
        callback();
      },
      error: function() {
        debugger
      }
    });
  },
  destroyComment: function(commentId) {
    $.ajax({
      method: 'DELETE',
      url: '/api/comments/' + commentId,
      dataType: 'json',
      success: function(question) {
        QuestionActions.receiveQuestion(question);
      },
      error: function() {
        debugger
      }
    });
  },
  createQuestion: function(question, callback) {
    $.ajax({
      method: 'POST',
      url: 'api/questions',
      data: question,
      dataType: 'json',
      success: function(question) {
        QuestionActions.receiveQuestion(question);
        hashHistory.push('/questions/' + question.id);
      },
      error: function() {
        debugger
      }
    });
  },
  createAnswer: function(answer) {
    $.ajax({
      method: 'POST',
      url: '/api/answers',
      data: answer,
      dataType: 'json',
      success: function(question) {
        QuestionActions.receiveQuestion(question);
      },
      error: function() {
        debugger
      }
    });
  },
  destroyQuestion: function(questionId, callback) {
    $.ajax({
      method: 'DELETE',
      url: '/api/questions/' + questionId,
      dataType: 'json',
      success: function(questions) {
        callback();
        QuestionActions.receiveQuestions(questions);
      },
      error: function() {
        debugger;
      }
    });
  },
  destroyAnswer: function(answerId) {
    $.ajax({
      method: 'DELETE',
      url: '/api/answers/' + answerId,
      dataType: 'json',
      success: function(question) {
        QuestionActions.receiveQuestion(question);
      },
      error: function() {
        debugger;
      }
    });
  },
};
