const express = require("express");
const { getTopics } = require("./controllers/topics.controller");

const app = express();

app.get("/api/topics", getTopics);

app.all("*", (req, res) => {
  throw new Error("Bad request");
});

//WRONG URL Errors handling
app.use((err, req, res, next) => {
  if (err.message === "Bad request") {
    res.status(400).send({
      msg: err.message,
      status: 400,
    });
  }

  next(err);
});

// Custom Errors handling
app.use((err, req, res, next) => {
  if (err.status) {
    console.log("sss");
    res.status(err.status).send({
      msg: err.msg,
    });
  }
});

module.exports = app;
