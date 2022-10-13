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

exports.fetchReviews = (category) => {
  const params = [];
  let baseQuery = `SELECT reviews.*, COUNT(comments.comment_id) ::INT AS comment_count
  FROM reviews 
  LEFT JOIN comments ON comments.review_id=reviews.review_id`;

  if (category) {
    baseQuery += ` WHERE category=$1`;
    params.push(category);
  }

  baseQuery += ` GROUP BY reviews.review_id ORDER BY created_at DESC;`;

  return db.query(baseQuery, params).then(({ rows }) => {
    return rows;
  });
};
