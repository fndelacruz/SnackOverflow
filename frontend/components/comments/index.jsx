var React = require('react');
var CommentsIndexItem = require('./index_item');

var CommentsIndex = React.createClass({
  render: function() {
    if (!this.props.comments) {
      return (<div />);
    }

    var comments = this.props.comments.map(function(comment) {
      return (
        <CommentsIndexItem
          key={'comment-' + comment.id}
          handleVote={this.props.handleVote}
          comment={comment}/>
      );
    }.bind(this));

    return (
      <div className='comments-index-container'>
        {comments}
      </div>
    );
  }
});

module.exports = CommentsIndex;
