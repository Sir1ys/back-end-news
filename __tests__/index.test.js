const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const endpoints = require("../endpoints.json");

beforeEach(() => seed(data));

afterAll(() => db.end());

describe("/wrong-request", () => {
  test("GET: 404 when request was made to wrong URL", () => {
    return request(app)
      .get("/wrong-request")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request URL");
        expect(body.status).toBe(404);
      });
  });
});

describe("/api/topics", () => {
  test("GET: 200 sends an array of topics to the client", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const topics = body.topics;

        expect(topics.length).toBe(3);
        topics.forEach((topic) => {
          expect(topic).toHaveProperty("slug", expect.any(String));
          expect(topic).toHaveProperty("description", expect.any(String));
        });
      });
  });
});

describe("/api", () => {
  test("GET: 200 sends an object describing all the available endpoints on your API", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual(endpoints);
      });
  });
});

describe("/api/articles/:article_id", () => {
  test("GET: 200 sends a single article to the client", () => {
    return request(app)
      .get("/api/articles/4")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;

        expect(article).toEqual(
          expect.objectContaining({
            article_id: 4,
            author: expect.any(String),
            title: expect.any(String),
            body: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
          })
        );
      });
  });

  test("GET: 200 sends a single article to the client with comment_count property included", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;

        expect(article).toEqual(
          expect.objectContaining({
            article_id: 1,
            comment_count: "11",
          })
        );
      });
  });

  test("PATCH: 200 returns an article object with the votes property updated if passed inc_votes is positive", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 50 })
      .expect(200)
      .then(({ body }) => {
        const { article } = body;

        expect(article).toEqual(
          expect.objectContaining({
            article_id: 1,
            author: expect.any(String),
            title: expect.any(String),
            body: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: 150,
            article_img_url: expect.any(String),
          })
        );
      });
  });

  test("PATCH: 200 returns an article object with the votes property updated if passed inc_votes is negative", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: -50 })
      .expect(200)
      .then(({ body }) => {
        const { article } = body;

        expect(article).toEqual(
          expect.objectContaining({
            article_id: 1,
            author: expect.any(String),
            title: expect.any(String),
            body: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: 50,
            article_img_url: expect.any(String),
          })
        );
      });
  });

  test("PATCH: 200 returns an article object with the votes property updated. It should ignore any unnecessary properties in the sent object", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: -50, hobbie: "cat" })
      .expect(200)
      .then(({ body }) => {
        const { article } = body;

        expect(article).toEqual(
          expect.objectContaining({
            article_id: 1,
            author: expect.any(String),
            title: expect.any(String),
            body: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: 50,
            article_img_url: expect.any(String),
          })
        );
      });
  });

  test("GET: 404 when passing id doesn't match any of articles", () => {
    return request(app)
      .get("/api/articles/3000")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article with id 3000 does not exist");
      });
  });

  test("GET: 400 when passing id is not valid", () => {
    return request(app)
      .get("/api/articles/sw20")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });

  test("PATCH: 404 when passing id doesn't match any of articles", () => {
    return request(app)
      .patch("/api/articles/112")
      .send({ inc_votes: -50 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article with id 112 does not exist");
      });
  });

  test("PATCH: 400 when passing id is not valid", () => {
    return request(app)
      .patch("/api/articles/hello")
      .send({ inc_votes: -50 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });

  test("PATCH: 400 when required parameter is missing", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });

  test("PATCH: 400 when required parameter is invalid", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: "cat" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
});

