var React = require('react');
var QuestionStore = require('../../stores/question');
var ApiUtil = require('../../util/api_util');

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
      return (
        <li
          className='question-index-item'
          key={'question-' + question.id}>
          <ul>
            <li>asked by: {question.user.display_name}</li>
            <li>title: {question.title}</li>
            <li>content: {question.content}</li>
            <li>votes: {question.vote_count}</li>
            <li>answers: {question.answer_count}</li>
            <li>views: {question.view_count}</li>
            <li>
              tags
              <ul>
              {question.tags.map(function(tag) {
                return (
                  <ul key={'question-' + question.id + '-tag-' + tag.id}>
                    <li>{tag.id}</li>
                    <li>{tag.name}</li>
                  </ul>
                );
              })}
              </ul>
            </li>
          </ul>
        </li>
      );
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
