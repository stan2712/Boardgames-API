const express = require("express");
const app = express();

const { getCategories } = require("./controllers/categoriescontroller");

app.use(express.json());

app.get("/api/categories", getCategories);

//404 wrong path
app.all("*", (req, res, next) => {
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
  if (err.code === "22P02") {
    res.status(400).send({ msg: "bad request" });
  } else {
    next(err)
  }
});

//500 error

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "internal server error" });
});

module.exports = app;