describe("/api/articles", () => {
  test("GET: 200 sends an array of articles to the client", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;

        expect(articles.length).toBe(13);

        expect(articles).toBeSortedBy("created_at", {
          descending: true,
        });

        articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              article_id: expect.any(Number),
              author: expect.any(String),
              title: expect.any(String),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
              comment_count: expect.any(String),
            })
          );

          expect(article).not.toHaveProperty("body");
        });
      });
  });

  test("GET: 200 sends an array of articles to the client filtered by topic = mitch", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;

        expect(articles.length).toBe(12);

        expect(articles.every((article) => article.topic === "mitch")).toBe(
          true
        );
      });
  });

  test("GET: 200 sends an empty array of articles to the client filtered by topic = paper, because there are not articles associated with this topic", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;

        expect(articles.length).toBe(0);
      });
  });

  test("GET: 200 sends an array of articles to the client sorting by order, desc by default", () => {
    return request(app)
      .get("/api/articles?order=asc")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;

        expect(articles).toBeSortedBy("created_at", {
          ascending: true,
        });
      });
  });

  test("GET: 200 sends an array of articles to the client sorted by title, created_at by default", () => {
    return request(app)
      .get("/api/articles?sort_by=article_id")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;

        expect(articles).toBeSortedBy("article_id", {
          descending: true,
          coerce: true,
        });
      });
  });

  test.only("POST: 201 returns a new instance of the article. Also, it should ignore any unnecessary properties on the sent article object", () => {
    const articleData = {
      hobbie: "Reading books",
      author: "butter_bridge",
      title: "Welcome to Northcoders",
      body: "This is a wonderful bootcamp",
      topic: "paper",
      url: "https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?w=700&h=700",
    };

    return request(app)
      .post("/api/articles")
      .send(articleData)
      .expect(201)
      .then(({ body }) => {
        const article = body.article;

        console.log(article);
        expect(article).toEqual(
          expect.objectContaining({
            comment_count: expect.any(String),
            votes: 0,
            created_at: expect.any(String),
            article_id: expect.any(Number),
            author: "butter_bridge",
            title: "Welcome to Northcoders",
            body: "This is a wonderful bootcamp",
            topic: "paper",
            article_img_url: "https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?w=700&h=700",
          })
        );
      });
  });

  test("GET: 404 when passed topic is not found", () => {
    return request(app)
      .get("/api/articles?topic=dogs")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Topic which is passed is not found");
      });
  });

  test("GET: 400 when requested to order by query 'wrong_query'", () => {
    return request(app)
      .get("/api/articles?order=wrong_query")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Wrong order query");
      });
  });

  test("GET: 400 when requested to sort by query 'wrong_query'", () => {
    return request(app)
      .get("/api/articles?sort_by=wrong_query")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Wrong sort_by query");
      });
  });
});

