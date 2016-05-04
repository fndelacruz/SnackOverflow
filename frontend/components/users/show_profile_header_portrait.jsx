var React = require('react');

var ShowProfileHeaderPortrait = React.createClass({
  renderBadge: function(rank, value) {
    var className = 'portrait-badge portrait-badge-' + rank;
    var badgeName = value === 1 ? 'badge' : 'badges';
    if (value) {
      return (
        <div
          title={value + ' ' + rank + ' ' + badgeName}
          key={'badge-group-' + rank}
          className={className}>{value}
        </div>
      );
    }
  },
  renderBadges: function() {
    var badges = { bronze: 0, silver: 0, gold: 0};
    this.props.badges.forEach(function(badge) {
      switch (badge.rank) {
        case 'bronze':
          badges.bronze += badge.count;
          break;
        case 'silver':
          badges.silver += badge.count;
          break;
        case 'gold':
          badges.gold += badge.count;
          break;
      }
    });

    return (
      <div className='user-show-profile-header-portrait-badges-container'>
        {Object.keys(badges).map(function(rank) {
          return this.renderBadge(rank, badges[rank]);
        }.bind(this))}
      </div>
    );
  },
  render: function() {
    return (
      <div className='user-show-profile-header-portrait-container'>
        <div className='user-show-profile-header-portrait-content'>
          <img
            className=''
            src={'https://robohash.org/' + this.props.id + '?bgset=any'}
            alt='user-pic' />
          <div className='user-show-profile-header-portrait-reputation-container'>
            <span className='user-show-profile-header-portrait-reputation-number'>
              {this.props.reputation + ' '}
            </span>
            <span className='user-show-profile-header-portrait-reputation-label'>
              REPUTATION
            </span>
          </div>
          {this.renderBadges()}
        </div>
      </div>
    );
  }
});

module.exports = ShowProfileHeaderPortrait;
