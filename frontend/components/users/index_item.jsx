var React = require('react');
var UserLinkStub = require('./link_stub');
var hashHistory = require('react-router').hashHistory;
var TagLinkIndex = require('../tags/tag_link_index');

function handleAnswerTagsComma(idx) {
  if (idx !== 0) {
    return (<span>, </span>);
  }
}

var UsersIndexItem = React.createClass({
  handleUserClick: function() {
    var path = '/users/' + this.props.user.id;
    hashHistory.push(path);
  },
  handleTagList: function() {
    var tags = this.props.user.tags;
    if (tags) {
      return (
        <TagLinkIndex
          userId={this.props.user.id}
          tags={tags} />
      );
    }
  },
  render: function() {
    var user = this.props.user, userLocation, footer, prefooter;
    if (user.location) {
      userLocation = (<div className='user-location'>{user.location}</div>);
    }
    switch (this.props.sortBy) {
      case 'reputation':
        prefooter = (
          <div className='users-index-item-reputation'>
            {user.reputation}
          </div>
        );
        footer = this.handleTagList();
        break;
      case 'new users':
        // TODO: pre-footer should be created_at_words (actually, score in past days...)
        prefooter = (<div>{'joined ' + user.created_at.toLocaleString()}</div>);
        footer = this.handleTagList();
        break;
      case 'voters':
        var voteWord = user.vote_count === 1 ? 'vote' : 'votes';
        prefooter = (
          <div className='users-index-item-reputation'>
            {user.reputation}
          </div>
        );
        footer = user.vote_count + ' ' + voteWord;
        break;
    }
    return (
      <div className='users-index-item'>
        <div className='users-index-item-non-tag-container group'>
          <div
            onClick={this.handleUserClick}
            className='users-index-item-user-pic' />
          <div className='link-container'>
            <UserLinkStub {...user} />
          </div>
          <div className='user-location'>{userLocation}</div>
          {prefooter}
        </div>
        <div className='users-index-item-footer'>
          {footer}
        </div>
      </div>
    );
  }
});

module.exports = UsersIndexItem;
