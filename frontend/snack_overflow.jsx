var React = require('react');
var ReactDOM = require('react-dom');
var Router = require('react-router').Router;
var Route = require('react-router').Route;
var Redirect = require('react-router').Redirect;
var NavBar = require('./components/nav/nav_bar');
var QuestionsIndex = require('./components/questions/index');
var hashHistory = require('react-router').hashHistory;
var QuestionShow = require('./components/questions/show');
var QuestionsForm = require('./components/questions/form');
var QuestionEdit = require('./components/questions/edit');
var UsersIndex = require('./components/users/index');
var TagsIndex = require('./components/tags/index');
var UserShow = require('./components/users/show');
var BadgesIndex = require('./components/badges/index');
var BadgeShow = require('./components/badges/show');

var App = (
  <Router history={hashHistory}>
    <Route path='/' component={NavBar}>
      <Route path='questions' component={QuestionsIndex} />
      <Route path='questions/tagged/:tagName' component={QuestionsIndex} />
      <Route path='questions/:questionId(/answer/:answerId)' component={QuestionShow} />
      <Route path='questions/:questionId/edit' component={QuestionEdit} />
      <Route path='ask' component={QuestionsForm} />
      <Route path='users' component={UsersIndex} />
      <Route path='users/:userId(/:tab)' component={UserShow} />
      <Route path='tags' component={TagsIndex} />
      <Route path='badges' component={BadgesIndex} />
      <Route path='badges/:badgeId' component={BadgeShow} />
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
});
