var React = require('react');
var ApiUtil = require('../../util/api_util');
var UserLinkStub = require('../users/link_stub');

function commentVoteClass(userVote, type) {
  var className;
  switch (type) {
    case 'upArrow':
      className = 'comment-arrow comment-arrow-up';
      if (userVote && userVote.value === 1) {
        className += ' comment-arrow-up-active';
      }
      break;
    case 'downArrow':
      className = 'comment-arrow comment-arrow-down';
      if (userVote && userVote.value === -1) {
        className += ' comment-arrow-down-active';
      }
      break;
    case 'score':
      className = 'comment-vote-count';
      if (userVote) {
        className += ' comment-vote-count-active';
      }
      break;
  }
  return className;
}

var CommentsIndexItem = React.createClass({
  handleDeleteComment: function() {
    ApiUtil.destroyComment(this.props.comment.id);
  },
  render: function() {
    var comment = this.props.comment;
    var commentDelete = !comment.owned ? null :
      <span
        onClick={this.handleDeleteComment}
        className='comment-index-item-delete'>
        delete comment
      </span>;
    return (
      <div className='comment-index-item-container group'>
        <div className='comment-index-item-vote-container'>
          <div className={commentVoteClass(comment.user_vote, 'score')}>
            {comment.vote_count === 0 ? '' : comment.vote_count}
          </div>
          <div className='comment-index-item-vote-arrows-container'>
            <div
              onClick={this.props.handleVote.bind(null, 'Comment', comment.id, 1, comment.user_vote)}
              className={commentVoteClass(comment.user_vote, 'upArrow')} />
            <div
              onClick={this.props.handleVote.bind(null, 'Comment', comment.id, -1, comment.user_vote)}
              className={commentVoteClass(comment.user_vote, 'downArrow')} />
          </div>
        </div>
        <div className='comment-index-item-main'>
          <span>{comment.content + ' - '}</span>
          <UserLinkStub {...comment.user} />
          <span>{' ' + comment.created_at_words + ' '}</span>
          {commentDelete}
        </div>
      </div>
    );
  }
});

module.exports = CommentsIndexItem;
