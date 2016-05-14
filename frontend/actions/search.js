var SearchConstants = require('../constants/search');
var AppDispatcher = require('../dispatcher/dispatcher');

module.exports = {
  receivePosts: function (posts) {
    AppDispatcher.dispatch({
      action: posts,
      actionType: SearchConstants.RECEIVED_SEARCH
    });
  },
  changeSortBy: function(sortBy) {
    AppDispatcher.dispatch({
      action: sortBy,
      actionType: SearchConstants.CHANGE_SORT_BY
    });
  }
};
