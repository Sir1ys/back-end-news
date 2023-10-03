const express = require("express");
const { getTopics } = require("./controllers/topics.controller");

const { getArticle } = require("./controllers/articles-controller");
const {
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors,
  handleWrongUrlErrors,
} = require("./errors");

const { getEndpoints } = require("./controllers/api.controller");


const app = express();

app.get("/api/topics", getTopics);


app.get("/api/articles/:article_id", getArticle);

app.get("/api", getEndpoints);

// //WRONG URL Errors handling
app.all("*", handleWrongUrlErrors);

// PSQL Errors handling
app.use(handlePsqlErrors);

// Custom Errors handling
app.use(handleCustomErrors);

// Server Errors handling
app.use(handleServerErrors);

module.exports = app;
