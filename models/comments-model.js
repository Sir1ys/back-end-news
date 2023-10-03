const db = require("../db/connection");

exports.fetchComments = (article_id) => {
  const articleQuery = "SELECT * FROM articles WHERE article_id = $1;";
  const commentsQuery = `SELECT comment_id, votes, created_at, author, body, article_id 
  FROM comments  
  WHERE article_id = $1
  ORDER BY created_at DESC;`;

  return db
    .query(articleQuery, [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          msg: `Article with id ${article_id} does not exist`,
          status: 404,
        });
      }
      return db.query(commentsQuery, [article_id]);
    })
    .then(({ rows }) => {
      return {
        comments: rows,
      };
    });
};
