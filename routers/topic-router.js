const topicRouter = require("express").Router();

const { getTopics } = require("../controllers/topics-controller");

topicRouter.route("/").get(getTopics);

module.exports = topicRouter;
