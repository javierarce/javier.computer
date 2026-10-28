module.exports = {
  permalink: ({ pagination }) =>
    pagination.pageNumber === 0
      ? "/index.html"
      : `/page/${pagination.pageNumber + 1}/index.html`,
};
