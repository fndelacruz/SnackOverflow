var React = require('react');
var QuestionsFormSidebar = require('./form_sidebar');
var ApiUtil = require('../../util/api_util');
var QuestionFormTag = require('./form_tag');
var RemovableTagStub = require('../tags/removable_stub.jsx');
var TagStore = require('../../stores/tag');
var TagActions = require('../../actions/tag');
var TagStub = require('../tags/stub');

var _callbackId;
var QuestionsForm = React.createClass({
  getInitialState: function() {
    var tags = [];
    if (this.props.tags) {
      tags = this.props.tags.map(function(tag) {
        return tag.name;
      });
    }
    return {
      title: this.props.title || '',
      content: this.props.content ||'',
      tags: tags,
      newTags: [],
      tagString: '',
      focus: 'title',
      foundTags: null,
      tagStringError: false,
      newTagDescription: '',
      isCreatingNewTag: false
    };
  },
  componentDidMount: function() {
    _callbackId = TagStore.addListener(this.onTagChange);
    ApiUtil.fetchTags();
  },
  onTagChange: function() {
    var foundTags = TagStore.all().slice(0, 6);
    this.setState({
      foundTags: foundTags,
      newTagDescription: '',
      isCreatingNewTag: false
    });
  },
  componentWillUnmount: function() {
    TagActions.resetTagStoreSettings();
    _callbackId.remove();
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
  handleBlur: function(type) {
    switch (type) {
      case 'tags':
        this.setState({ tagStringError: false });
        break;
    }
  },
  handleTagChange: function(e) {
    this.setState({ tagStringError: '' });
    var value = e.currentTarget.value;

    if (value.match(/(\w+),$/)) {
      newTag =  value.match(/(\w+),$/)[1];
      this.handleAddTag(newTag);
    } else {
      if (value.length > 25) {
        this.setState({ tagStringError: 'Tag name is 25 characters max.' });
      } else if (value && value.search(/^[-a-z0-9]+$/i) === -1) {
        this.setState({
          tagStringError: 'Permitted tag characters: [a-z 0-9 -]'
        });
      } else {
        TagActions.changeTagSearchTerm(value.toLowerCase());
        this.setState({ tagString: value });
      }
    }
  },
  handleTagsKeyDown: function(e) {
    if (e.keyCode === 13) {
      if (this.state.tagString.length) {
        this.handleAddTag(this.state.tagString);
      }
    }
  },
  handleAddTag: function(tagName) {
    var tag = this.state.foundTags.find(function(tag) {
      return tag.name === this.state.tagString;
    }.bind(this));

    if (tag) {
      if (!this.tagAlreadyChosen(tag.name)) {
        this.state.tags.push(tag.name);
      }
      this.setState({ tagString: '' });
    } else {
      this.setState({ isCreatingNewTag: true });
    }
  },
  tagAlreadyChosen: function(prospectiveTagName) {
    return this.state.tags.find(function(tagName) {
      return tagName === prospectiveTagName;
    });
  },
  selectableTags: function() {
    return this.state.foundTags.filter(function(tag) {
      return !this.state.tags.find(function(tagName) {
        return tagName === tag.name;
      });
    }.bind(this));
  },
  handleAddTagClick: function(tagName) {
    console.log('handleAddTagClick');
    this.state.tags.push(tagName);
    this.setState({ tagString: ''});
    document.getElementById('question-form-tags-input').focus();
  },
  handleNewTagDescriptionChange: function(e) {
    this.setState({ newTagDescription: e.currentTarget.value });
  },
  handleNewTagSubmit: function() {
    if (this.state.newTagDescription) {
      ApiUtil.createTag(this.state);
    }
  },
  renderFoundTagsSlice: function(start, stop) {
    return (
      <div className='question-form-tags-search-results-row group'>
        {this.selectableTags().slice(start, stop).map(function(tag) {
          return (
            <div
              onClick={this.handleAddTagClick.bind(this, tag.name)}
              className='found-tag-item' key={tag.name}>
              <div className='found-tag-name group'>
                <TagStub
                  clickOverride={function() {}}
                  tagName={tag.name} />
                <div className='tags-question-count'>
                  {'× ' + tag.question_count}
                </div>
              </div>
              <div className='found-tag-description'>
                {tag.description}
              </div>
            </div>
          );
        }.bind(this))}
      </div>
    );
  },
  renderNewTagForm: function() {
    var newTagSubmitClass;
    if (!this.state.newTagDescription) {
      newTagSubmitClass = 'button-disabled';
    }
    return (
      <div className='question-form-tags-search-popout'>
        <div className='question-form-tags-new-header'>
          Tag '{this.state.tagString.toLowerCase()}' not found. Enter a
          description of this tag to create it.
        </div>
        <textarea
          onChange={this.handleNewTagDescriptionChange}
          value={this.state.newTagDescription} />
        <button
          onClick={this.handleNewTagSubmit}
          className={newTagSubmitClass}>
          Create Tag
        </button>
      </div>
    );
  },
  render: function() {
    var buttonClass, tagSearchResults;

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

    var tagSearchError;
    if (this.state.tagStringError) {
      tagSearchError = (
        <div className='question-form-tags-error'>
          {this.state.tagStringError}
        </div>
      );
    }

    var tagSearchFooter;
    if (this.state.tagString.length) {
      if (this.state.foundTags.length) {
        if (this.state.isCreatingNewTag || (this.state.foundTags.length &&
            !this.selectableTags().length)) {
          if (!this.tagAlreadyChosen(this.state.tagString)) {
            tagSearchFooter = this.renderNewTagForm();
          }
        } else {
          tagSearchFooter = (
            <div className='question-form-tags-search-popout'>
              {this.renderFoundTagsSlice(0, 3)}
              {this.renderFoundTagsSlice(3, 6)}
            </div>
          );
        }
      } else {
        tagSearchFooter = this.renderNewTagForm();
      }
    }

    var tagsInputDisabled, tagsInputClass = '', tagsInputPlaceholder;
    if (this.state.tags.length === 5) {
      tagsInputClass += ' question-form-tags-input-disabled';
      tagsInputDisabled = true;
      tagsInputPlaceholder = '5 tags max.';
    }

    if (this.state.tagStringError) {
      tagsInputClass += ' question-form-tags-input-error';
    }

    return (
      <div className='question-form-double group'>
        <div className='question-form-main'>
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
              <span className='question-form-tags-label'>
                Tags
              </span>
              {tags}
            </div>
            <input
              type='text'
              className={tagsInputClass}
              id='question-form-tags-input'
              placeholder={tagsInputPlaceholder}
              disabled={tagsInputDisabled}
              value={this.state.tagString}
              onFocus={this.handleFocus.bind(this, 'tags')}
              onBlur={this.handleBlur.bind(this, 'tags')}
              onKeyDown={this.handleTagsKeyDown}
              onChange={this.handleTagChange} />
            {tagSearchError}
            {tagSearchFooter}
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
