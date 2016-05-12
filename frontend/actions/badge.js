var AppDispatcher = require('../dispatcher/dispatcher');
var BadgeConstants = require('../constants/badge');

module.exports = {
  receiveBadges: function(badges) {
    AppDispatcher.dispatch({
      action: badges,
      actionType: BadgeConstants.RECEIVE_BADGES
    });
  },
  receiveBadge: function(badge) {
    AppDispatcher.dispatch({
      action: badge,
      actionType: BadgeConstants.RECEIVE_BADGE
    });
  },
  resetBadgesSelect: function(select) {
    AppDispatcher.dispatch({
      action: select,
      actionType: BadgeConstants.RESET_BADGES_SELECT
    });
  }
};
