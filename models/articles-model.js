const db = require("../db/connection");
const { fetchTopics } = require("./topics-model");

exports.fetchArticle = (article_id) => {
  const query = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, articles.body,
  COUNT(comments.comment_id) AS comment_count 
  FROM articles
  LEFT JOIN comments 
  ON articles.article_id = comments.article_id
  WHERE articles.article_id = $1
  GROUP BY articles.article_id`;

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

exports.fetchArticles = (topic, order = "desc", sort_by = "created_at") => {
  return fetchTopics()
    .then((topics) => {
      const topicGreenList = [];
      const orderGreenList = ["asc", "desc"];

      if (!orderGreenList.includes(order)) {
        return Promise.reject({ msg: "Wrong order query", status: 400 });
      }

      topics.forEach((topic) => {
        topicGreenList.push(topic.slug);
      });

      const fetchArticle = this.fetchArticle(1);

      return Promise.all([topicGreenList, fetchArticle]);
    })
    .then((data) => {
      const topicGreenList = data[0];
      const sort_byGreenList = Object.keys(data[1].article);

      if (!sort_byGreenList.includes(sort_by)) {
        return Promise.reject({ msg: "Wrong sort_by query", status: 400 });
      }

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
          msg: "Topic which is passed is not found",
          status: 404,
        });
      }
      query += ` GROUP BY articles.article_id
ORDER BY articles.${sort_by} ${order}`;

      return db.query(query, values);
    })
    .then(({ rows }) => rows);
};

exports.updateArticle = (article_id, articleData) => {
  const query = `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`;

  const values = [articleData.inc_votes, article_id];

  return this.fetchArticle(article_id).then(() =>
    db.query(query, values).then(({ rows }) => {
      return { article: rows[0] };
    })
  );
};
