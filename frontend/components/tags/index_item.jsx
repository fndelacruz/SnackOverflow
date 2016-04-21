var React = require('react');

var TagsIndexItem = React.createClass({
  render: function() {
    var tag = this.props.tag, footer;
    // switch (this.props.sortBy) {
    //   case 'reputation':
    //     footer = 'tag1, tag2, tag3';
    //     break;
    //   case 'new tags':
    //     // footer should be tag list
    //     // pre-footer should be created_at_words
    //     footer = 'joined ' + user.created_at.toLocaleString();
    //     break;
    //   case 'voters':
    //     footer = user.vote_count + ' votes';
    //     break;
    // }
    return (
      <div className='tags-index-item'>
        <div className='tags-index-item-non-tag-container group'>
          <div className='tag-display-name-link'>
            {tag.name + ', questions: ' + tag.question_count}
          </div>
        </div>
        <div className='tags-index-item-footer'>
          {footer}
        </div>
      </div>
    );
  }
});

module.exports = TagsIndexItem;
