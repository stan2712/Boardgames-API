const { selectCategories } = require("../models/categoriesmodel");

exports.getCategories = (req, res) => {
  selectCategories().then((categories) => {
    res.status(200).send(categories);
  });
  //   .catch((err) => {
  //     next(err);
  //   });
};
