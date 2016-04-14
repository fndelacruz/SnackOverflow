var React = require('react');
var ReactDOM = require('react-dom');

var MyApp = React.createClass({
  render: function() {
    return (
      <div>MyApp</div>
    );
  }
});

document.addEventListener('DOMContentLoaded', function() {
  var root = document.getElementById('root');
  if (root) {
    ReactDOM.render(
      React.createElement(MyApp),
      document.getElementById('root')
    );
  }
  console.log('loaded');
});
