var React = require('react');

var TagsIndexItem = React.createClass({
  render: function() {
    var tag = this.props.tag, footer;
    var description = tag.description;
    if (description.length > 130) {
      description = description.slice(0, 120) + '...';
    }
    return (
      <div className='tags-index-item'>
        <div className='tags-index-item-header group'>
          <div className='tag-display-name-link'>
            <ul className='tags'><li>{tag.name}</li></ul>
          </div>
          <div className='tags-question-count'>
            {'× ' + tag.question_count}
          </div>
        </div>
        <div className='tags-description-preview'>
          {description}
        </div>
        <div className='tags-index-item-footer'>
          {footer}
        </div>
      </div>
    );
  }
});

module.exports = TagsIndexItem;
