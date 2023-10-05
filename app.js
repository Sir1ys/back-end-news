const express = require("express");

const { getTopics } = require("./controllers/topics-controller");

const { getEndpoints } = require("./controllers/api-controller");

const {
  getComments,
  postComment,
} = require("./controllers/comments-controller");

const {
  getArticle,
  getArticles,
} = require("./controllers/articles-controller");

const {
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors,
  handleWrongUrlErrors,
} = require("./errors");

const app = express();

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticle);

app.get("/api", getEndpoints);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getComments);

// parse request body as JSON
app.use(express.json())

app.post("/api/articles/:article_id/comments", postComment);

// WRONG URL Errors handling
app.all("*", handleWrongUrlErrors);

// PSQL Errors handling
app.use(handlePsqlErrors);

// Custom Errors handling
app.use(handleCustomErrors);

// Server Errors handling
app.use(handleServerErrors);

module.exports = app;
