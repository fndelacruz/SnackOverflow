var Store = require('flux/utils').Store;
var AppDispatcher = require('../dispatcher/dispatcher');
var BadgeConstants = require('../constants/badge');

var _badges;
var _select = 'all';

var BadgeStore = new Store(AppDispatcher);

function resetBadges(badges) {
  _badges = {};
  badges.forEach(function(badge) {
    _badges[badge.id] = badge;
  });
}

function resetBadgeSelect(select) {
  _select = select;
}

BadgeStore.all = function() {
  if (_badges) {
    var badges = { Tag: {} };
    Object.keys(_badges).forEach(function(badgeId) {
      var badge = _badges[badgeId];
      var category = badge.category;
      var subcategory = badge.subcategory;

      if (category !== 'Tag') {
        if (typeof badges[category] === 'undefined') {
          badges[category] = {};
        }

        if (typeof badges[category][subcategory] === 'undefined') {
          badges[category][subcategory] = [];
        }

        badges[category][subcategory].push(badge);
      } else {
        if (typeof badges.Tag[subcategory] === 'undefined') {
          badges.Tag[subcategory] = [];
        }
        badges.Tag[subcategory].push(badge);
      }
    });

    return badges;
  }
};

BadgeStore.getSelect = function () {
  return _select;
};

BadgeStore.__onDispatch = function(payload) {
  switch (payload.actionType) {
    case BadgeConstants.RECEIVE_BADGES:
      resetBadges(payload.action);
      break;
    case BadgeConstants.RESET_BADGES_SELECT:
      resetBadgeSelect(payload.action);
      break;
  }
  this.__emitChange();
};

module.exports = BadgeStore;
