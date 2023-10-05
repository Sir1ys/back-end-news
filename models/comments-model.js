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

exports.createComment = (article_id, { username: author, body }) => {
  if (!author || !body) {
    return Promise.reject({
      msg: `Required field (username or body) is missing`,
      status: 400,
    });
  }
  const query =
    "INSERT INTO comments (body, author, article_id) VALUES ($1, $2, $3) RETURNING *;";

  const values = [body, author, article_id];

  return fetchArticle(article_id).then(() =>
    db.query(query, values).then(({ rows }) => {
      return { comment: rows[0] };
    })
  );

};
