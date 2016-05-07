var React = require('react');
var ApiUtil = require('../../util/api_util');
var QuestionStore = require('../../stores/question');

var _callbackId;

var AnswersEdit = React.createClass({
  getInitialState: function() {
    return {
      content: this.props.content,
      isSubmitting: false,
      submissionStatus: null
    };
  },
  componentDidMount: function() {
    _callbackId = QuestionStore.addListener(this.onChange);
  },
  componentWillUnmount: function() {
    _callbackId.remove();
  },
  onChange: function() {
    var submissionStatus = QuestionStore.getAnswerSubmissionStatus;
    if (submissionStatus) {
      this.props.cancelAnswerEdit();
    } else {
      this.setState({
        isSubmitting: false,
        submissionStatus: QuestionStore.getAnswerSubmissionStatus
      });
    }
  },
  handleChange: function(e) {
    this.setState({ content: e.currentTarget.value });
  },
  handleSubmit: function() {
    if (this.state.content.length) {
      this.setState({ isSubmitting: true });
      ApiUtil.updateAnswer(
        $.extend({}, { id: this.props.id }, this.state)
      );
    }
  },
  render: function() {
    var buttonClass, buttonTitle, textAreaClass, textAreaContainerClass;
    if (!this.state.content.length) {
      buttonClass = ' button-disabled';
      buttonTitle = "Answer content is required.";
      textAreaContainerClass = 'text-area-no-content-warning';
      textAreaClass = 'answer-edit-title-required';
    }
    return (
      <div className='answer-edit-container'>
        <div className={textAreaContainerClass}>
          <textarea
            className={textAreaClass}
            value={this.state.content}
            onChange={this.handleChange} />
        </div>
        <button
          title={buttonTitle}
          className={buttonClass}
          onClick={this.handleSubmit}>
          Update Answer
        </button>
        <span onClick={this.props.cancelAnswerEdit} className='tool-link'>
          cancel edit
        </span>
      </div>
    );
  }
});

module.exports = AnswersEdit;
