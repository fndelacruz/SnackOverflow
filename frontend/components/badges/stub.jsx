var React = require('react');
var Util = require('../../util/util');

var BadgeStub = React.createClass({
  handleClick: function() {
    alert('TODO handleClick BadgeStub');
  },
  render: function() {
    var className = 'badge-stub-container + badge-stub-' + this.props.badge.rank;
    var title = this.props.badge.rank + ' badge: ' + this.props.badge.description;
    return (
      <div
        title={title}
        onClick={this.handleClick}
        className={className}>
        {Util.snakeCaseToCamelSpace(this.props.badge.name)}
      </div>
    );
  }
});

module.exports = BadgeStub;
