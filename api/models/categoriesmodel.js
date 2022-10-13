const db = require("../../db/connection");

exports.selectCategories = () => {
  return db.query("select * from categories").then(({ rows }) => {
    return rows;
  });
};

exports.fetchCategory = (category) => {
  let queryStr = `SELECT * FROM categories`
  if (category){
    queryStr+= ` WHERE slug=$1`
  }

  return db.query(queryStr, [category]).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({status: 404, msg: "Category not found."})
    }
    return rows;
  });
};