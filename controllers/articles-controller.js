const { fetchArticle } = require("../models/articles-model");

exports.getArticle = (req, res, next) => {
  fetchArticle().then(({ article }) => {});
};
