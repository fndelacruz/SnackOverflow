var React = require('react');
var hashHistory = require('react-router').hashHistory;

var TagStub = React.createClass({
  handleClick: function() {
    var path = '/questions/tagged/' + this.props.tagName;
    if (!this.props.currentPathTagName) {
      // if outside of /questions/ path, push immediately
      hashHistory.push(path);
    }
    else if (this.props.currentPathTagName !== this.props.tagName) {
      if (this.props.tagPrePushCallback) {
        this.props.tagPrePushCallback();
        setTimeout(function() {
          hashHistory.push(path);
        }, 250);
      }
    }
  },
  handleClass: function() {
    var className = 'tag-stub';
    if (this.props.currentPathTagName === this.props.tagName &&
        !this.props.isSidebar) {
      className += ' tag-stub-active';
    }
    return className;
  },
  render: function() {
    return (
      <li className={this.handleClass()} onClick={this.handleClick}>
        {this.props.tagName}
      </li>
    );
  }
});

module.exports = TagStub;
