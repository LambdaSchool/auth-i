const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');

const User = require('./user.js');

const STATUS_USER_ERROR = 422;
const BCRYPT_COST = 11;

const server = express();
// to enable parsing of json bodies for post requests
server.use(bodyParser.json());
server.use(
  session({
    secret: 'e5SPiqsEtjexkTj3Xqovsjzq8ovjfgVDFMfUzSmJO21dtXs4re',
    resave: true,
    saveUninitialized: false,
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

server.post('/users', (req, res) => {
  if (!req.body.username || !req.body.password) {
    return sendUserError();
  }

  const hashedPassword = bcrypt.hash(req.body.password, BCRYPT_COST, (err, hashed) => {
    if (err) throw new Error(err);

    const newUser = new User({ username: req.body.username, passwordHash: hashed });

    newUser
      .save()
      .then((user) => {
        console.log('USER', user);
        res.status(201).json({ message: 'User Created', user });
      })
      .catch((error) => {
        res.status(400).json({ error });
      });
  });
});

/*
(err, hashedPw) => {
    if (err) throw new Error(err);
    dataBase.push({ username, hashedPw });
    res.json({ dataBase });
  });
*/

// TODO: add local middleware to this route to ensure the user is logged in
server.get('/me', (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

module.exports = { server };
