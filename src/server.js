const bodyParser = require("body-parser");
const express = require("express");
const session = require("express-session");

const user = require("./user");

const STATUS_USER_ERROR = 422;
const BCRYPT_COST = 11;

const server = express();
// to enable parsing of json bodies for post requests
server.use(bodyParser.json());
server.use(
  session({
    secret: "e5SPiqsEtjexkTj3Xqovsjzq8ovjfgVDFMfUzSmJO21dtXs4re"
  })
);

/* Sends the given err, a string or an object, to the client. Sets the status
 * code appropriately. */
const sendUserError = (err, res) => {
  res.status(STATUS_USER_ERROR);
  if (err && err.message) {
    res.json({ message: err.message, stack: err.stack });
  } else {
    res.json({ error: err });
  }
};

function authenticate(req, res, next) {
  if (req.body.password === "melon") {
    next();
  } else {
    res.status(401).send("Access denied.");
  }
}

// TODO: implement routes
server.use("/users", user)

server.get('/', )

server.post("/users", function(req, res) {
  const user = new User(req.body);

  user
    .save()
    .then(newUser => res.staus(200).send(newUser))
    .catch(err => res.status(500).send(err));
});

server.post("/login", authenticate, (req, res) => {
  res.send("User authenticated");
});

// TODO: add local middleware to this route to ensure the user is logged in
server.get("/me", (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

module.exports = { server };
