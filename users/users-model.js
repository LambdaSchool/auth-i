// Bridge between server and client

const db = require("../database/dbConfig.js");

module.exports = {
  add,
  find,
  findBy,
  findById,
  getby
};

function find() {
  return db("users").select("id", "username", "password");
}

function findBy(filter) {
  return db("users")
    .select("id", "username", "password")
    .where(filter);
}

function add(user) {
  console.log("user", user);
  return db("users")
    .insert(user, "id")
    .then(ids => {
      const [id] = ids;
      return findById(id);
    });
}

function findById(id) {
  return db("users")
    .select("id", "username")
    .where({ id })
    .first();
}

function getby(filter) {
  return db("users").where(filter);
}
