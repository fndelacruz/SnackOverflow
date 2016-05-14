var Store = require('flux/utils').Store;
var AppDispatcher = require('../dispatcher/dispatcher');
var SearchStore = new Store(AppDispatcher);
var SearchConstants = require('../constants/search');

var _posts;
var _sortBy = 'relevance';

function changeSortBy(sortBy) {
  if (_sortBy !== sortBy) {
    // TODO: SORT POSTS HERE if _sortBy != sortBy
    _sortBy = sortBy;
    this.__emitChange();
  }
}

function resetPosts(posts) {
  _posts = posts;
}

SearchStore.all = function() {
  return _posts.slice();
};

SearchStore.getSortBy = function() {
  return _sortBy;
};

SearchStore.__onDispatch = function(payload) {
  switch (payload.actionType) {
    case SearchConstants.RECEIVED_SEARCH:
      resetPosts(payload.action);
      this.__emitChange();
      break;
    case SearchConstants.CHANGE_SORT_BY:
      changeSortBy(payload.action);
      break;
  }
};

module.exports = SearchStore;
