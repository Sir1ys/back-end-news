const db = require("../db/connection");

exports.fetchTopics = () => {
  const query = `SELECT * FROM topics`;

  return db
    .query(query)
    .then(({ rows }) =>
      rows.length === 0
        ? Promise.reject({ msg: "Bad request", status: 400 })
        : rows
    );
};
