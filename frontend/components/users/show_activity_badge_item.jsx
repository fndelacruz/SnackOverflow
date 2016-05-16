var React = require('react');
var BadgeStub = require('../badges/stub');

var ShowActivityBadgeItem = React.createClass({
  render: function() {
    var badge = this.props.badge, multipler;
    if (badge.count > 1) {
      multipler = (
        <div className='show-activity-badge-item-count'>
          {'x ' + badge.count}
        </div>
      );
    }
    return (
      <div
        className='show-activity-badge-item-container'
        key={'tag-' + badge.name}>
        <BadgeStub badge={badge} />
        {multipler}
      </div>
    );
  }
});

module.exports = ShowActivityBadgeItem;
