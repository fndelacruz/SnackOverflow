var React = require('react');
var hashHistory = require('react-router').hashHistory;
var UserLinkStub = require('../users/link_stub');

var BadgingItem = React.createClass({
  handleClick: function() {
    var path = '/questions/' + this.props.question_id;
    if (this.props.badgeable_type === 'Answer') {
      path += '/answer/' + this.props.badgeable_id;
    }
    hashHistory.push(path);
  },
  handleUserClick: function() {
    var path = '/users/' + this.props.user_id;
    hashHistory.push(path);
  },
  render: function() {
    return (
      <div className='badging-item-container group'>
        <div className='badging-item-title-container'>
          <span onClick={this.handleClick} className='badging-item-title link'>
            {this.props.title}
          </span>
        </div>
        <div className='badging-item-detail-container'>
          <div className='badging-item-detail-date'>
            {this.props.created_at_words}
          </div>
          <div className='badging-item-detail-user-container'>
            <img
              className='question-index-item-user-pic'
              onClick={this.handleUserClick}
              src={'https://robohash.org/' + this.props.user_id + '?bgset=any'} />
            <UserLinkStub
              {...{id: this.props.user_id,
                display_name: this.props.user_display_name}}/>
            <div className='user-reputation'>
              {this.props.user_reputation}
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = BadgingItem;
