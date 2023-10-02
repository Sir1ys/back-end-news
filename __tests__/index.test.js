const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");

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

describe("/api", () => {
  test("GET:200 sends an object describing all the available endpoints on your API", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: endpoints }) => {
        for (const endpoint in endpoints) {
          const values = endpoints[endpoint];
          if (endpoint === "GET /api") {
            expect(values).toHaveProperty("description", expect.any(String));
          } else {
            expect(values).toHaveProperty("description", expect.any(String));
            expect(values).toHaveProperty("queries", expect.any(Array));
            expect(values).toHaveProperty(
              "exampleResponse",
              expect.any(Object)
            );

            const exampleResponse = Object.values(values.exampleResponse)[0];
            expect(true).toBe(Array.isArray(exampleResponse));
          }
        }
      });
  });
});
