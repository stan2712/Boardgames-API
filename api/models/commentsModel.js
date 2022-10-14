const db = require("../../db/connection");

exports.expungeComment = (ID) => {
  return db
    .query(`DELETE FROM comments WHERE comment_id=$1 RETURNING*`, [ID])
    .then(({ rows: comment }) => {
      if (comment.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "ID not found",
        });
      }
    });
};
