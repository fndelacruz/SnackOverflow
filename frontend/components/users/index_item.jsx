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
    var answer_tags_sorted = this.props.user.answer_tags_sorted;
    if (answer_tags_sorted) {
      return (
        <TagLinkIndex
          userId={this.props.user.id}
          tags={answer_tags_sorted} />
      );
      return (
        <div>
          {answer_tags_sorted.map(function(tag, idx) {
            var path = '/questions/tagged/' + tag[0].name;
            return (
              <span key={'user-' + this.props.user.id + '-tag-' + tag[0].id}>
                {handleAnswerTagsComma(idx)}
                <span onClick={hashHistory.push.bind(null, path)} >
                  {tag[0].name}
                </span>
              </span>
            );
          }.bind(this))}
        </div>
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
        // footer should be tag list
        // pre-footer should be created_at_words (actually, score in past days...)
        prefooter = (<div>{'joined ' + user.created_at.toLocaleString()}</div>);
        footer = this.handleTagList();
        break;
      case 'voters':
        prefooter = (
          <div className='users-index-item-reputation'>
            {user.reputation}
          </div>
        );
        footer = user.vote_count + ' votes';
        break;
    }
    return (
      <div className='users-index-item'>
        <div className='users-index-item-non-tag-container group'>
          <div
            onClick={this.handleUserClick}
            className='users-index-item-user-pic' />
          <div className='user-display-name-link-container'>
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
