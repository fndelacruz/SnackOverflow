var React = require('react');
var Util = require('../../util/util');

var ShowActivityTagItem = React.createClass({
  handleTagClick: function()  {
    alert('TODO handle handleTagClick');
  },
  render: function() {
    return (
      <div className='show-activity-tag-item-container group'>
        <div
          title={Util.handleTagTitleAttr(this.props)}
          onClick={this.handleTagClick}
          className='show-activity-tag-item-answer-reputation'>
          {this.props.answer_reputation}
        </div>
        <div
          onClick={this.handleTagClick}
          className='show-activity-tag-item-tag'>
          {this.props.name}
        </div>
        <div
          title={this.props.post_count + ' posts in the ' + this.props.name +
            ' tag.'}
          className='show-activity-tag-item-post-count'>
          x {this.props.post_count}
        </div>
      </div>
    );
  }
});

module.exports = ShowActivityTagItem;
