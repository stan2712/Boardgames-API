const db = require("../../db/connection");

exports.selectReview = (ID) => {
  return db
    .query(`SELECT * FROM reviews WHERE review_id=$1`, [ID])
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
