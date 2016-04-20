module.exports = {
  capitalize: function(string) {
    return string[0].toUpperCase() + string.slice(1);
  },

  // NOTE: defaults to ascending
  sortBy: function(items, sortType, isDescending) {
    items.sort(function(a, b) {
      if (a[sortType] < b[sortType]) {
        return isDescending ? 1 : -1;
      } else if (a[sortType] > b[sortType]) {
        return isDescending ? -1 : 1;
      } else if (a[sortType] === b[sortType]) {
        return 0;
      }
    });
  }
};
