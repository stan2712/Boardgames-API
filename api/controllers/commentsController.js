const { expungeComment } = require("../models/commentsModel");

exports.deleteComment = (req, res, next) => {
    expungeComment(req.params.comment_id).then(() => {
        res.sendstatus(204)
    }).catch((err) => {
        next(err);
    });
}