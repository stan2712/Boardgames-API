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
        expect(Object.keys(body).length).toBe(10);
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
            comment_count: expect.any(Number),
          })
        );
      });
  });
  test("Get request to /api/reviews/3 responds with review object containing the correct info, including comment count of 3", () => {
    return request(app)
      .get("/api/reviews/3")
      .expect(200)
      .then(({ body }) => {
        expect(Object.keys(body).length).toBe(10);
        expect(body).toEqual(
          expect.objectContaining({
            review_id: 3,
            title: "Ultimate Werewolf",
            category: "social deduction",
            designer: "Akihisa Okui",
            owner: "bainesface",
            review_body: "We couldn't find the werewolf!",
            review_img_url:
              "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
            created_at: "2021-01-18T10:01:41.251Z",
            votes: 5,
            comment_count: 3,
          })
        );
      });
  });
  test("Get request to reivew_id responds with correctly formatted review object including comment count", () => {
    return request(app)
      .get("/api/reviews/6")
      .expect(200)
      .then(({ body }) => {
        expect(Object.keys(body).length).toBe(10);
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
            comment_count: expect.any(Number),
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

describe("/api/reviews", () => {
  test("Sorted by date desc", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body }) => {
        expect(body.reviews).toBeInstanceOf(Array);
        expect(body.reviews.length).toBe(13);
        expect(body.reviews).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  test("Filters by category if given", () => {
    return request(app)
      .get(`/api/reviews?category=dexterity`)
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews).toBeSortedBy("created_at", {
          descending: true,
        });
        reviews.forEach((review) => {
          expect(review).toEqual(
            expect.objectContaining({
              category: "dexterity",
            })
          );
        });
      });
  });
  test("Returns an empty array if category contains no games", () => {
    return request(app)
      .get(`/api/reviews?category=children's+games`)
      .expect(200)
      .then(({ body: { reviews } }) => {
        expect(reviews.length).toBe(0);
      });
  });
  test("404 if category does not exist", () => {
    return request(app)
      .get("/api/reviews?category=BoringGames")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Category not found.");
      });
  });
});

describe("/api/reviews/:review_id/comments", () => {
  test("Correct array of objects sorted by comments.created_at desc", () => {
    return request(app)
      .get("/api/reviews/2/comments")
      .expect(200)
      .then(({ body }) => {
        // console.log(comments, "test 1")
        expect(body.comments).toBeInstanceOf(Array);
        expect(body.comments.length).toBe(3);
        expect(body.comments).toBeSortedBy("created_at", {
          descending: true,
        });
        body.comments.forEach((comments) => {
          expect(Object.keys(comments).length).toBe(6);
          expect(comments).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              review_id: expect.any(Number),
            })
          );
        });
      });
  });
  test("Returns an empty array if review_id has no comments", () => {
    return request(app)
      .get(`/api/reviews/5/comments`)
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments.length).toBe(0);
      });
  });
  test("404 if review_id doesnt exist", () => {
    return request(app)
      .get(`/api/reviews/555/comments`)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("No review corresponds to that ID number");
      });
  });
});

describe("/api/reviews/2/comments", () => {
  test("Post request to /api/reviews/2/comments correctly adds new comment with correct info", () => {
    return request(app)
      .post("/api/reviews/2/comments")
      .send({
        username: "mallionaire",
        body: "What a great comment",
      })
      .expect(201)
      .then(({ body: comment }) => {
        expect(Object.keys(comment).length).toBe(6);
        expect(comment).toEqual(
          expect.objectContaining({
            review_id: 2,
            author: "mallionaire",
            body: "What a great comment",
            comment_id: 7,
            created_at: expect.any(String),
            votes: 0,
          })
        );
      });
  });
  test("400 if ID doesn't exist", () => {
    return request(app)
      .post(`/api/reviews/idiot/comments`)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("404 if username doesnt exist", () => {
    return request(app)
      .post("/api/reviews/3/comments")
      .send({
        username: "karen",
        body: "i hate games",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });

  test("400 if posted comment is incorrect", () => {
    return request(app)
      .post("/api/reviews/3/comments")
      .send({
        gameshater: "karen",
        complaint: "i hate games",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
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
