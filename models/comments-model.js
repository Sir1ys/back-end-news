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

exports.createComment = () => {};
