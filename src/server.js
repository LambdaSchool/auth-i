const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const morgan = require('morgan');

const STATUS_USER_ERROR = 422;
const BCRYPT_COST = 11;

const User = require('./user');

const server = express();
// to enable parsing of json bodies for post requests
server.use(bodyParser.json());
server.use(morgan('dev'));
server.use(session({
  secret: 'e5SPiqsEtjexkTj3Xqovsjzq8ovjfgVDFMfUzSmJO21dtXs4re'
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

// this variable helped mongoDB connect
const options = {
  useMongoClient: true,
  autoIndex: false,
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 500,
  poolSize: 10,
  bufferMaxEntries: 0
};

mongoose
  .connect('mongodb://localhost/authDB', options)
  .then(() => {
    console.log('\n=== connected to MongoDB ===\n');
  })
  .catch(err => console.log('database connection failed', err));

// TODO: add local middleware to this route to ensure the user is logged in

const authenticate = function (req, res, next) {
  req.hello = `hello ${User}`;

  next();
};

server.use(express.json());

server.get('/me', (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

server.post('/login', (req, res) => {
  const { userName, passwordHash } = req.body;
  User.findOne({ userName })
    .then((user) => {
      if (user) {
        user.isPasswordValid(passwordHash);
      }
    })
    .catch(err => res.status(500).json(err));
});
server.post('/users', (req, res) => {
  const { userName, password } = req.body;
  if (!userName || !password) {
    sendUserError('Please input a user name or password', res);
    return;
  }
  // bcrypt.hash(passwordHash, 11, (err, hash) => {
  //   if (err) {
  //     sendUserError('Password failed to hash', res);
  //     return;
  //   })

  const user = new User(req.body);
  user
      .save()
      .then(savedUser => res.status(200).json(savedUser))
      .catch(err => res.status(500).json(err));
});

module.exports = { server };
