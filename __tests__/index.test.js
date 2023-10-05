const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const endpoints = require("../endpoints.json");

beforeEach(() => seed(data));

afterAll(() => db.end());

describe("/wrong-request", () => {
  test("GET:404 when request was made to wrong URL", () => {
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
  test("GET:200 sends an array of topics to the client", () => {
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
  test("GET:200 sends an object describing all the available endpoints on your API", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual(endpoints);
      });
  });
});

describe("/api/articles/:article_id", () => {
  test("GET:200 sends a single article to the client", () => {
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
});

describe("/api/articles", () => {
  test("GET:200 sends an array of articles to the client", () => {
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

  test("GET: 200 sends an array of articles to the client filtered by topic = cats", () => {
    return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;

        expect(articles.length).toBe(1);

        expect(articles.every((article) => article.topic === "cats")).toBe(
          true
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
});

describe("/api/articles/:article_id/comments", () => {
  test("GET:200 sends an array of comments for a single article to the client", () => {
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

  test("GET:200 sends an empty array for a single article to the client if there are no comments written to this article", () => {
    return request(app)
      .get("/api/articles/13/comments")
      .expect(200)
      .then(({ body }) => {
        const comments = body.comments;
        expect(comments.length).toBe(0);
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
});
