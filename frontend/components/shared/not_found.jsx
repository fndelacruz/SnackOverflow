var React = require('react');

var NotFound = React.createClass({
  render: function() {
    return (
      <div className='not-found-container'>
        Sorry, this page was not found!
      </div>
    );
  }
});

module.exports = NotFound;
