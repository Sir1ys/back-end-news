
const { fetchComments, removeComment, createComment} = require("../models/comments-model");


exports.getComments = (req, res, next) => {
  const { article_id } = req.params;
  fetchComments(article_id)
    .then(({ comments }) => {
      res.status(200).send({ comments });
    })
    .catch((err) => next(err));
};

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;

  removeComment(comment_id)
    .then(() => res.status(204).send())

exports.postComment = (req, res, next) => {
  const commentData = req.body;
  const { article_id } = req.params;

  createComment(article_id, commentData)
    .then(({ comment }) => {
      res.status(201).send({ comment });
    })
    .catch((err) => next(err));
};
