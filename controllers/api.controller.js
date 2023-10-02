const { fetchEndpoints } = require("../models/api.model");

exports.getEndpoints = (req, res, next) => {
  fetchEndpoints().then((data) => {
    res.status(200).send(data);
  });
};
