var React = require('react');
var Util = require('../../util/util');
var BadgeStub = require('../badges/stub');

var ShowProfileBadges = React.createClass({
  renderBadgeRanks: function() {
    var badgings = {
      gold: [],
      silver: [],
      bronze: [],
    };

    this.props.badgings.forEach(function(badging) {
      badgings[badging.badge.rank].push(badging);
    });

    Object.keys(badgings).forEach(function(rank) {
      Util.sortBy(badgings[rank], 'created_at', true);
    });

    return Object.keys(badgings).map(function(rank) {
      Util.sortBy(badgings[rank], 'created_at', true);
      var className = 'user-show-profile-badges-element-header badge-header-' + rank;

      if (badgings[rank].length) {
        return (
          <div
            key={'badges-' + rank}
            className='user-show-profile-badges-element-container'>
            <div className={className}>
              <div className='user-show-profile-badges-element-header-label'>
                {rank.toUpperCase()}
              </div>
              <div className='user-show-profile-badges-element-header-value'>
                {badgings[rank].length}
              </div>
            </div>

            <div className='user-show-profile-badges-element-main'>
              <div className='user-show-profile-badges-element-main-header'>
                Recent
              </div>
              <div className='user-show-profile-badges-element-main-badges-container'>
                {badgings[rank].slice(0, 3).map(function(badging) {
                  return (
                    <div
                      className='user-show-profile-badges-element-main-badges-element group'
                      key={'badging-' + badging.id}>
                      <BadgeStub badge={badging.badge} />
                      <div className='user-show-profile-badges-element-main-badges-element-created-date'>
                        {badging.created_at.toLocaleDateString()}
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
    return (
      <div
        className='user-show-profile-badges'
        id='user-show-profile-left-container'>
        <div className='user-show-common-header'>
          <span className='user-show-common-header-label'>
            Badges
          </span>
          <span className='user-show-common-header-count'>
            {this.props.badgings.length}
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
