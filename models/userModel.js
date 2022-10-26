const db = require("../db/connection");

exports.selectUsers = () => {
  return db.query("select * from users").then(({ rows }) => {
    return rows;
  });
};
