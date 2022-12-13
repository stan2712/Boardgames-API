const db = require("../db/connection");

exports.expungeComment = (comment_id) => {
  return db
		.query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *`, [
			comment_id,
		])
		.then(({ rowCount }) => {
			if (rowCount === 0) {
				return Promise.reject({
					status: 404,
					msg: "ID not found. RE-submit request with a valid ID",
				});
			}
		});
};