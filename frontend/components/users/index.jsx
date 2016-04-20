var React = require('react');
var SortNav = require('../shared/sort_nav');

var USER_SORT_TYPES = ['reputation', 'new users', 'voters'];

var UsersIndex = React.createClass({
  getInitialState: function() {
    return { sortBy: 'reputation' }; // temporary. set to UserStore.sortBy()
  },
  handleSortChange: function() {
    alert('TODO handleSortChange users');
  },
  render: function() {
    return (
      <div>
        <SortNav
          links={USER_SORT_TYPES}
          active={this.state.sortBy}
          header='Users'
          handleSortChange={this.handleSortChange}/>
      </div>
    );
  }
});

module.exports = UsersIndex;
