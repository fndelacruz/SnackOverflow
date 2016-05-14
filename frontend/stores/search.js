var Store = require('flux/utils').Store;
var AppDispatcher = require('../dispatcher/dispatcher');
var SearchStore = new Store(AppDispatcher);
var SearchConstants = require('../constants/search');
var Util = require('../util/util');

var _posts;
var _sortBy = 'relevance';
var _sorted = false;

function changeSortBy(sortBy) {
  if (_sortBy !== sortBy) {
    _sortBy = sortBy;
    _sorted = false;
    this.__emitChange();
  }
}

function resetPosts(posts) {
  posts.forEach(Util.formatDateHelper);
  _sorted = false;
  _posts = posts;
}

function sortPosts() {
  var primarySortBy;
  switch (_sortBy) {
    case 'relevance':
      primarySortBy = 'matches';
      break;
    case 'newest':
      primarySortBy = 'created_at';
      break;
    case 'votes':
      primarySortBy = 'vote_count';
      break;
  }
  Util.sortBy(_posts, primarySortBy, true, 'id');
}

SearchStore.all = function() {
  if (_sorted === false) {
    sortPosts();
    _sorted = true;
  }
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
      changeSortBy.call(this, payload.action);
      break;
  }
};

module.exports = SearchStore;
