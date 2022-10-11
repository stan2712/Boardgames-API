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

describe("/api/reviews/:reviews_id", () => {
  test("Get request to reivew_id responds with correctly formatted review object", () => {
    return request(app)
      .get("/api/reviews/6")
      .expect(200)
      .then(({ body }) => {
        expect(Object.keys(body).length).toBe(9);
        expect(body).toEqual(
          expect.objectContaining({
            review_id: expect.any(Number),
            title: expect.any(String),
            review_body: expect.any(String),
            designer: expect.any(String),
            review_img_url: expect.any(String),
            votes: expect.any(Number),
            category: expect.any(String),
            owner: expect.any(String),
            created_at: expect.any(String),
          })
        );
      });
  });
  test("Get request to /api/reviews/8 responds with review object containing the correct info", () => {
    return request(app)
      .get("/api/reviews/8")
      .expect(200)
      .then(({ body }) => {
        expect(Object.keys(body).length).toBe(9);
        expect(body).toEqual(
          expect.objectContaining({
            review_id: 8,
            title: "One Night Ultimate Werewolf",
            review_body: "We couldn't find the werewolf!",
            designer: "Akihisa Okui",
            review_img_url:
              "https://images.pexels.com/photos/5350049/pexels-photo-5350049.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
            votes: 5,
            category: "social deduction",
            owner: "mallionaire",
            created_at: "2021-01-18T10:01:41.251Z",
          })
        );
      });
  });
  test("status 404 bad request for incorrect ID number", () => {
    return request(app)
      .get("/api/reviews/1234")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("No review corresponds to that ID number");
      });
  });
  test("status 400 invalid review_id type", () => {
    return request(app)
      .get("/api/reviews/bestgame")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
});

describe("/api/users", () => {
  test("Get request to /api/users responds with array of user objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeInstanceOf(Array);
        expect(body.length).toBe(4);
        body.forEach((obj) => {
          expect(obj).toEqual(
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

describe("/api/reviews/:review_id", () => {
  test("Patch request to /api/reviews/:review_id correctly increments vote count and returns correct object", () => {
    return request(app)
      .patch("/api/reviews/8")
      .send({ inc_votes: 10 })
      .expect(200)
      .then(({ body: { updatedReview } }) => {
        expect(Object.keys(updatedReview).length).toBe(9);
        expect(updatedReview).toEqual(
          expect.objectContaining({
            review_id: 8,
            title: "One Night Ultimate Werewolf",
            review_body: "We couldn't find the werewolf!",
            designer: "Akihisa Okui",
            review_img_url:
              "https://images.pexels.com/photos/5350049/pexels-photo-5350049.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
            votes: 15,
            category: "social deduction",
            owner: "mallionaire",
            created_at: "2021-01-18T10:01:41.251Z",
          })
        );
      });
  });
  test("Patch request to /api/reviews/:review_id correctly increments vote count with negative inc_vote and returns correct object", () => {
    return request(app)
      .patch("/api/reviews/8")
      .send({ inc_votes: -10 })
      .expect(200)
      .then(({ body: { updatedReview } }) => {
        expect(Object.keys(updatedReview).length).toBe(9);
        expect(updatedReview).toEqual(
          expect.objectContaining({
            review_id: 8,
            title: "One Night Ultimate Werewolf",
            review_body: "We couldn't find the werewolf!",
            designer: "Akihisa Okui",
            review_img_url:
              "https://images.pexels.com/photos/5350049/pexels-photo-5350049.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
            votes: -5,
            category: "social deduction",
            owner: "mallionaire",
            created_at: "2021-01-18T10:01:41.251Z",
          })
        );
      });
  });
  test("status 400 bad request if parameter of inc votes is not a number", () => {
    return request(app)
      .patch("/api/reviews/8")
      .send({ riggedvote: 5 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("status 400 invalid review_id type", () => {
    return request(app)
      .get("/api/reviews/bestgame")
      .send({ inc_votes: 5 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("status 404 bad request for a very bad path", () => {
    return request(app)
      .patch("/api/reviews/888")
      .send({ inc_votes: 5 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("No review corresponds to that ID number");
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
