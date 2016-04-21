var React = require('react');

var UsersIndexItem = React.createClass({
  render: function() {
    var user = this.props.user, userLocation, footer;
    if (user.location) {
      userLocation = (<div className='user-location'>{user.location}</div>);
    }
    switch (this.props.sortBy) {
      case 'reputation':
        footer = 'tag1, tag2, tag3';
        break;
      case 'new users':
        // footer should be tag list
        // pre-footer should be created_at_words
        footer = 'joined ' + user.created_at.toLocaleString();
        break;
      case 'voters':
        footer = user.vote_count + ' votes';
        break;
    }
    return (
      <div className='users-index-item'>
        <div className='users-index-item-non-tag-container group'>
          <div className='users-index-item-user-pic' />
          <div className='user-display-name-link'>{user.display_name}</div>
          <div className='user-location'>{userLocation}</div>
          <div className='users-index-item-reputation'>{user.reputation}</div>
        </div>
        <div className='users-index-item-footer'>
          {footer}
        </div>
      </div>
    );
  }
});

module.exports = UsersIndexItem;
