const db = require("../../db/connection");

exports.selectCategories = () => {
  return db.query("select * from categories").then(({ rows }) => {
    return rows;
  });
};
