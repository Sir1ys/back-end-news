const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const endpoints = require("../endpoints.json");

beforeEach(() => seed(data));

afterAll(() => db.end());

describe("/wrong-request", () => {
  // ERROR TESTING
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

  //PATCH testing
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
            votes: 50, //100 is in database
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
            votes: 50, //100 is in database
            article_img_url: expect.any(String),
          })
        );
      });
  });

  //ERROR TESTING

  //GET
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

  //PATCH

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

        // array of articles test
        expect(articles.length).toBe(13);

        // test whether is sorted by date in descending order
        expect(articles).toBeSortedBy("created_at", {
          descending: true,
        });

        // instance of articles test
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

          // test whether body key is not included
          expect(article).not.toHaveProperty("body");
        });
      });
  });
});

describe("/api/articles/:article_id/comments", () => {
  // GET REQUESTS TESTING
  test("GET: 200 sends an array of comments for a single article to the client", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then(({ body }) => {
        const comments = body.comments;

        // checking the length of comments array
        expect(comments.length).toBe(2);

        // checking whether they are sorted by date by default
        expect(comments).toBeSortedBy("created_at", {
          descending: true,
        });

        // checking the instance of comments
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
        // checking the length of comments array
        expect(comments.length).toBe(0);
      });
  });

  // POST REQUESTS TESTING
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
      hobbie: "Reading books", // unnecessary property
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

  //ERROR TESTING
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

  // POST errors
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
      username: "Sasha", // there are no users with this username in our database
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

  //ERROR TESTING
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
});

describe("/api/users", () => {
  test("GET: 200 sends an array of users to the client", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const users = body.users;

        // array of users test
        expect(users.length).toBe(4);

        // instance of user test
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
