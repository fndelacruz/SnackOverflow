var React = require('react');
var QuestionsNewSidebar = require('./new_sidebar');
var ApiUtil = require('../../util/api_util');

var QuestionsNew = React.createClass({
  getInitialState: function() {
    return { title: '', content: '', focus: 'title'};
  },
  handleChange: function(type, e) {
    switch (type) {
      case 'title':
        this.setState ({ title: e.currentTarget.value });
        break;
      case 'content':
        this.setState ({ content: e.currentTarget.value });
        break;
      case 'tags':
        alert('TODO handleChange tags');
        break;
    }
  },
  handleSubmit: function() {
    if (this.state.title.length && this.state.content.length) {
      ApiUtil.createQuestion({
        'question[title]': this.state.title,
        'question[content]': this.state.content
      });
    }
  },
  handleFocus: function(type) {
    if (this.state.type !== type) {
      this.setState({ focus: type });
    }
  },
  render: function() {
    var buttonClass;

    if (!this.state.title.length || !this.state.content.length) {
      buttonClass = 'button-disabled';
    }
    return (
      <div className='ask-double'>
        <div className='item-new-double-main'>
          <div className='ask-title-container group'>
            <div className='ask-title-label'>
              Title
            </div>
            <input
              autoFocus
              type='text'
              value={this.state.title}
              onFocus={this.handleFocus.bind(this, 'title')}
              onChange={this.handleChange.bind(this, 'title')}
              className='ask-title-input' />
          </div>
          <textarea
            value={this.state.content}
            onFocus={this.handleFocus.bind(this, 'content')}
            onChange={this.handleChange.bind(this, 'content')}
            className='item-content-input' />
          <button
            className={buttonClass}
            onClick={this.handleSubmit}>
            Post Question
          </button>
        </div>
        <QuestionsNewSidebar
          key='ask-double-sidebar-component'
          focus={this.state.focus} />
      </div>
    );
  }
});

module.exports = QuestionsNew;
