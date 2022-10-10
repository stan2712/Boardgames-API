const db = require("../../db/connection");

exports.selectCategories = () => {
  return db.query("select * from categories").then(({ rows }) => {
    // console.log(rows, "mod");
    return rows;
  });
};
