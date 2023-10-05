const {
  fetchArticle,
  fetchArticles,
  updateArticle,
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
  fetchArticles().then((articles) => {
    res.status(200).send({ articles });
  });
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
