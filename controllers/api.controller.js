const fs = require("fs");

exports.getEndpoints = (req, res, next) => {
  fs.readFile(`${__dirname}/../endpoints.json`, "utf-8", (err, data) => {
    if (err) next({ msg: "Bad request", status: 400 });

    res.status(200).send(JSON.parse(data));
  });
};
