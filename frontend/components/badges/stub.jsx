var React = require('react');
var Util = require('../../util/util');

var BadgeStub = React.createClass({
  handleClick: function() {
    alert('TODO handleClick BadgeStub');
  },
  render: function() {
    var className = 'badge-stub-container + badge-stub-' + this.props.badge.rank;
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
