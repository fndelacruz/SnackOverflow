var React = require('react');
var SortNav = require('../shared/sort_nav');
var UserStore = require('../../stores/user');
var UserActions = require('../../actions/user');
var ApiUtil = require('../../util/api_util');
var TagsIndexItem = require('./index_item');
var SubSearch = require('../shared/sub_search');
var TagStore = require('../../stores/tag');
var TagActions = require('../../actions/tag');

var TAG_SORT_TYPES = ['popular', 'name', 'new'];

var _callbackId;

var TagsIndex = React.createClass({
  getInitialState: function() {
    return {
      tags: TagStore.all(),
      sortBy: TagStore.getSortBy(),
      search: ''
    };
  },
  componentDidMount: function() {
    _callbackId = TagStore.addListener(this.onChange);
    ApiUtil.fetchTags();
  },
  componentWillUnmount: function() {
    _callbackId.remove();
  },
  handleSortChange: function(sortBy) {
    TagActions.changeTagSort(sortBy);
  },
  onChange: function() {
    this.setState({
      tags: TagStore.all(),
      sortBy: TagStore.getSortBy()
    });
  },
  handleSearchChange: function(e) {
    var searchValue = e.currentTarget.value;
    TagActions.changeTagSearchTerm(searchValue);
    this.setState({ search: searchValue });
  },
  render: function() {
    var tags = this.state.tags.map(function(tag) {
      return (
        <TagsIndexItem
          tag={tag}
          sortBy={this.state.sortBy}
          key={'tag-' + tag.id}/>
      );
    }.bind(this));
    return (
      <div className='tags-index-container'>
        <SortNav
          links={TAG_SORT_TYPES}
          active={this.state.sortBy}
          header='Tags'
          handleSortChange={this.handleSortChange}/>
        <SubSearch
          search={this.state.search}
          handleSearchChange={this.handleSearchChange}/>
        <div className='tags-index-item-container'>
          {tags}
        </div>
      </div>
    );
  }
});

module.exports = TagsIndex;
