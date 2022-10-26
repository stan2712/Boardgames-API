const express = require("express");
const app = express();

const { getCategories } = require("./controllers/categoriescontroller");
const { getReview, patchReview, getReviewComments, getReviews, postComment } = require("./controllers/reviewsIDcontroller");
const { getUsers } = require("./controllers/usersController");
const { deleteComment } = require("./controllers/commentsController")
const endpoints = require("./endpoints.json")

app.use(express.json());

app.get("/api", (req,res) => {
    res.status(200).send({endpoints})
})
app.get("/api/categories", getCategories); //

app.get("/api/reviews/:review_id", getReview); //

app.get("/api/users", getUsers); //

app.patch("/api/reviews/:review_id", patchReview); //

app.get("/api/reviews", getReviews) //

app.get("/api/reviews/:review_id/comments", getReviewComments) //

app.post("/api/reviews/:review_id/comments", postComment) //

app.delete("/api/comments/:comment_id", deleteComment) //


//404 wrong path
app.all("/api/*", (req, res, next) => {
  res.status(404).send({
    msg: "Page not found",
  });
});

//javascript

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

// psql error

app.use((err, req, res, next) => {
  if (err.code.length === 5 && err.code) {
    res.status(400).send({ msg: "bad request" });
  } else {
    next(err);
  }
});

//500

app.use((err, req, res,) => {
  res.status(500).send({ msg: "internal server error" });
});

module.exports = app;
