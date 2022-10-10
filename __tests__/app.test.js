const request = require("supertest");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const testData = require("../db/data/test-data");
const app = require("../api/app");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("/api/categories", () => {
  test("Get request to /api/categories responds with array of category objects", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeInstanceOf(Array);
        expect(body.length).toBe(4);
        body.forEach((obj) => {
          expect(obj).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
      });
  });
});

describe("Errors for bad paths", () => {
  test("status 404 bad request for a very bad path", () => {
    return request(app)
      .get("/api/thispathdoesntexist...unless?")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Page not found");
      });
  });
});
