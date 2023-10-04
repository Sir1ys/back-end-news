const db = require("../db/connection");

exports.fetchTopics = () => {
  const query = `SELECT * FROM topics`;

  return db.query(query).then(({ rows }) => rows);
};
