const apiRouter = require("express").Router();
const articleRouter = require("./article-router");
const topicRouter = require("./topic-router");
const commentRouter = require("./comment-router");
const userRouter = require("./user-router");

const { getEndpoints } = require("../controllers/api-controller");

apiRouter.route("/").get(getEndpoints);

apiRouter.use("/topics", topicRouter);

apiRouter.use("/articles", articleRouter);

apiRouter.use("/comments", commentRouter);

apiRouter.use("/users", userRouter);

module.exports = apiRouter;
