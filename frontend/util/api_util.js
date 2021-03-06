var CurrentUserActions = require('../actions/current_user');
var CurrentUserConstants = require('../constants/current_user');
var QuestionActions = require('../actions/question');
var UserActions = require('../actions/user');
var TagActions = require('../actions/tag');
var BadgeActions = require('../actions/badge');
var SearchActions = require('../actions/search');
var hashHistory = require('react-router').hashHistory;
var CurrentUserStore = require('../stores/current_user');

function requireCurrentUser(callback) {
  if (CurrentUserStore.fetch().id) {
    callback();
  } else {
    CurrentUserActions.toggleSignupModalOn(true);
  }
}

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
  fetchBadge: function(badgeId) {
    $.ajax({
      method: 'GET',
      url: '/api/badges/' + badgeId,
      dataType: 'json',
      success: BadgeActions.receiveBadge
    });
  },
  searchPosts: function(query) {
    $.ajax({
      method: 'GET',
      url: 'api/search/query',
      data: { q: query },
      dataType: 'json',
      success: SearchActions.receivePosts,
      error: function() {
        debugger
      }
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

  markItemRead: function(item) {
    var url = '/api/' + (item.category === 'Answer' ? 'answers' : 'comments') +
      '/' + item.id;

    var data = { 'current_user_update': true };
    if (item.category === 'Answer') {
      data['[answer][unread]'] = false;
    } else {
      data['[comment][unread]'] = false;
    }

    $.ajax({
      method: 'PATCH',
      url: url,
      data: data,
      dataType: 'json',
      success: CurrentUserActions.receiveCurrentUser,
      error: function() {
        debugger
      }
    });
  },

  updateQuestion: function(question) {
    var data = {
      '[question][title]': question.title,
      '[question][content]': question.content,
      '[question][tag_names]': question.tags
    };
    $.ajax({
      method: 'PATCH',
      url: '/api/questions/' + question.id,
      data: data,
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

  updateAnswer: function(answer) {
    var data = {
      '[answer][content]': answer.content
    };
    $.ajax({
      method: 'PATCH',
      url: '/api/answers/' + answer.id,
      data: data,
      dataType: 'json',
      success: function(question) {
        QuestionActions.receiveAnswerUpdateOK(question);
        // var path = '/questions/' + question.id + '/answer/' + answer.id;
        // hashHistory.push(path);
      },
      error: function() {
        debugger
      }
    });
  },

  // POST and DELETE
  createUser: function(userInfo) {
    var data = {
      '[user][display_name]': userInfo.displayName,
      '[user][email]': userInfo.email,
      '[user][password]': userInfo.password,
    };
    $.ajax({
      method: 'POST',
      url: '/api/users',
      data: data,
      dataType: 'json',
      success: function(user) {
        CurrentUserActions.receiveCurrentUser(user);
        CurrentUserActions.toggleSignupModalOn();
      },
      error: function(obj) {
        CurrentUserActions.receiveCurrentUser(JSON.parse(obj.responseText));
      }
    });
  },
  createSession: function(userInfo) {
    var data = {
      '[user][email]': userInfo.email,
      '[user][password]': userInfo.password,
    };
    $.ajax({
      method: 'POST',
      url: '/api/session',
      data: data,
      dataType: 'json',
      success: function(user) {
        CurrentUserActions.receiveCurrentUser(user);
        CurrentUserActions.toggleSignupModalOn();
      },
      error: function(obj) {
        CurrentUserActions.receiveCurrentUser(JSON.parse(obj.responseText));
      }
    });
  },
  destroySession: function() {
    $.ajax({
      method: 'DELETE',
      url: '/api/session',
      success: CurrentUserActions.receiveCurrentUser,
      error: function() {
        debugger
      }
    });
  },
  createTag: function(tag) {
    var data = {
      '[tag][name]': tag.tagString,
      '[tag][description]': tag.newTagDescription,
    };
    $.ajax({
      method: 'POST',
      url: '/api/tags/',
      data: data,
      dataType: 'json',
      success: TagActions.receiveTag,
      error: function() {
        debugger
      }
    });
  },
  createVote: function(vote) {
    requireCurrentUser($.ajax.bind(null, {
      method: 'POST',
      url: '/api/votes',
      data: vote,
      dataType: 'json',
      success: QuestionActions.receiveQuestion,
      error: function() {
        debugger
      }
    }));
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
    requireCurrentUser($.ajax.bind(null, {
      method: 'POST',
      url: '/api/favorites',
      data: { 'favorite[question_id]': questionId },
      dataType: 'json',
      success: QuestionActions.receiveQuestion,
      error: function() {
        debugger
      }
    }));
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
    requireCurrentUser($.ajax.bind(null, {
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
    }));
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
    var data = {
      '[question][title]': question.title,
      '[question][content]': question.content,
      '[question][tag_names]': question.tags
    };
    requireCurrentUser($.ajax.bind(null, {
      method: 'POST',
      url: 'api/questions',
      data: data,
      dataType: 'json',
      success: function(question) {
        QuestionActions.receiveQuestion(question);
        hashHistory.push('/questions/' + question.id);
      },
      error: function() {
        debugger
      }
    }));
  },
  createAnswer: function(answer, callback) {
    requireCurrentUser($.ajax.bind(null, {
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
    }));
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
