var React = require('react');
var Util = require('../../util/util');
var BadgeStub = require('../badges/stub');

var ShowProfileBadges = React.createClass({
  renderBadgeRanks: function() {
    var badges = {
      gold: [],
      silver: [],
      bronze: [],
    };

    var badgeCounts = {
      gold: 0,
      silver: 0,
      bronze: 0
    };

    this.props.badges.forEach(function(badge) {
      badges[badge.rank].push(badge);
      badgeCounts[badge.rank] += badge.count;
    });

    return Object.keys(badges).map(function(rank) {
      Util.sortBy(badges[rank], 'created_at', true);
      var className = 'user-show-profile-badges-element-header badge-header-' + rank;

      if (badges[rank].length) {
        return (
          <div
            key={'badges-' + rank}
            className='user-show-profile-badges-element-container'>
            <div className={className}>
              <div className='user-show-profile-badges-element-header-label'>
                {rank.toUpperCase()}
              </div>
              <div className='user-show-profile-badges-element-header-value'>
                {badgeCounts[rank]}
              </div>
            </div>

            <div className='user-show-profile-badges-element-main'>
              <div className='user-show-profile-badges-element-main-header'>
                Recent
              </div>
              <div className='user-show-profile-badges-element-main-badges-container'>
                {badges[rank].slice(0, 3).map(function(badge) {
                  return (
                    <div
                      className='user-show-profile-badges-element-main-badges-element group'
                      key={'badge-' + badge.id}>
                      <BadgeStub badge={badge} />
                      <div className='user-show-profile-badges-element-main-badges-element-created-date'>
                        {badge.created_at.toLocaleDateString()}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      }
    });
  },
  render: function() {
    var badgeCount = 0;
    for (var badge in this.props.badges) {
      badgeCount += this.props.badges[badge].count;
    }
    return (
      <div
        className='user-show-profile-badges'
        id='user-show-profile-left-container'>
        <div className='user-show-common-header'>
          <span className='user-show-common-header-label'>
            Badges
          </span>
          <span className='user-show-common-header-count'>
            {badgeCount}
          </span>
        </div>
        <div className='user-show-profile-badges-element-container-container'>
          {this.renderBadgeRanks()}
        </div>
        <div className='user-show-profile-main-footer'>
          <span
            onClick={this.props.handleViewMoreClick.bind(null, 'badges')}
            className='link'>
            View all badges →
          </span>
        </div>
      </div>
    );
  }
});

module.exports = ShowProfileBadges;
