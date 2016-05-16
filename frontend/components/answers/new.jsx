var React = require('react');
var ApiUtil = require('../../util/api_util');

function renderHeader(userAnswered, hidden) {
  var onClick, string, className = 'no-highlight';
  if (userAnswered) {
    onClick = this.toggleDisplay;
    string = 'Give Another Answer?';
    className += ' question-new-toggle-hidden';
  } else {
    string = 'Your Answer';
  }
  return (<span onClick={onClick} className={className}>{string}</span>);
}

var AnswersNew = React.createClass({
  getInitialState: function() {
    return { content: '', hidden: true };
  },
  handleChange: function(e) {
    this.setState ({ content: e.currentTarget.value });
  },
  handleSubmit: function() {
    if (this.state.content.length) {
      ApiUtil.createAnswer({
        'answer[content]': this.state.content,
        'answer[question_id]': this.props.question.id
      }, this.resetState);
    }
  },
  toggleDisplay: function() {
    if (this.state.hidden) {
      this.setState({ hidden: false });
    } else {
      this.setState({ hidden: true });
    }
  },
  resetState: function() {
    this.setState({ content: '', hidden: true });
  },
  render: function() {
    var buttonClass = '', textAreaClass=' item-content-input';
    if (!this.state.content.length) {
      buttonClass += ' button-disabled';
    }
    if (this.state.hidden && this.props.question.user_answered) {
      buttonClass += ' absent';
      textAreaClass += ' absent';

    } else if (!this.state.hidden && this.props.question.user_answered) {
      setTimeout(function() {
        var answerNewInput = document.getElementById('answer-new-input');
        answerNewInput.scrollIntoView();
        answerNewInput.focus();
      }, 0);
    }
    return (
      <div className='answer-new-main'>
        <div className='answer-new-header'>
          {renderHeader.call(
            this, this.props.question.user_answered, this.state.hidden
          )}
        </div>
        <textarea
          id='answer-new-input'
          value={this.state.content}
          onChange={this.handleChange}
          className={textAreaClass} />
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
