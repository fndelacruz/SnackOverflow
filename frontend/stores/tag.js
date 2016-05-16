var AppDispatcher = require('../dispatcher/dispatcher');
var Store = require('flux/utils').Store;
var TagConstants = require('../constants/tag');
var Util = require('../util/util');

var TagStore = new Store(AppDispatcher);

// NOTE: Using an array instead of an object for _tags because I don't think I
// need to store by id
var DEFAULT_SORT_BY = 'popular';

var _tags = [];
var _sortBy = DEFAULT_SORT_BY;
var _searchTerm = '';
var _indexLoaded;

function addTag(tag) {
  _tags.push(tag);
}

function resetTags(tags) {
  Util.sortBy(tags, 'question_count', true, 'id');
  _indexLoaded = true;
  _tags = tags;
}

function resetTagSort(sortBy) {
  _sortBy = sortBy;
}

function resetTagSearchTerm(searchTerm) {
  _searchTerm = searchTerm;
}

TagStore.getIndexLoaded = function() {
  return _indexLoaded;
};

TagStore.all = function() {
  switch (_sortBy) {
    case 'popular':
      Util.sortBy(_tags, 'question_count', true, 'id');
      break;
    case 'name':
      Util.sortBy(_tags, 'name');
      break;
  }
  if (_searchTerm.length) {
    return _tags.filter(function(tag) {
      return tag.name.search(_searchTerm) !== -1;
    }).slice();
  } else {
    return _tags.slice();
  }
};

TagStore.getSortBy = function() {
  return _sortBy;
};

TagStore.__onDispatch = function(payload) {
  switch (payload.actionType) {
    case TagConstants.RECEIVE_TAGS:
      resetTags(payload.action);
      break;
    case TagConstants.RECEIVE_TAG:
      addTag(payload.action);
      break;
    case TagConstants.CHANGE_TAG_SORT:
      resetTagSort(payload.action);
      break;
    case TagConstants.CHANGE_TAG_SEARCH_TERM:
      resetTagSearchTerm(payload.action);
      break;
    case TagConstants.RESET_TAG_STORE_SETTINGS:
      resetTagSearchTerm('');
      resetTagSort(DEFAULT_SORT_BY);
      break;
  }
  this.__emitChange();
};

module.exports = TagStore;
