const bodyParser = require('body-parser');
const express = require('express');
// A session is a place to store data that you want access to across requests.
const session = require('express-session');
const bcrypt = require('bcrypt');

const User = require('./user.js');

const STATUS_USER_ERROR = 422;
const BCRYPT_COST = 11;

const server = express();
// to enable parsing of json bodies for post requests
server.use(bodyParser.json());
server.use(session({
  secret: 'e5SPiqsEtjexkTj3Xqovsjzq8ovjfgVDFMfUzSmJO21dtXs4re',
  resave: true,
  saveUninitialized: false,
}));

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

// TODO: implement routes
// TODO: add local middleware to this route to ensure the user is logged in

server.post('/users', (req, res) => {
  const userInfo = req.body;
  const user = new User(userInfo);
  user
    .save()
    .then((savedUser) => {
      res
        .status(200)
        .json(savedUser);
    })
    .catch((err) => {
      res
        .status(500)
        .json({ MESSAGE: 'There was an error saving the user' });
    });
});

server.post('/log-in', (req, res) => {
  const username = req.body.username.toLowerCase();
  const potentialPW = req.body.passwordHash;

  if (!potentialPW || !username) {
    sendUserError('Username and password required', res);
    return;
  }

  User
    .findOne({
      username
    })
    .then((foundUser) => {
      foundUser.checkPassword(potentialPW, (err, response) => {
        if (response) {
          req.session.username = username;
          res.status(200).json({ success: true, user: req.session.username });
        } else {
          res
            .status(500)
            .json({ success: false });
        }
      });
    })
    .catch((err) => {
      res
        .status(500)
        .json({ MESSAGE: 'There was an error logging in.', error: 'No user found.' });
    });
});

const auth = (req, res, next) => {
  console.log(req.session);
  if (req.session.loggedIn) {
    User.findById(req.session.loggedIn)
      .then((user) => {
        req.user = user;
        next();
      })
      .catch((err) => {
        console.error(err);
      });
  } else {
    res.status(STATUS_USER_ERROR).send({ message: 'You are not logged in' });
  }
};

server.get('/me', auth, (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

module.exports = { server };
