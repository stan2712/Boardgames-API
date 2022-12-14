const {
  selectReview,
  changeReview,
  fetchComments,
  fetchReviews,
  addComments,
} = require("../models/reviewsIDmodel");
const { fetchCategory } = require("../models/categoriesmodel");

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
  const { inc_votes } = req.body;
  changeReview(review_id, inc_votes)
    .then((updatedReview) => {
      res.status(200).send({ updatedReview });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getReviews = (req, res, next) => {
  const { category, sortBy, order } = req.query;
  const promises = [fetchReviews(category, sortBy, order)];

  if (category) {
    promises.push(fetchCategory(category));
  }

  Promise.all(promises)
    .then((promisesReturn) => {
      res.status(200).send({ reviews: promisesReturn[0] });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getReviewComments = (req, res, next) => {
  const { review_id } = req.params;

  const promises = [selectReview(review_id), fetchComments(review_id)];

  Promise.all(promises)
    .then((promisesReturn) => {
      res.status(200).send({ comments: promisesReturn[1] });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postComment = (req, res, next) => {
  const { review_id } = req.params;
  const body = req.body;

  addComments(review_id, body)
    .then((comment) => {
      res.status(201).send(comment);
    })
    .catch((err) => {
      next(err);
    });
};
