var React = require('react');

function renderHeader(focus) {
  switch (focus) {
    case 'title':
      return 'How to ask.';
    case 'content':
      return 'Be specific.';
    case 'tags':
      return 'How to tag.';
  }
}

function renderBody(focus) {
  switch (focus) {
    case 'title':
      return (
        <ul className='question-form-double-sidebar-content'>
          <li>• Please make sure your question is relevant to food, snacks, cooking or some culinary concept.</li>
          <li>• Before asking a question, do a quick search above to see if your question has already been answered.</li>
          <li>• Title is 120 characters maximum.</li>
        </ul>
      );
    case 'content':
      return (
        <ul className='question-form-double-sidebar-content'>
          <li>• Include any relevant details that could help other users better answer your question.</li>
          <li>• Keep your question content relevant to the title provided. Please create a new question for related, but tangential topics.</li>
          <li>• Main question content is 700 characters maximum. </li>
        </ul>
      );
    case 'tags':
      return (
        <ul className='question-form-double-sidebar-content'>
          <li>• Tags are keywords that help group similar questions together.</li>
          <li>• Prefer to use established tags over creating new tags.</li>
          <li>• To initiate tag creation while tag-searching, press the enter key.</li>
          <li>• Permitted tag characters are [ a-z 0-9 - ]</li>
          <li>• 5 tags maximum.</li>
        </ul>
      );
  }
}

var QuestionsFormSidebar = React.createClass({
  renderHeader: function() {
    switch (this.props.focus) {
      case 'title':
        return 'How to Ask';
      case 'content':
        return 'Have some good content, please!';
    }
  },
  render: function() {
    return (
      <div className='question-form-double-sidebar'>
        <div className='question-form-double-sidebar-header'>
          {renderHeader(this.props.focus)}
        </div>
        <div className='question-form-double-sidebar-title'>
        </div>
        {renderBody(this.props.focus)}
      </div>
    );
  }
});

module.exports = QuestionsFormSidebar;
