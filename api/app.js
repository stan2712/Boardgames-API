const express = require("express");
const app = express();

const { getCategories } = require("./controllers/categoriescontroller");

app.use(express.json());

app.get("/api/categories", getCategories);

//404 wrong path
app.all("/api/*", (req, res, next) => {
  res.status(404).send({
    msg: "Page not found",
  });
});


module.exports = app;
