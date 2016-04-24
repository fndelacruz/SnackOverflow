var React = require('react');
var TagLink = require('./tag_link');

function handleAnswerTagsComma(idx) {
  if (idx !== 0) {
    return (<span>, </span>);
  }
}

var TagLinkIndex = React.createClass({
  render: function() {
    return (
      <div className='tag-link-index'>
        {this.props.tags.slice(0, 3).map(function(tag, idx) {
          return (
            <span key={'user-' + this.props.userId + '-tag-' + tag.object.id}>
              {handleAnswerTagsComma(idx)}
              <TagLink tag={tag.object} />
            </span>
          );
        }.bind(this))}
      </div>
    );
  }
});

module.exports = TagLinkIndex;
