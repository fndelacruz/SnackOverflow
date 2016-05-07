var React = require('react');
var QuestionsFormSidebar = require('./form_sidebar');
var ApiUtil = require('../../util/api_util');

var QuestionsForm = React.createClass({
  getInitialState: function() {
    return {
      title: this.props.title || '',
      content: this.props.content ||'',
      focus: 'title'
    };
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

      if (this.props.id) {
        ApiUtil.updateQuestion(
          $.extend({}, { id: this.props.id }, this.state)
        );
      } else {
        ApiUtil.createQuestion(this.state);
      }
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
      <div className='question-form-double'>
        <div className='item-new-double-main'>
          <div className='question-form-title-container group'>
            <div className='question-form-title-label'>
              Title
            </div>
            <input
              autoFocus
              type='text'
              value={this.state.title}
              onFocus={this.handleFocus.bind(this, 'title')}
              onChange={this.handleChange.bind(this, 'title')}
              className='question-form-title-input' />
          </div>
          <textarea
            value={this.state.content}
            onFocus={this.handleFocus.bind(this, 'content')}
            onChange={this.handleChange.bind(this, 'content')}
            className='item-content-input' />
          <button
            className={buttonClass}
            onClick={this.handleSubmit}>
            {(this.props.id ? 'Update' : 'Post') + ' Question'}
          </button>
        </div>
        <QuestionsFormSidebar
          key='question-form-double-sidebar-component'
          focus={this.state.focus} />
      </div>
    );
  }
});

module.exports = QuestionsForm;
