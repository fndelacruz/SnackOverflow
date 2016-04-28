var React = require('react');
var TagStub = require('../tags/stub');

var TagsIndexItem = React.createClass({
  navigateTo: function(tagName) {
    var path = '/questions/tagged/' + tagName;
    hashHistory.push(path);
  },
  render: function() {
    var tag = this.props.tag;
    var description = tag.description;
    if (description.length > 130) {
      description = description.slice(0, 120) + '...';
    }

    var footer = tag.weekly_question_count + ' asked this week, ' +
      tag.monthly_question_count + ' this month.';

    return (
      <div className='tags-index-item'>
        <div className='tags-index-item-header group'>
          <div className='tag-display-name-link'>
            <ul className='tags'>
              <TagStub tagName={tag.name} />
            </ul>
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
