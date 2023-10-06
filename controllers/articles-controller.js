const {
  fetchArticle,
  fetchArticles,
  updateArticle,
  createArticle,
} = require("../models/articles-model");

exports.getArticle = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticle(article_id)
    .then(({ article }) => {
      res.status(200).send({ article });
    })
    .catch((err) => next(err));
};

exports.getArticles = (req, res, next) => {
  const { topic, order, sort_by } = req.query;

  fetchArticles(topic, order, sort_by)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => next(err));
};

exports.patchArticle = (req, res, next) => {
  const { article_id } = req.params;
  const articleData = req.body;

  updateArticle(article_id, articleData)
    .then(({ article }) => {
      res.status(200).send({ article });
    })
    .catch((err) => next(err));
};

exports.postArticle = (req, res, next) => {
  const articleData = req.body;

  createArticle(articleData)
    .then(({ article }) => {
      res.status(201).send({ article });
    })
    .catch((err) => next(err));
};
