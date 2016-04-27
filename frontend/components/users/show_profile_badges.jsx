var React = require('react');

var ShowProfileBadges = React.createClass({
  render: function() {
    return (
      <div
        className='user-show-profile-badges'
        id='user-show-profile-left-container'>
        <div className='user-show-profile-main-header'>
          <span className='user-show-profile-main-header-label'>
            {'Badges '}
          </span>
          <span className='user-show-profile-main-header-count'>
            {'(' + this.props.badgings.length + ')'}
          </span>
        </div>
        badges placeholder
      </div>
    );
  }
});

module.exports = ShowProfileBadges;
