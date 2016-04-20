var React = require('react');
var QuestionStore = require('../../stores/question');
var ApiUtil = require('../../util/api_util');
var QuestionIndexItem = require('./index_item');
var SmallSortNav = require('../shared/small_sort_nav');
var QuestionActions = require('../../actions/question');

var _callbackId;

var QUESTION_SORT_TYPES =
  ['newest', 'featured', 'frequent', 'votes', 'active', 'views'];

var QuestionsIndex = React.createClass({
  getInitialState: function() {
    return {
      questions: QuestionStore.allQuestions(),
      sortBy: QuestionStore.getQuestionSortBy()
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
      questions: QuestionStore.allQuestions(),
      sortBy: QuestionStore.getQuestionSortBy()
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
      return (
        <QuestionIndexItem {...question} key={'question-' + question.id} />
      );
    });
    return (
      <div>
        <div className='content-double-main'>
          <SmallSortNav
            links={QUESTION_SORT_TYPES}
            active={this.state.sortBy}
            header='All Questions'
            handleSortChange={this.handleSortChange}/>
          <div>
            {QuestionIndexItems}
          </div>
        </div>
        <div className='content-double-sidebar'>
          <div className='sidebar-quantity'>
            {this.state.questions.length}
          </div>
          <div className='sidebar-label'>
            questions
          </div>
        </div>
      </div>
    );
  }
});

module.exports = QuestionsIndex;
