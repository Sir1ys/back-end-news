const express = require("express");
const { getTopics } = require("./controllers/topics.controller");

const app = express();

app.get("/api/topics", getTopics);

// //WRONG URL Errors handling
app.all("*", (req, res) => {
  res.status(404).send({
    msg: "Bad request URL",
    status: 404,
  });
});

// PSQL Errors handling
app.use((err, req, res, next) => {
  if (err.code === "23502") {
    res.status(400).send({ msg: "Bad request" });
  }
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad request" });
  }

  next(err);
});

// Custom Errors handling
app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({
      msg: err.msg,
    });
  }

  next(err);
});

// Server Errors handling
app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;
