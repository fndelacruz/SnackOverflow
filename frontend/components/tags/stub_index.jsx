var React = require('react');
var TagStub = require('./stub');

var TagStubIndex = React.createClass({
  render: function() {
    return (
      <ul className='tags'>
        {this.props.tags.map(function(tag) {
          return (
            <TagStub
              tagPrePushCallback={this.props.tagPrePushCallback}
              currentPathTagName={this.props.currentPathTagName}
              key={'question-' + this.props.questionId + '-tag-' + tag.name}
              tagName={tag.name} />
          );
       }.bind(this))}
      </ul>
    );
  }
});

module.exports = TagStubIndex;
