var React = require('react');
var ApiUtil = require('../../util/api_util');

var AnswersNew = React.createClass({
  getInitialState: function() {
    return { content: '' };
  },
  handleChange: function(e) {
    this.setState ({ content: e.currentTarget.value });
  },
  handleSubmit: function() {
    if (this.state.content.length) {
      ApiUtil.createAnswer({
        'answer[content]': this.state.content,
        'answer[question_id]': this.props.questionId
      });
    }
  },

  render: function() {
    var buttonClass;
    if (!this.state.content.length) {
      buttonClass = 'button-disabled';
    }
    return (
      <div className='item-new-double-main'>
        <div className='answer-new-header'>
          Your Answer
        </div>
        <textarea
          value={this.state.content}
          onChange={this.handleChange}
          className='item-content-input' />
        <button
          className={buttonClass}
          onClick={this.handleSubmit}>
          Post Answer
        </button>
      </div>
    );
  }
});

module.exports = AnswersNew;
