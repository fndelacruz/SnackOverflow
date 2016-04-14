var React = require('react');
var ReactDOM = require('react-dom');
var Router = require('react-router').Router;
var Route = require('react-router').Route;
var NavBar = require('./components/nav/nav_bar');

var App = (
  <Router>
    <Route path='/' component={NavBar}>
    </Route>
  </Router>
);

// IDEAL GOAL
// var App = (
//   <Router>
//     <Route path='/' component={NavBar}>
//       <IndexRoute component={Home}/>
//       <Route path='questions/' component={QuestionsIndex} />
//       <Route path='tags/' component={TagsIndex}/>
//     </Route>
//   </Router>
// );

document.addEventListener('DOMContentLoaded', function() {
  var root = document.getElementById('root');
  if (root) {
    ReactDOM.render(App, document.getElementById('root'));
  }
  console.log('loaded');
});
