var React = require('react');
var TagStub = require('./stub');

var TagStubIndex = React.createClass({
  render: function() {
    return (
      <ul className='tags group'>
        {this.props.tags.map(function(tag) {
          var tagName = typeof tag === 'string' ? tag : tag.name;
          var key = 'question-' + this.props.questionId + '-tag-' + tagName;
          return (
            <TagStub
              tagPrePushCallback={this.props.tagPrePushCallback}
              currentPathTagName={this.props.currentPathTagName}
              key={key}
              tagName={tagName} />
          );
       }.bind(this))}
      </ul>
    );
  }
});

module.exports = TagStubIndex;
