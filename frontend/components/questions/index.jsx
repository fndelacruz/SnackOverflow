var React = require('react');
var QuestionStore = require('../../stores/question');
var ApiUtil = require('../../util/api_util');
var QuestionIndexItem = require('./index_item');
var SortNav = require('../shared/sort_nav');
var QuestionActions = require('../../actions/question');
var TagStub = require('../tags/stub');
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');

var _callbackId;

var QUESTION_SORT_TYPES =
  ['newest', 'featured', 'frequent', 'votes', 'active', 'views'];

var QuestionsIndex = React.createClass({
  getInitialState: function() {
    return {
      questions: QuestionStore.allQuestions(),
      sortBy: QuestionStore.getQuestionSortBy(),
      tag: QuestionStore.getQuestionsTag(),
      indexLoaded: QuestionStore.getIndexLoaded(),
      tagLoaded: false
    };
  },
  componentDidMount: function() {
    console.log('QuestionsIndex mount ON!');

    _callbackId = QuestionStore.addListener(this.onChange);
    if (this.props.params.tagName) {
      ApiUtil.fetchQuestionsTag(this.props.params.tagName);
    }
    ApiUtil.fetchQuestions();
  },
  componentWillReceiveProps: function(newProps) {
    if (this.props.params.tagName !== newProps.params.tagName) {
      ApiUtil.fetchQuestionsTag(newProps.params.tagName);
    }
  },
  componentWillUnmount: function() {
    console.log('QuestionsIndex mount OFF!');
    if (this.props.params.tagName) {
      QuestionActions.receiveQuestionsTag(null);
    }
    _callbackId.remove();
  },
  onChange: function() {
    this.setState({
      questions: QuestionStore.allQuestions(),
      sortBy: QuestionStore.getQuestionSortBy(),
      tag: QuestionStore.getQuestionsTag(),
      indexLoaded: QuestionStore.getIndexLoaded(),
      tagLoaded: true
    });
  },
  handleSortChange: function(sortBy) {
    if (sortBy !== this.state.sortBy) {
      QuestionActions.changeQuestionSort(sortBy);
    }
  },
  resetTag: function() {
    this.setState({ tag: {} });
  },
  renderQuestionIndexItems: function() {
    var questions = this.state.questions;
    if ((!this.props.params.tagName && questions) ||
        (this.props.params.tagName && questions && this.state.tagLoaded)) {
      return questions.map(function(question) {
        return (
          <QuestionIndexItem
            tagPrePushCallback={this.resetTag}
            currentPathTagName={this.props.params.tagName}
            {...question}
            key={'question-' + question.id} />
        );
      }.bind(this));
    } else {
      return (<div />);
    }
  },
  renderSidebar: function(sidebarLabel, sidebarTag, tagDescription) {
    var questions = this.state.questions;
    if ((!this.props.params.tagName && this.state.indexLoaded) ||
        (this.props.params.tagName && questions && this.state.tagLoaded)) {
      return (
        <div className='content-double-sidebar'>
          <div className='sidebar-quantity'>
            {questions ? questions.length : null}
          </div>
          <div className='sidebar-label'>
            {sidebarLabel}
          </div>
          <ReactCSSTransitionGroup
            transitionName='fade-in-fade-out'
            transitionEnterTimeout={250}
            transitionLeaveTimeout={250}>
            <div className='group'>
            {sidebarTag}
            </div>
            {tagDescription}
          </ReactCSSTransitionGroup>
        </div>
      );
    } else {
      return (
        <div className='content-double-sidebar'>
          <div className='icon-loading' />
        </div>
      );
    }
  },
  render: function() {
    var questions = this.state.questions;
    var sortNavHeader = 'Questions', sidebarTag;
    var sidebarLabel;
    if (questions) {
      sidebarLabel = questions.length === 1 ? 'question' : 'questions';
    }

    if (this.props.params.tagName) {
      sortNavHeader = 'Tagged ' + sortNavHeader;
      sidebarLabel = 'tagged ' + sidebarLabel;
      sidebarTag = (
        <TagStub
          isSidebar={true}
          tagPrePushCallback={this.resetTag}
          currentPathTagName={this.props.params.tagName}
          tagName={this.props.params.tagName} />
      );
    }

    var tagDescription;
    if (this.state.tag) {
      tagDescription = (
        <div className='question-index-tag-header'>
          {this.state.tag.description}
        </div>
      );
    }
    return (
      <div>
        <div className='content-double-main'>
          <SortNav
            tabShift='right'
            links={QUESTION_SORT_TYPES}
            active={this.state.sortBy}
            header={sortNavHeader}
            handleSortChange={this.handleSortChange}/>
          <ReactCSSTransitionGroup
            transitionName='fade-in-left-out'
            transitionEnterTimeout={500}
            transitionLeaveTimeout={500}>
            {this.renderQuestionIndexItems()}
          </ReactCSSTransitionGroup>
        </div>
        {this.renderSidebar(sidebarLabel, sidebarTag, tagDescription)}
      </div>
    );
  }
});

module.exports = QuestionsIndex;
