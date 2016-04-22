var React = require('react');
var QuestionStore = require('../../stores/question');
var ApiUtil = require('../../util/api_util');
var QuestionIndexItem = require('./index_item');
var SortNav = require('../shared/sort_nav');
var QuestionActions = require('../../actions/question');
var TagStub = require('../tags/stub');

var _callbackId;

var QUESTION_SORT_TYPES =
  ['newest', 'featured', 'frequent', 'votes', 'active', 'views'];

var QuestionsIndex = React.createClass({
  getInitialState: function() {
    return {
      questions: QuestionStore.allQuestions(),
      sortBy: QuestionStore.getQuestionSortBy(),
      tag: QuestionStore.getQuestionsTag()
    };
  },
  componentDidMount: function() {
    _callbackId = QuestionStore.addListener(this.onChange);
    console.log('componentDidMount', this.props.params.tagName);
    ApiUtil.fetchQuestionsTag(this.props.params.tagName);
    ApiUtil.fetchQuestions();
  },
  componentWillReceiveProps: function(newProps) {
    ApiUtil.fetchQuestionsTag(newProps.params.tagName);
  },
  componentWillUnmount: function() {
    _callbackId.remove();
  },
  onChange: function() {
    this.setState({
      questions: QuestionStore.allQuestions(),
      sortBy: QuestionStore.getQuestionSortBy(),
      tag: QuestionStore.getQuestionsTag()
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

    var sortNavHeader = 'Questions', sidebarLabel = 'questions', sidebarTag;
    if (this.props.params.tagName) {
      sortNavHeader = 'Tagged ' + sortNavHeader;
      sidebarLabel = 'tagged ' + sidebarLabel;
      sidebarTag = <TagStub tagName={this.props.params.tagName} />;
    }

    var tagDescription;
    if (Object.keys(this.state.tag).length) {
      console.log(this.state.tag.name);
      tagDescription = (
        <div className='question-index-tag-header'>
          {sidebarTag}
          {this.state.tag.description}
        </div>
      );
    }

    return (
      <div>
        <div className='content-double-main'>
          <SortNav
            links={QUESTION_SORT_TYPES}
            active={this.state.sortBy}
            header={sortNavHeader}
            handleSortChange={this.handleSortChange}/>
          {tagDescription}
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
          {sidebarTag}
        </div>
      </div>
    );
  }
});

module.exports = QuestionsIndex;
