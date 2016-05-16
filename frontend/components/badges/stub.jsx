var React = require('react');
var Util = require('../../util/util');
var hashHistory = require('react-router').hashHistory;

var BadgeStub = React.createClass({
  handleClick: function() {
    if (this.props.badge.id) {
      var path = '/badges/' + this.props.badge.id;
      hashHistory.push(path);
    }
  },
  render: function() {
    var className = 'no-highlight badge-stub-container badge-stub-' + this.props.badge.rank;
    var title = this.props.badge.rank + ' badge: ' + this.props.badge.description;
    var badgeDisplayName;
    if (this.props.badge.category === 'Tag') {
      className += ' tag-badge-stub-container';
      badgeDisplayName = this.props.badge.name;
    } else {
      badgeDisplayName = Util.snakeCaseToCamelSpace(this.props.badge.name);
    }
    return (
      <div
        title={title}
        onClick={this.handleClick}
        className={className}>
        {badgeDisplayName}
      </div>
    );
  }
});

module.exports = BadgeStub;
