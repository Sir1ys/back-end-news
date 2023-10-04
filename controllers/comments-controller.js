const { fetchComments, removeComment } = require("../models/comments-model");

exports.getComments = (req, res, next) => {
  const { article_id } = req.params;
  fetchComments(article_id)
    .then(({ comments }) => {
      res.status(200).send({ comments });
    })
    .catch((err) => next(err));
};

exports.deleteComment = (req, res, next) => {
  removeComment();
};
