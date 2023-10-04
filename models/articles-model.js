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

exports.fetchArticles = (topic) => {
  const topicGreenList = ["mitch", "cats"];

  let query = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url,
  COUNT(comments.comment_id) AS comment_count 
  FROM articles
  LEFT JOIN comments 
  ON articles.article_id = comments.article_id`;
  const values = [];

  if (topic !== undefined && topicGreenList.includes(topic)) {
    query += ` WHERE articles.topic = $1`;
    values.push(topic);
  } else if (topic !== undefined && !topicGreenList.includes(topic)) {
    return Promise.reject({
      msg: "Topic which is passed is invalid",
      status: 400,
    });
  }

  query += ` GROUP BY articles.article_id
  ORDER BY articles.created_at DESC`;

  return db.query(query, values).then(({ rows }) => rows);
};
