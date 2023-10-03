const { fetchComments } = require("../models/comments-model");

exports.getComments = (req, res, next) => {
  fetchComments();
};
