var AppDispatcher = require('../dispatcher/dispatcher');
var TagConstants = require('../constants/tag');

module.exports = {
  receiveTags: function(tags) {
    AppDispatcher.dispatch({
      action: tags,
      actionType: TagConstants.RECEIVE_TAGS
    });
  },
  receiveTag: function(tag) {
    AppDispatcher.dispatch({
      action: tag,
      actionType: TagConstants.RECEIVE_TAG
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
  },
  resetTagStoreSettings: function() {
    AppDispatcher.dispatch({
      actionType: TagConstants.RESET_TAG_STORE_SETTINGS
    });
  }
};
