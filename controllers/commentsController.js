const { expungeComment } = require("../models/commentsModel");
exports.deleteComment = (req, res, next) => {
    const { comment_id } = req.params;
	expungeComment(comment_id)
		.then(() => {
			res.status(204).send();
		})
		.catch((err) => {
			next(err);
		});
};
