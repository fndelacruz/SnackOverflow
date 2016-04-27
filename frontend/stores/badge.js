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
    var badges = [];
    Object.keys(_badges).forEach(function(badgeId) {
      badges.push(_badges[badgeId]);
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
