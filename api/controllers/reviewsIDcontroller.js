const { selectReview, changeReview } = require("../models/reviewsIDmodel");

exports.getReview = (req, res, next) => {
  selectReview(req.params.review_id)
    .then((review) => {
      res.status(200).send(review);
    })
    .catch((err) => {
      next(err);
    });
};
exports.patchReview = (req, res, next) => {
  const { review_id } = req.params;
  const {inc_votes} = req.body
  changeReview(review_id, inc_votes)
    .then((updatedReview) => {
      res.status(200).send({ updatedReview });
    })
    .catch((err) => {
      next(err);
    });
};

