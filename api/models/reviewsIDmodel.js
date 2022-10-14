const db = require("../../db/connection");

exports.selectReview = (ID) => {
  return db
    .query(
      `SELECT reviews.*, COUNT(comments.comment_id) ::INT AS comment_count
    FROM reviews 
    LEFT JOIN comments ON comments.review_id=reviews.review_id
    WHERE reviews.review_id=$1
    GROUP BY reviews.review_id`,
      [ID]
    )
    .then(({ rows: [review] }) => {
      if (review) {
        return review;
      } else {
        return Promise.reject({
          status: 404,
          msg: "No review corresponds to that ID number",
        });
      }
    });
};

exports.changeReview = (review_id, addedVotes) => {
  return db
    .query(
      `UPDATE reviews SET votes = votes+$1 WHERE review_id=$2 RETURNING*`,
      [addedVotes, review_id]
    )
    .then(({ rows: [review] }) => {
      if (review) {
        return review;
      } else {
        return Promise.reject({
          status: 404,
          msg: "No review corresponds to that ID number",
        });
      }
    });
};

exports.fetchReviews = (category, sortBy = "created_at", order = "DESC") => {
  //is this greenlisting?
  const greenlistingSortBy = ["ASC", "DESC"];
  const greenlistingQueries = [
    "owner",
    "title",
    "review_id",
    "category",
    "review_img_url",
    "created_at",
    "votes",
    "designer",
    "comment_count",
  ];

  if (
    !greenlistingQueries.includes(sortBy) ||
    !greenlistingSortBy.includes(order)
  ) {
    return Promise.reject({ status: 400, msg: "Invalid query" });
  }

  const params = [];
  let baseQuery = `SELECT reviews.*, COUNT(comments.comment_id) ::INT AS comment_count
  FROM reviews 
  LEFT JOIN comments ON comments.review_id=reviews.review_id`;

  if (category) {
    baseQuery += ` WHERE category=$1`;
    params.push(category);
  }

  baseQuery += ` GROUP BY reviews.review_id ORDER BY ${sortBy} ${order}`;

  return db.query(baseQuery, params).then(({ rows }) => {
    return rows;
  });
};

exports.fetchComments = (ID) => {
  let baseQuery = `SELECT * FROM comments
  WHERE review_id = $1
  ORDER BY created_at DESC`;

  return db.query(baseQuery, [ID]).then(({ rows }) => {
    return rows;
  });
};
