var React = require('react');

var SortNav = React.createClass({
  render: function() {
    var liLinks = this.props.links.map(function(link) {
      var className = 'sort-nav';
      if (this.props.active === link) {
        className += ' active';
      }
      return (
        <li
          key={'link-' + link}
          className={className}
          onClick={this.props.handleSortChange.bind(null, link)}>
          {link}
        </li>
      );
    }.bind(this));

    return (
      <div className='subheader group'>
        <h1>{this.props.header}</h1>
        <ul className='nav-right-container'>
          {liLinks}
        </ul>
      </div>
    );
  }
});

module.exports = SortNav;
