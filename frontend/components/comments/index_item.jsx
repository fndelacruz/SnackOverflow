var React = require('react');

var CommentsIndexItem = React.createClass({
  render: function() {
    var comment = this.props.comment;
    return (
      <div className='comment-index-item-container'>
        <span>{comment.content}</span>
        <span>{' – ' + comment.user.display_name}</span>
        <span>{' ' + comment.created_at_words}</span>
        <span>{' vote_count: ' + comment.vote_count}</span>
      </div>
    );
  }
});

module.exports = CommentsIndexItem;
