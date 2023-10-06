const { deleteComment } = require("../controllers/comments-controller");

const commentRouter = require("express").Router();

commentRouter.route("/:comment_id").delete(deleteComment);

module.exports = commentRouter;
