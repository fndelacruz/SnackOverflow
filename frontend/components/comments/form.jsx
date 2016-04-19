var React = require('react');
var ApiUtil = require('../../util/api_util');

var CommentsForm = React.createClass({
  getInitialState: function() {
    return { content: '', hidden: true };
  },
  handleSubmit: function() {
    if (this.state.content.length) {
      // alert('TODO handleSubmit comment');
      ApiUtil.createComment({
        'comment[commentable_type]': this.props.type,
        'comment[commentable_id]': this.props.id,
        'comment[content]': this.state.content
      }, this.resetCommentForm);
    }
  },
  resetCommentForm: function() {
    this.setState({ content: '', hidden: true });
  },
  toggleCommentFormDisplay: function() {
    if (this.state.hidden) {
      this.setState({ hidden: false });
      setTimeout(function() {
        var textareas = document.getElementsByClassName('comments-form-content');
        textareas[0].focus();
      },0);
    } else {
      this.setState({ hidden: true });
    }
  },
  handleChange: function(e) {
    this.setState({ content: e.currentTarget.value });
  },
  render: function() {
    var buttonClass = 'comments-form-submit';
    var submissionContainerClass = 'comments-form-submission-container';
    if (!this.state.content.length) {
      buttonClass += ' button-disabled';
    }
    if (this.state.hidden) {
      submissionContainerClass += ' hidden';
    }
    return (
      <div className='comments-form-container'>
        <div className='comments-form-display-toggle-container'>
          <span
            onClick={this.toggleCommentFormDisplay}
            className='comments-form-display-toggle'>
            add a comment
          </span>
        </div>
        <div className={submissionContainerClass}>
          <textarea
            value={this.state.content}
            onChange={this.handleChange}
            className='comments-form-content' />
          <button
            onClick={this.handleSubmit}
            className={buttonClass}>
          Post
          </button>
        </div>
      </div>
    );
  }
});

module.exports = CommentsForm;
