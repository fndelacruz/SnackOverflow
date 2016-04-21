var AppDispatcher = require('../dispatcher/dispatcher');
var TagConstants = require('../constants/tag');

module.exports = {
  receiveTags: function(tags) {
    AppDispatcher.dispatch({
      action: tags,
      actionType: TagConstants.RECEIVE_TAGS
    });
  },
  changeTagSort: function(sortBy) {
    AppDispatcher.dispatch({
      action: sortBy,
      actionType: TagConstants.CHANGE_TAG_SORT
    });
  },
  changeTagSearchTerm: function(searchTerm) {
    AppDispatcher.dispatch({
      action: searchTerm,
      actionType: TagConstants.CHANGE_TAG_SEARCH_TERM
    });
  }
};
