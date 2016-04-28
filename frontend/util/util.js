module.exports = {
  capitalize: function(string) {
    return string[0].toUpperCase() + string.slice(1);
  },

  // NOTE: defaults to ascending
  sortBy: function(items, sortType, isDescending, sortType2, isDescending2) {
      items.sort(function(a, b) {
        if (a[sortType] < b[sortType]) {
          return isDescending ? 1 : -1;
        } else if (a[sortType] > b[sortType]) {
          return isDescending ? -1 : 1;
        } else if (a[sortType] === b[sortType]) {

          if (sortType2) {
            if (a[sortType2] < b[sortType2]) {
              return isDescending2 ? 1 : -1;
            } else if (a[sortType2] > b[sortType2]) {
              return isDescending2 ? -1 : 1;
            } else if (a[sortType2] === b[sortType2]) {
              return 0;
            }

          } else {
            return 0;
          }
        }
      });
  },
  formatDateHelper: function (item) {
    if (item.created_at) {
      item.created_at = new Date(item.created_at);
    }
    if (item.updated_at) {
      item.updated_at = new Date(item.updated_at);
    }
  },
  snakeCaseToCamelSpace: function(string) {
    words = string.split('_');
    words = words.map(this.capitalize);
    return words.join(' ');
  }
};
