const express = require("express");
const cors = require('cors');

const {
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors,
  handleWrongUrlErrors,
} = require("./errors");

app.use(cors());

const apiRouter = require("./routers/api-router");

const app = express();

app.use(express.json());

app.use("/api", apiRouter);


// WRONG URL Errors handling

app.all("*", handleWrongUrlErrors);

// PSQL Errors handling
app.use(handlePsqlErrors);

// Custom Errors handling
app.use(handleCustomErrors);

// Server Errors handling
app.use(handleServerErrors);

module.exports = app;
