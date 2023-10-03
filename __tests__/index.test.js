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


describe("/api/articles/:article_id", () => {
  test("GET:200 sends a single article to the client", () => {
    return request(app)
      .get("/api/articles/4")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;

        expect(article).toHaveProperty("article_id", 4);
        expect(article).toHaveProperty("author", expect.any(String));
        expect(article).toHaveProperty("title", expect.any(String));
        expect(article).toHaveProperty("body", expect.any(String));
        expect(article).toHaveProperty("topic", expect.any(String));
        expect(article).toHaveProperty("created_at", expect.any(String));
        expect(article).toHaveProperty("votes", expect.any(Number));
        expect(article).toHaveProperty("article_img_url", expect.any(String));
      });
  });

  //ERROR TESTING
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
