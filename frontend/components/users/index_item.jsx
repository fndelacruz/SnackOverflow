var React = require('react');

var UsersIndexItem = React.createClass({
  render: function() {
    var user = this.props.user, userLocation;
    if (user.location) {
      userLocation = (<div className='user-location'>{user.location}</div>);
    }
    return (
      <div className='users-index-item'>
        <div className='users-index-item-non-tag-container group'>
          <div className='users-index-item-user-pic' />
          <div className='user-display-name-link'>{user.display_name}</div>
          <div className='user-location'>{userLocation}</div>
          <div className='users-index-item-reputation'>{user.reputation}</div>
        </div>
        <div className='users-index-item-tags'>
          tag1, tag2, tag3
        </div>
      </div>
    );
  }
});

module.exports = UsersIndexItem;
