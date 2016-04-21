var React = require('react');
var QuestionStore = require('../../stores/question');
var ApiUtil = require('../../util/api_util');
var QuestionIndexItem = require('./index_item');
var SortNav = require('../shared/sort_nav');
var QuestionActions = require('../../actions/question');

var _callbackId;

var QUESTION_SORT_TYPES =
  ['newest', 'featured', 'frequent', 'votes', 'active', 'views'];

var QuestionsIndex = React.createClass({
  getInitialState: function() {
    return {
      questions: QuestionStore.allQuestions(),
      sortBy: QuestionStore.getQuestionSortBy(),
      tag: ''
    };
  },
  componentDidMount: function() {
    _callbackId = QuestionStore.addListener(this.onChange);
    if (this.props.params.tagName) {
      QuestionActions.setTag(this.props.params.tagName);
    }
    ApiUtil.fetchQuestions();
  },
  componentWillReceiveProps:function(newProps) {
    // may receive tagName as this.props.params. handle if so
    QuestionActions.setTag(newProps.params.tagName);
  },
  componentWillUnmount: function() {
    QuestionActions.setTag('');
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
    var SortNavHeader = 'Questions', sidebarLabel = 'questions';
    if (this.props.params.tagName) {
      SortNavHeader = 'Tagged ' + SortNavHeader;
      sidebarLabel = 'tagged ' + sidebarLabel;
    }

    return (
      <div>
        <div className='content-double-main'>
          <SortNav
            links={QUESTION_SORT_TYPES}
            active={this.state.sortBy}
            header={SortNavHeader}
            handleSortChange={this.handleSortChange}/>
          <div>

          </div>
          <div>
            {QuestionIndexItems}
          </div>
        </div>
        <div className='content-double-sidebar'>
          <div className='sidebar-quantity'>
            {this.state.questions.length}
          </div>
          <div className='sidebar-label'>
            {sidebarLabel}
          </div>
        </div>
      </div>
    );
  }
});

module.exports = QuestionsIndex;
