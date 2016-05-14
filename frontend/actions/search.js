var SearchConstants = require('../constants/search');
var AppDispatcher = require('../dispatcher/dispatcher');

module.exports = {
  receivePosts: function (posts) {
    AppDispatcher.dispatch({
      action: posts,
      actionType: SearchConstants.RECEIVED_SEARCH
    });
  }
};
