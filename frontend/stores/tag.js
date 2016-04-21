var AppDispatcher = require('../dispatcher/dispatcher');
var Store = require('flux/utils').Store;
var TagConstants = require('../constants/tag');
var Util = require('../util/util');

var TagStore = new Store(AppDispatcher);

// NOTE: Using an array instead of an object for _tags because I don't think I
// need to store by id
var _tags = [];
var _sortBy = 'popular';

function resetTags(tags) {
  _tags = tags;
}

function resetTagSort(sortBy) {
  _sortBy = sortBy;
}

TagStore.all = function() {
  switch (_sortBy) {
    case 'popular':
      Util.sortBy(_tags, 'question_count', true);
      break;
    case 'name':
      Util.sortBy(_tags, 'name');
      break;
    case 'new':
      Util.sortBy(_tags, 'created_at');
      break;
  }
  return _tags.slice();
};

TagStore.getSortBy = function() {
  return _sortBy;
};

TagStore.__onDispatch = function(payload) {
  switch (payload.actionType) {
    case TagConstants.RECEIVE_TAGS:
      resetTags(payload.action);
      break;
    case TagConstants.CHANGE_TAG_SORT:
      resetTagSort(payload.action);
      break;
  }
  this.__emitChange();
};

module.exports = TagStore;
