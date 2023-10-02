const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics.controller");

app.get("/api/topics", getTopics);

module.exports = app;
