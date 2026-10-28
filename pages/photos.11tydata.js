module.exports = {
  permalink: ({ pagination }) =>
    pagination.pageNumber === 0
      ? "/photos/index.html"
      : `/photos/page/${pagination.pageNumber + 1}/index.html`,
};
