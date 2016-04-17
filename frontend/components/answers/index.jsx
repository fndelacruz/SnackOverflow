var React = require('react');
var SortNav = require('../shared/sort_nav');
var AnswerActions = require('../../actions/answer');
var AnswerStore = require('../../stores/answer');

function answerHeader(answersLength) {
  return answersLength + ' Answer' + (answersLength === 1 ? '' : 's');
}
var ANSWER_SORT_TYPES = ['active', 'oldest', 'votes'];

var AnswersIndex = React.createClass({
  getInitialState: function() {
    return { answers: this.props.answers };
  },
  componentDidMount: function() {
    // AnswerActions.fetchCachedAnswers();
  },
  componentWillUnmount: function() {

  },
  handleSortChange: function() {
    alert('TODO');
  },
  render: function() {
    if (!this.props.answers) {
      return (<div />);
    }

    var liLinks = this.props.links.map(function(link) {
      var className;
      if (this.props.active === link) {
        className = 'active';
      }
      return (
        <li
          key={'link-' + link}
          className={className}
          onClick={this.props.handleSortChange.bind(null, link)}>
          {link}
        </li>
      );
    }.bind(this));

    return (
      <div>
        <SortNav
          links={ANSWER_SORT_TYPES}
          active={this.state.sortBy}
          header={answerHeader(this.props.answers.length)}
          handleSortChange={this.handleSortChange} />
      </div>
    );
  }
});
