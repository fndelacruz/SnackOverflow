var React = require('react');
var UserLinkStub = require('./link_stub');
var hashHistory = require('react-router').hashHistory;

var UsersIndexItem = React.createClass({
  handleUserClick: function() {
    var path = '/users/' + this.props.user.id;
    hashHistory.push(path);
  },
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
          <div
            onClick={this.handleUserClick}
            className='users-index-item-user-pic' />
          <div className='user-display-name-link'>
            <UserLinkStub {...user} />
          </div>
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
