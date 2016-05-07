var CurrentUserActions = require('../actions/current_user');
var CurrentUserConstants = require('../constants/current_user');
var QuestionActions = require('../actions/question');
var UserActions = require('../actions/user');
var TagActions = require('../actions/tag');
var BadgeActions = require('../actions/badge');
var hashHistory = require('react-router').hashHistory;

module.exports = {
  // GETs

  fetchCurrentUser: function() {
    $.ajax({
      method: 'GET',
      url: '/api/users/current',
      dataType: 'json',
      success: CurrentUserActions.receiveCurrentUser,
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
      success: QuestionActions.receiveQuestions,
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
      success: QuestionActions.receiveQuestion,
      error: function() {
        debugger
      }
    });
  },
  fetchTags: function() {
    $.ajax({
      method: 'GET',
      url: 'api/tags/',
      dataType: 'json',
      success: TagActions.receiveTags,
      error: function() {
        debugger;
      }
    });
  },
  fetchQuestionsTag: function(tagName) {
    if (tagName) {
      $.ajax({
        method: 'GET',
        url: 'api/tags/' + tagName,
        dataType: 'json',
        success: QuestionActions.receiveQuestionsTag,
        error: function() {
          debugger
        }
      });
    } else {
      QuestionActions.receiveQuestionsTag(tagName);
    }
  },
  fetchUser: function(userId) {
    $.ajax({
      method: 'GET',
      url: '/api/users/' + userId,
      dataType: 'json',
      success: UserActions.receiveUser,
      error: function() {
        debugger
      }
    });
  },
  fetchBadges: function() {
    $.ajax({
      method: 'GET',
      url: '/api/badges',
      dataType: 'json',
      success: BadgeActions.receiveBadges
    });
  },

  // UPDATE

  updateCurrentUser: function(currentUserDetails) {
    var data = {
      '[user][display_name]': currentUserDetails.displayName,
      '[user][email]': currentUserDetails.email,
      '[user][location]': currentUserDetails.location,
      '[user][bio]': currentUserDetails.bio,
      '[user][password]': currentUserDetails.password,
    };

    $.ajax({
      method: 'PATCH',
      url: '/api/users/' + currentUserDetails.id,
      data: data,
      dataType: 'json',
      success: CurrentUserActions.receiveCurrentUserUpdateStatusOK,
      error: CurrentUserActions.receiveCurrentUserUpdateStatusBAD
    });
  },

  // POST and DELETE

  createVote: function(vote) {
    $.ajax({
      method: 'POST',
      url: '/api/votes',
      data: vote,
      dataType: 'json',
      success: QuestionActions.receiveQuestion,
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
      success: QuestionActions.receiveQuestion,
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
      success: QuestionActions.receiveQuestion,
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
      success: QuestionActions.receiveQuestion,
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
      success: QuestionActions.receiveQuestion,
      error: function() {
        debugger
      }
    });
  },
  createQuestion: function(question) {
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
  createAnswer: function(answer, callback) {
    $.ajax({
      method: 'POST',
      url: '/api/answers',
      data: answer,
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
      success: QuestionActions.receiveQuestion,
      error: function() {
        debugger;
      }
    });
  },
  fetchUsers: function() {
    $.ajax({
      method: 'GET',
      url: '/api/users',
      dataType: 'json',
      success: UserActions.receiveUsers,
      error: function() {
        debugger
      }
    });
  }
};
