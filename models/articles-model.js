const db = require("../db/connection");

exports.fetchArticle = (article_id) => {
  const query = "SELECT * FROM articles WHERE article_id = $1;";
  return db.query(query, [article_id]).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({
        msg: `Article with id ${article_id} does not exist`,
        status: 404,
      });
    }
    return { article: rows[0] };
  });
};

exports.fetchArticles = () => {};
