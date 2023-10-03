const db = require("../db/connection");

exports.fetchComments = (article_id) => {
  const query = `SELECT comment_id, votes, created_at, author, body, article_id 
  FROM comments  
  WHERE article_id = $1;`;

  return db.query(query, [article_id]).then(({ rows }) => {
    return {
      comments: rows,
    };
  });
};
