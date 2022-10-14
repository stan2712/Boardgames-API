const { expungeComment } = require("../models/commentsModel");

exports.deleteComment = (req, res, next) => {
    expungeComment(req.params.comment_id).then(() => {
        res.status(204).send()
    }).catch((err) => {
        next(err);
    });
}