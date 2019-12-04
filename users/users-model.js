const db = require("../database/db-config");

module.exports = { find, findBy, findById, add };

function find() {
  return db("users").select("id", "username");
}

function findBy(filter) {
  return db("users")
    .select("id", "username", "password")
    .where(filter);
}

function findById(id) {
  return db("users")
    .select("id", "username")
    .where({ id });
}

function add(user) {
  return db("users")
    .insert(user, "id")
    .then(([id]) => {
      return findById(id);
    });
}
