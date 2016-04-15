var React = require('react');

function liTagsMap(questionId, tags) {
  return tags.map(function(tag) {
    return (
      <li
        key={'question-' + questionId + '-tag-' + tag.id}>
        {tag.name}
      </li>
    );
  });
}

QuestionsIndexItem = React.createClass({
  render: function() {
    var question = this.props, tags;
    if (question.tags.length) {
      tags = (
        <div>
          tags
          <ul>
            {liTagsMap(question.id, question.tags)}
          </ul>
        </div>
      );
    }
    return (
      <div className='question-index-item'>
        <div>asked by: {question.user.display_name}</div>
        <div>created at: {question.created_at}</div>
        <div>title: {question.title}</div>
        <div>content: {question.content}</div>
        <div>votes: {question.vote_count}</div>
        <div>answers: {question.answer_count}</div>
        <div>views: {question.view_count}</div>
        {tags}
      </div>
    );
  }
});

module.exports = QuestionsIndexItem;
