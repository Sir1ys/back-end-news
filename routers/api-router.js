const apiRouter = require("express").Router();
const { getEndpoints } = require("../controllers/api-controller");
const topicRouter = require("./topic-router");

apiRouter.route("/").get(getEndpoints);

apiRouter.use("/topics", topicRouter);

module.exports = apiRouter;
