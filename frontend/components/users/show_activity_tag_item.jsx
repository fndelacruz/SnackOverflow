var React = require('react');
var Util = require('../../util/util');
var hashHistory = require('react-router').hashHistory;

var ShowActivityTagItem = React.createClass({
  render: function() {

    var pushPath = '/questions/tagged/' + this.props.name;
    return (
      <div className='show-activity-tag-item-container group'>
        <div
          title={Util.handleTagTitleAttr(this.props)}
          className='show-activity-tag-item-answer-reputation'>
          {this.props.answer_reputation}
        </div>
        <div
          onClick={hashHistory.push.bind(null, pushPath)}
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
