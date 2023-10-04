const { fetchArticle, fetchArticles } = require("../models/articles-model");

exports.getArticle = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticle(article_id)
    .then(({ article }) => {
      res.status(200).send({ article });
    })
    .catch((err) => next(err));
};

exports.getArticles = (req, res, next) => {
  const { topic } = req.query;

  fetchArticles(topic)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => next(err));
};
