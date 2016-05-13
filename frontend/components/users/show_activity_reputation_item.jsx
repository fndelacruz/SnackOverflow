var React = require('react');
var hashHistory = require('react-router').hashHistory;

var ShowActivityReputationItem = React.createClass({
  handleClick: function() {
    var path = '/questions/' + this.props.question_id;
    if (this.props.votable_type === 'Answer') {
      path += '/answer/' + this.props.votable_id;
    } else if (this.props.votable_type === 'Comment') {
      path += '/comment/' + this.props.votable_id;
    }
    hashHistory.push(path);
  },
  render: function() {
    var reputation = this.props.reputation;
    var valueClass = 'show-activity-reputation-item-value';
    var type = this.props.votable_type.toLowerCase();
    if (reputation > 0 ) {
      valueClass += ' show-activity-reputation-item-value-up';
    } else {
      valueClass += ' show-activity-reputation-item-value-down';
    }
    var title;
    if (this.props.title.length > 110) {
      title = this.props.title.slice(0, 110) + ' ...';
    } else {
      title = this.props.title;
    }

    return (
      <div className='show-activity-reputation-item-container group'>
        <div className={valueClass}>
          {(reputation > 0 ? '+' : '') + reputation}
        </div>
        <div className='show-activity-reputation-item-time'>
          {this.props.created_at.toLocaleString()}
        </div>
        <div className='show-activity-reputation-item-type'>
          {type}
        </div>
        <div
          onClick={this.handleClick}
          className='show-activity-reputation-item-title link'>
          {title}
        </div>
      </div>
    );
  }
});

module.exports = ShowActivityReputationItem;
