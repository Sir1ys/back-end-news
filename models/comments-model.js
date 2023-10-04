const db = require("../db/connection");
const { fetchArticle } = require("./articles-model");

exports.fetchComments = (article_id) => {
  const commentsQuery = `SELECT comment_id, votes, created_at, author, body, article_id 
  FROM comments  
  WHERE article_id = $1
  ORDER BY created_at DESC;`;

  return fetchArticle(article_id).then(() =>
    db.query(commentsQuery, [article_id]).then(({ rows }) => {
      return {
        comments: rows,
      };
    })
  );
};

exports.removeComment = (comment_id) => {
  const query = "DELETE FROM comments WHERE comment_id = $1 RETURNING *;";

  const values = [comment_id];

  return db.query(query, values).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({
        msg: `Comment with id ${comment_id} does not exist`,
        status: 404,
      });
    }
  });
};
