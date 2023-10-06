const { getTopics } = require("../controllers/topics-controller");
const topicRouter = require("express").Router();

topicRouter.route("/").get(getTopics);

module.exports = topicRouter;
