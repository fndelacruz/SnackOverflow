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
  resetTag: function() {
    this.setState({ tag: {} });
  },
  render: function() {
    if (!this.state.questions.length) {
      return (<div></div>);
    }
    var QuestionIndexItems = this.state.questions.map(function(question) {
      return (
        <QuestionIndexItem
          tagPrePushCallback={this.resetTag}
          currentPathTagName={this.props.params.tagName}
          {...question}
          key={'question-' + question.id} />
      );
    }.bind(this));

    var sortNavHeader = 'Questions', sidebarLabel = 'questions', sidebarTag;
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
    if (Object.keys(this.state.tag).length) {
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
            {QuestionIndexItems}
          </ReactCSSTransitionGroup>
        </div>
        <div className='content-double-sidebar'>
          <div className='sidebar-quantity'>
            {this.state.questions.length}
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
      </div>
    );
  }
});

module.exports = QuestionsIndex;
