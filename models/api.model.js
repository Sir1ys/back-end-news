const fs = require("fs");

exports.fetchEndpoints = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(`${__dirname}/../endpoints.json`, "utf-8", (err, data) => {
      if (err) reject({ msg: "Bad request", status: 400 });

      resolve(JSON.parse(data));
    });
  });
};
