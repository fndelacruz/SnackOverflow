var React = require('react');
var QuestionsFormSidebar = require('./form_sidebar');
var ApiUtil = require('../../util/api_util');
var QuestionFormTag = require('./form_tag');
var RemovableTagStub = require('../tags/removable_stub.jsx');
var QuestionsForm = React.createClass({
  getInitialState: function() {
    return {
      title: this.props.title || '',
      content: this.props.content ||'',
      tags: ['hello', 'tag1'],
      tagString: '',
      focus: 'title'
    };
  },
  handleRemoveTag: function(tagName) {
    var tags = this.state.tags;
    tags.splice(tags.indexOf(tagName), 1);
    this.setState({ tags: tags });
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
  handleTagChange: function(e) {
    var value = e.currentTarget.value;
    if (value === ',') {
      this.setState({ tagString: ''});
    } else if (value.match(/(\w+),$/)) {
      newTag =  value.match(/(\w+),$/)[1];
      this.handleAddTag(newTag);
    } else {
      this.setState({ tagString: e.currentTarget.value });
    }
  },
  handleTagsKeyDown: function(e) {
    if (e.keyCode === 13) {
      if (this.state.tagString.length) {
        this.handleAddTag(this.state.tagString);
      }
    } else {
      this.handleTagChange(e);
    }
  },
  handleAddTag: function(tagName) {
    if (this.state.tags.indexOf(tagName) === -1) {
      this.state.tags.push(tagName);
    }
    this.setState({ tagString: '' });
  },
  render: function() {
    var buttonClass;

    if (!this.state.title.length || !this.state.content.length) {
      buttonClass = 'button-disabled';
    }
    var tags = this.state.tags.map(function(tagName) {
      return (
        <RemovableTagStub
          handleRemoveTag={this.handleRemoveTag.bind(this, tagName)}
          key={tagName}
          name={tagName} />
      );
    }.bind(this));
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

          <div className='question-form-tags-container'>
            <div className='question-form-tags-label-and-tags'>
              Tags
              {tags}
            </div>
            <input
              type='text'
              value={this.state.tagString}
              onFocus={this.handleFocus.bind(this, 'tags')}
              onKeyDown={this.handleTagsKeyDown}
              onChange={this.handleTagChange}/>
          </div>

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
