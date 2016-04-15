var React = require('react');
var QuestionStore = require('../../stores/question');
var ApiUtil = require('../../util/api_util');
var QuestionIndexItem = require('./index_item');
var QuestionNav = require('./nav');
var QuestionActions = require('../../actions/question');

var _callbackId;

var SORT_TYPES = ['newest', 'featured', 'frequent', 'votes', 'active', 'views'];
var defaultSortType = SORT_TYPES[0];

var QuestionsIndex = React.createClass({
  getInitialState: function() {
    return {
      questions: QuestionStore.all(),
      sortBy: QuestionStore.getSortBy()
    };
  },
  componentDidMount: function() {
    _callbackId = QuestionStore.addListener(this.onChange);
    ApiUtil.fetchQuestions();
  },
  componentWillUnmount: function() {
    _callbackId.remove();
  },
  onChange: function() {
    this.setState({
      questions: QuestionStore.all(),
      sortBy: QuestionStore.getSortBy()
    });
  },
  handleSortChange: function(sortBy) {
    if (sortBy !== this.state.sortBy) {
      QuestionActions.changeQuestionSort(sortBy);
    }
  },
  render: function() {
    if (!this.state.questions.length) {
      return (<div></div>);
    }
    var QuestionIndexItems = this.state.questions.map(function(question) {
      return <QuestionIndexItem {...question} key={'question-' + question.id} />;
    });
    return (
      <div>
        <QuestionNav
          links={SORT_TYPES}
          active={this.state.sortBy}
          handleSortChange={this.handleSortChange}/>
        <div>
          {QuestionIndexItems}
        </div>
      </div>
    );
  }
});

module.exports = QuestionsIndex;
