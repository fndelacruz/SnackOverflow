var React = require('react');
var QuestionStore = require('../../stores/question');
var ApiUtil = require('../../util/api_util');
var QuestionIndexItem = require('./index_item');

var _callbackId;

module.exports = React.createClass({
  getInitialState: function() {
    return { questions: QuestionStore.all() };
  },
  componentDidMount: function() {
    _callbackId = QuestionStore.addListener(this.onChange);
    ApiUtil.fetchQuestions();
  },
  componentWillUnmount: function() {
    _callbackId.remove();
  },
  onChange: function() {
    this.setState({ questions: QuestionStore.all() });
  },
  render: function() {
    if (!this.state.questions.length) {
      return (<div>no questions here!</div>);
    }
    var QuestionIndexItems = this.state.questions.map(function(question) {
      return <QuestionIndexItem {...question} key={'question-' + question.id} />;
    });
    return (
      <div className='main-content'>
        <div>QuestionsIndexNavPlaceholder</div>
        <ul>
          {QuestionIndexItems}
        </ul>
      </div>
    );
  }
});
