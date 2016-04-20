var React = require('react');

function renderHeader(focus) {
  switch (focus) {
    case 'title':
      return 'Make a good title. Do these things.';
    case 'content':
      return 'No bad content allowed. Be specific';
    case 'tags':
      return 'Tags are good in moderation.';
  }
}

function renderBody(focus) {
  switch (focus) {
    case 'title':
      return (
        <ul className='ask-double-sidebar-content'>
          <li>title</li>
          <li>title</li>
          <li>title</li>
        </ul>
      );
    case 'content':
      return (
        <ul className='ask-double-sidebar-content'>
          <li>content</li>
          <li>content</li>
          <li>content</li>
        </ul>
      );
    case 'tags':
      return (
        <ul className='ask-double-sidebar-content'>
          <li>tags</li>
          <li>tags</li>
          <li>tags</li>
        </ul>
      );
  }
}

var QuestionsNewSidebar = React.createClass({
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
      <div className='ask-double-sidebar'>
        <div className='ask-double-sidebar-header'>
          {renderHeader(this.props.focus)}
        </div>
        <div className='ask-double-sidebar-title'>
        </div>
        {renderBody(this.props.focus)}
      </div>
    );
  }
});

module.exports = QuestionsNewSidebar;
