var React = require('react');
var SortNav = require('../shared/sort_nav');
var QuestionStore = require('../../stores/question');
var QuestionActions = require('../../actions/question');
var ShowItem = require('../questions/show_item');
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');

var ANSWER_SORT_TYPES = ['oldest', 'votes'];

var AnswersIndex = React.createClass({
  handleSortChange: function(sortBy) {
    if (sortBy !== this.props.answerSortBy) {
      QuestionActions.changeAnswerSort(sortBy);
    }
  },
  handleAnswerHeader: function() {
    var answersLength = this.props.answers.length;
    return answersLength + ' Answer' + (answersLength === 1 ? '' : 's');
  },
  render: function() {
    var AnswerIndexItems;
    if (this.props.answers) {
       AnswerIndexItems = this.props.answers.map(function(answer) {
        return (
          <ShowItem
            key={'answer-' + answer.id}
            type='Answer'
            item={answer}
            handleVote={this.props.handleVote} />
        );

      }.bind(this));
    }
    return (
      <div className='answers-index-container'>
        <SortNav
          tabShift='right'
          links={ANSWER_SORT_TYPES}
          active={this.props.answerSortBy}
          header={this.handleAnswerHeader()}
          handleSortChange={this.handleSortChange} />
        <ReactCSSTransitionGroup
          transitionName={'show-index-item'}
          transitionEnterTimeout={500}
          transitionLeaveTimeout={500}>
          {AnswerIndexItems}
        </ReactCSSTransitionGroup>
      </div>
    );
  }
});

module.exports = AnswersIndex;