describe("/api/articles/:article_id/comments", () => {
  test("GET: 200 sends an array of comments for a single article to the client", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then(({ body }) => {
        const comments = body.comments;

        expect(comments.length).toBe(2);

        expect(comments).toBeSortedBy("created_at", {
          descending: true,
        });

        comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              article_id: 3,
            })
          );
        });
      });
  });

  test("GET: 200 sends an empty array for a single article to the client if there are no comments written to this article", () => {
    return request(app)
      .get("/api/articles/13/comments")
      .expect(200)
      .then(({ body }) => {
        const comments = body.comments;
        expect(comments.length).toBe(0);
      });
  });

  test("POST: 201 sends the posted comment for a particular article", () => {
    const commentData = {
      username: "butter_bridge",
      body: "This is a part of our history",
    };

    return request(app)
      .post("/api/articles/13/comments")
      .send(commentData)
      .expect(201)
      .then(({ body }) => {
        const comment = body.comment;

        expect(comment).toEqual(
          expect.objectContaining({
            comment_id: expect.any(Number),
            votes: 0,
            created_at: expect.any(String),
            author: "butter_bridge",
            body: "This is a part of our history",
            article_id: 13,
          })
        );
      });
  });

  test("POST: 201 sends the posted comment for a particular article. Also, it should ignore any unnecessary properties on the sent comment object", () => {
    const commentData = {
      hobbie: "Reading books",
      username: "butter_bridge",
      body: "This is a part of our history",
    };

    return request(app)
      .post("/api/articles/13/comments")
      .send(commentData)
      .expect(201)
      .then(({ body }) => {
        const comment = body.comment;

        expect(comment).toEqual(
          expect.objectContaining({
            comment_id: expect.any(Number),
            votes: 0,
            created_at: expect.any(String),
            author: "butter_bridge",
            body: "This is a part of our history",
            article_id: 13,
          })
        );
      });
  });

  test("GET: 400 when passing id is not valid", () => {
    return request(app)
      .get("/api/articles/hello/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });

  test("GET: 404 when passing id doesn't match any of articles", () => {
    return request(app)
      .get("/api/articles/3000/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article with id 3000 does not exist");
      });
  });

  test("POST: 400 when passing id is not valid", () => {
    const commentData = {
      username: "butter_bridge",
      body: "This is a part of our history",
    };

    return request(app)
      .post("/api/articles/hello/comments")
      .send(commentData)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });

  test("POST: 400 when missing required field in the sent object", () => {
    const commentData = {
      body: "This is a part of our history",
    };

    return request(app)
      .post("/api/articles/3/comments")
      .send(commentData)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Required field (username or body) is missing");
      });
  });

  test("POST: 404 when passing id doesn't match any of articles", () => {
    const commentData = {
      username: "butter_bridge",
      body: "This is a part of our history",
    };

    return request(app)
      .post("/api/articles/3000/comments")
      .send(commentData)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article with id 3000 does not exist");
      });
  });

  test("POST: 404 when username doesn't match any of users", () => {
    const commentData = {
      username: "Sasha",
      body: "This is a part of our history",
    };

    return request(app)
      .post("/api/articles/13/comments")
      .send(commentData)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
});

describe("/api/comments/:comment_id", () => {
  test("DELETE: 204 send a status 204 and no content if request is successfull", () => {
    return request(app).delete("/api/comments/3").expect(204);
  });

  test("PATCH: 200 returns an comment object with the votes property updated. It should ignore any unnecessary properties in the sent object", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({ inc_votes: 50, hobbie: "cat" })
      .expect(200)
      .then(({ body }) => {
        const { comment } = body;

        expect(comment).toEqual(
          expect.objectContaining({
            comment_id: 1,
            body: expect.any(String),
            votes: 66,
            author: expect.any(String),
            article_id: expect.any(Number),
            created_at: expect.any(String),
          })
        );
      });
  });

  test("DELETE: 400 when passing id is not valid", () => {
    return request(app)
      .delete("/api/comments/hello")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });

  test("DELETE: 404 when passing id doesn't match any of comments", () => {
    return request(app)
      .delete("/api/comments/4000")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Comment with id 4000 does not exist");
      });
  });

  test("PATCH: 400 when passing id is not valid", () => {
    return request(app)
      .patch("/api/comments/hello")
      .send({ inc_votes: 50, hobbie: "cat" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });

  test("PATCH: 404 when passing id doesn't match any of comments", () => {
    return request(app)
      .patch("/api/comments/3000")
      .send({ inc_votes: 50, hobbie: "cat" })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Comment with id 3000 does not exist");
      });
  });
});

describe("/api/users", () => {
  test("GET: 200 sends an array of users to the client", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const users = body.users;

        expect(users.length).toBe(4);

        users.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            })
          );
        });
      });
  });
});

describe("/api/users/:username", () => {
  test("GET: 200 sends an object of particular user to the client", () => {
    return request(app)
      .get("/api/users/butter_bridge")
      .expect(200)
      .then(({ body }) => {
        const user = body.user;

        expect(Object.keys(user).length).toBe(3);

        expect(user).toMatchObject({
          username: "butter_bridge",
          name: "jonny",
          avatar_url:
            "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
        });
      });
  });

  test("GET: 404 when user with the username doesn't exist", () => {
    return request(app)
      .get("/api/users/sir1ys")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("User with sir1ys username doesn't exist");
      });
  });
});
