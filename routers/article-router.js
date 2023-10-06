const articleRouter = require("express").Router();

const {
  getArticle,
  getArticles,
  patchArticle,
} = require("../controllers/articles-controller");

const {
  getComments,
  postComment,
} = require("../controllers/comments-controller");

articleRouter.route("/").get(getArticles);

articleRouter.route("/:article_id").get(getArticle).patch(patchArticle);

articleRouter.route("/:article_id/comments").get(getComments).post(postComment);

module.exports = articleRouter;
